import InCallManager from 'react-native-incall-manager';
import {
  mediaDevices,
  MediaStream,
  RTCDataChannel,
  RTCPeerConnection,
  MediaStreamTrack,
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
  private stream: MediaStream;
  public onData: (userId, data) => void;
  public onChannelOpen: () => void;
  public onChannelClose: () => void;
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

  public async connect() {
    const stream = await mediaDevices.getUserMedia({audio: true, video: false});
    this.stream = <any>stream;
    InCallManager.setSpeakerphoneOn(true);

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
      if (pc && pc.pc) {
        pc.pc.close();
        if (pc.dc) {
          pc.dc.close();
        }
      }
      delete this.peers[userId];
      this.onConnectionChange('disconnected', userId);
    }
  }

  public close() {
    for (const key in this.peers) {
      this.leave(key);
    }
  }

  public speakerOnOff(value: boolean) {
    InCallManager.setSpeakerphoneOn(value);
  }
  public async startMediaStream() {
    this.stream.getTracks().forEach((t) => {
      if (t.kind === 'audio') t.enabled = true;
    });
    InCallManager.setMicrophoneMute(false);
  }

  public stopMediaStream() {
    this.stream.getTracks().forEach((t) => {
      if (t.kind === 'audio') t.enabled = false;
    });
    InCallManager.setMicrophoneMute(true);
  }

  private createChannel(peer: RTCPeerConnection, id) {
    const dataChannel = peer.createDataChannel(this.groupId);

    dataChannel.onerror = (error) => {
      console.warn(error);
    };

    dataChannel.onmessage = (event) => {
      if (this.onData) {
        this.onData(id, event);
      }
    };

    dataChannel.onopen = () => {
      if (this.onChannelOpen) {
        this.onChannelOpen();
      }
    };

    dataChannel.onclose = () => {
      if (this.onChannelClose) {
        this.onChannelClose();
      }
    };
    if (!this.peers[id]) {
      this.peers[id] = {};
    }

    this.peers[id].dc = dataChannel;
  }

  private async createOffer(peer, id) {
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    this.socket.send('exchange', {to: id, sdp: peer.localDescription});
  }

  private async createPeer(id, isOffer) {
    if (id in this.peers) {
      return;
    }

    const peer: RTCPeerConnection = new RTCPeerConnection(this.configuration);
    peer.onnegotiationneeded = async () => {
      if (isOffer) {
        await this.createOffer(peer, id);
      }
    };
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        this.socket.send('exchange', {to: id, candidate: event.candidate});
      }
    };

    peer.oniceconnectionstatechange = (event) => {
      if (
        event.target.iceConnectionState === 'connected' ||
        event.target.iceConnectionState === 'disconnected'
      ) {
        if (event.target.iceConnectionState === 'connected') {
          this.createChannel(peer, id);
        }
        if (this.onConnectionChange) {
          this.onConnectionChange(event.target.iceConnectionState, id);
        }
      }
    };
    peer.addStream(this.stream);
    InCallManager.setMicrophoneMute(true);
    this.stream.getTracks().forEach((t) => {
      if (t.kind === 'audio') t.enabled = false;
    });
    if (!this.peers[id]) {
      this.peers[id] = {};
    }

    this.peers[id].pc = peer;
    return peer;
  }

  private async exchange(data) {
    const fromId = data.from;
    let pc: RTCPeerConnection;
    if (fromId in this.peers) {
      pc = this.peers[fromId].pc;
    } else {
      pc = await this.createPeer(fromId, false);
    }
    if (data.sdp) {
      await pc.setRemoteDescription(data.sdp);
      if (pc.remoteDescription.type == 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        this.socket.send('exchange', {to: fromId, sdp: pc.localDescription});
      }
    } else if (data.candidate) {
      await pc.addIceCandidate(data.candidate);
    }
  }
}
