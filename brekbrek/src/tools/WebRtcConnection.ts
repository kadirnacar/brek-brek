import {
  RTCDataChannel,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import {SocketClient} from './SocketClient';

export class WebRtcConnection {
  constructor(
    socket: SocketClient,
    groupId: string,
    userId: string,
    configuration?: any,
  ) {
    this.groupId = groupId;
    this.userId = userId;
    this.socket = socket;
    this.peers = {};
    this.socket.onMessageEvent = this.onSocketMessage.bind(this);
    this.configuration = {...this.configuration, ...configuration};
  }
  private socket: SocketClient;
  private userId: string;
  private groupId: string;
  private configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  private peers: {[key: string]: {pc?: RTCPeerConnection; dc?: RTCDataChannel}};
  public onData: (userId, data) => void;
  public onChannelOpen: (users: string[]) => void;
  public onChannelClose: (users: string[]) => void;
  public onConnectionChange: (
    status: 'connected' | 'disconnected',
    userId: string,
  ) => void;

  private async onSocketMessage(event: WebSocketMessageEvent) {
    const data = JSON.parse(event.data);
    switch (data.command) {
      case 'join':
        for (var i = 0; i < data.peers.length; i++) {
          const peer = data.peers[i];
          if (peer != this.userId) {
            await this.createPeer(peer, true);
          }
        }
        break;
      case 'exchange':
        await this.exchange(data);
        break;
      case 'leave':
        await this.leave(data.userId);
        break;
    }
  }

  public connect() {
    this.socket.send('join');
  }

  public sendData(data) {
    for (const key in this.peers) {
      const pc = this.peers[key];
      if (pc.dc) {
        pc.dc.send(JSON.stringify(data));
      }
    }
  }

  private leave(userId) {
    if (userId in this.peers) {
      const pc = this.peers[userId];
      pc.pc.close();
      pc.dc.close();
      delete this.peers[userId];
      this.onConnectionChange('disconnected', userId);
    }
  }

  public close() {
    for (const key in this.peers) {
      this.leave(key);
    }
  }

  private async createPeer(id, isOffer) {
    if (id in this.peers) {
      return;
    }
    const peer: RTCPeerConnection = new RTCPeerConnection(this.configuration);
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.send('exchange', {to: id, candidate: event.candidate});
      }
    };
    peer.onnegotiationneeded = async () => {
      if (isOffer) {
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        this.socket.send('exchange', {to: id, sdp: peer.localDescription});
      }
    };
    peer.oniceconnectionstatechange = (event) => {
      if (
        event.target.iceConnectionState === 'connected' ||
        event.target.iceConnectionState === 'disconnected'
      ) {
        if (this.onConnectionChange) {
          this.onConnectionChange(
            event.target.iceConnectionState,
            id,
          );
        }
      }
    };

    const dataChannel = peer.createDataChannel(this.groupId);

    dataChannel.onerror = (error) => {};

    dataChannel.onmessage = (event) => {
      if (this.onData) {
        this.onData(id, event);
      }
    };

    dataChannel.onopen = () => {
      if (this.onChannelOpen) {
        this.onChannelOpen(Object.keys(this.peers));
      }
    };

    dataChannel.onclose = () => {
      if (this.onChannelClose) {
        this.onChannelClose(Object.keys(this.peers));
      }
    };
    if (!this.peers[id]) {
      this.peers[id] = {};
    }
    this.peers[id].dc = dataChannel;
    if (!this.peers[id]) {
      this.peers[id] = {};
    }
    // if (isOffer) {
    //   const offer = await peer.createOffer();
    //   await peer.setLocalDescription(offer);
    //   this.socket.send('exchange', {to: id, sdp: peer.localDescription});
    // }
    this.peers[id].pc = peer;
    return this.peers[id];
  }

  private async exchange(data) {
    const fromId = data.from;
    let pc: RTCPeerConnection;
    if (fromId in this.peers) {
      pc = this.peers[fromId].pc;
    } else {
      pc = (await this.createPeer(fromId, false)).pc;
    }

    if (data.sdp) {
      await pc.setRemoteDescription(new RTCSessionDescription(data.sdp));
      if (pc.remoteDescription.type == 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.socket.send('exchange', {to: fromId, sdp: pc.localDescription});
      }
    } else if (data.candidate) {
      await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  }
}
