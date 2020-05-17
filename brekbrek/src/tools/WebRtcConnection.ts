import InCallManager from 'react-native-incall-manager';
import {
  mediaDevices,
  MediaStream,
  RTCDataChannel,
  RTCPeerConnection,
  MediaStreamTrack,
} from 'react-native-webrtc';
import {SocketClient} from './SocketClient';
import {generateKey, encryptData, decryptData} from '@utils';
import config from '@config';

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
  private key;
  private socket: SocketClient;
  private userId: string;
  private groupId: string;
  private configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  private peers: {[key: string]: {pc?: RTCPeerConnection; dc?: RTCDataChannel}};
  private stream: MediaStream;
  private track: MediaStreamTrack;
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
          if (peer in this.peers) this.leave(peer);
          if (peer != this.userId) {
            await this.createPeer(peer, true);
          }
        }
        break;
      case 'exchange':
        await this.exchange(data);
        break;
      case 'leave':
        // await this.leave(data.userId);
        break;
    }
  }

  public async connect() {
    this.key = await generateKey(config.securityKey, 'salt', 5000, 256);
    if (!this.stream) {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });
      this.stream = <any>stream;
      this.stream.getTracks().forEach((t) => {
        if (t.kind === 'audio') {
          t.stop();
        }
      });
    }
    // this.stream.removeTrack(this.track);
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
    try {
      // InCallManager.setMicrophoneMute(false);
      // InCallManager.stop();
      const tracks = this.stream.getTracks();
      tracks.forEach((trkc) => {
        this.stream.removeTrack(trkc);
        trkc.stop();
      });
      
    } catch {}
  }

  public speakerOnOff(value: boolean) {
    InCallManager.setSpeakerphoneOn(value);
  }
  public async startMediaStream() {
    this.stream.getTracks().forEach((t) => {
      if (t.kind === 'audio') t.enabled = true;
      console.log(t);
    });
    // InCallManager.setMicrophoneMute(false);
  }

  public stopMediaStream() {

    this.stream.getTracks().forEach((t) => {
      if (t.kind === 'audio') t.enabled = false;
      // t.stop();
    });
    // InCallManager.setMicrophoneMute(true);
  }

  private createChannel(peer: RTCPeerConnection, id) {
    if (!peer) return;

    const dataChannel = peer.createDataChannel(this.groupId);

    dataChannel.onerror = (error) => {
      console.warn('dataChannel.onerror', error);
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
    if (!peer) return;
    const offer = await peer.createOffer();
    await peer.setLocalDescription(offer);
    const data = JSON.stringify(peer.localDescription);
    const sdp = await encryptData(data, this.key);
    this.socket.send('exchange', {to: id, sdp});
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
    peer.onicecandidate = async (event) => {
      if (event.candidate) {
        const data = JSON.stringify(event.candidate);
        const candidate = await encryptData(data, this.key);
        this.socket.send('exchange', {to: id, candidate});
      }
    };

    peer.oniceconnectionstatechange = (event) => {
      if (
        event.target.iceConnectionState === 'connected' ||
        event.target.iceConnectionState === 'disconnected'
      ) {
        if (event.target.iceConnectionState === 'connected') {
          if (this.onConnectionChange) {
            this.onConnectionChange(event.target.iceConnectionState, id);
          }
          this.createChannel(peer, id);
        }
      } else if (event.target.iceConnectionState === 'failed') {
        this.connect();
      }
    };
    peer.addStream(this.stream);
    // InCallManager.setMicrophoneMute(true);
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
      const decryptSdp = JSON.parse(await decryptData(data.sdp, this.key));
      await pc.setRemoteDescription(decryptSdp);
      if (pc.remoteDescription.type == 'offer') {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const data = JSON.stringify(pc.localDescription);
        const sdp = await encryptData(data, this.key);
        this.socket.send('exchange', {to: fromId, sdp});
      }
    } else if (data.candidate) {
      const decryptCandidate = JSON.parse(
        await decryptData(data.candidate, this.key),
      );
      await pc.addIceCandidate(decryptCandidate);
    }
  }
}
