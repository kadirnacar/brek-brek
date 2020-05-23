import config from '@config';
import {decryptData, encryptData, generateKey, log} from '@utils';
import {RTCDataChannel, RTCPeerConnection} from 'react-native-webrtc';
import {SocketClient} from './SocketClient';

export class WebRtcConnection {
  constructor(
    socket: SocketClient,
    groupId: string,
    userId: string,
    configuration?: any,
    userName?: string,
  ) {
    this.groupId = groupId;
    this.userId = userId;
    this.userName = userName;
    this.socket = socket;
    this.peers = {};
    this.socket.onMessageEvent = this.onSocketMessage.bind(this);
    this.configuration = {...this.configuration, ...configuration};
  }
  private userName;
  private key;
  private socket: SocketClient;
  private userId: string;
  private groupId: string;
  private configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  private peers: {[key: string]: {pc?: RTCPeerConnection; dc?: RTCDataChannel}};
  public onData: (userId, data) => void;
  public onChannelOpen: () => void;
  public onChannelClose: () => void;
  public onConnectionChange: (
    status: 'connected' | 'disconnected',
    userId: string,
  ) => Promise<void>;

  private async onSocketMessage(event: WebSocketMessageEvent) {
    const data = JSON.parse(event.data);
    switch (data.command) {
      case 'join':
        // for (const key in this.peers) {
        for (var i = 0; i < data.peers.length; i++) {
          const peer = data.peers[i];
          if (peer in this.peers) await this.leave(peer, false);
          if (peer != this.userId) {
            await this.createPeer(peer, true);
          }
        }
        break;
      case 'exchange':
        console.log(data);
        await this.exchange(data);
        break;
      case 'leave':
        //await this.leave(data.userId, true);
        if (data.userId == this.userId) {
          await this.connect();
        }
        break;
    }
  }

  public async connect() {
    this.key = await generateKey(config.securityKey, 'salt', 5000, 256);
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

  public async leave(userId, trigger) {
    if (userId in this.peers) {
      const pc = this.peers[userId];
      if (pc && pc.pc) {
        pc.pc.close();
        if (pc.dc) {
          pc.dc.close();
        }
      }
      delete this.peers[userId];

      if (trigger && this.onConnectionChange && userId != this.userId) {
        await this.onConnectionChange('disconnected', userId);
      }
    }
  }

  public async close() {
    for (const key in this.peers) {
      await this.leave(key, false);
    }
  }

  public speakerOnOff(value: boolean) {}

  private createChannel(peer: RTCPeerConnection, id) {
    if (!peer) return;

    const dataChannel = peer.createDataChannel(this.groupId);

    dataChannel.onerror = (error) => {
      log.error(error);
      console.log(this.userName, 'dataChannel.onerror', error);
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
      console.log(this.userName, 'dataChannel.onclose');
    };
    if (!this.peers[id]) {
      this.peers[id] = {};
    }

    this.peers[id].dc = dataChannel;
  }

  private async createOffer(peer, id) {
    try {
      if (!peer) return;
      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);
      const data = JSON.stringify(peer.localDescription);
      const sdp = await encryptData(data, this.key);
      this.socket.send('exchange', {to: id, sdp});
    } catch (ex) {
      this.leave(id, true);
      await this.createPeer(id, true);
      console.log(this.userName, 'createOffer', ex);
    }
  }

  private async createPeer(id, isOffer) {
    if (id in this.peers) {
      await this.leave(id, false);
    }
    const self = this;
    const peer: RTCPeerConnection = new RTCPeerConnection(this.configuration);
    peer.onnegotiationneeded = async () => {
      if (isOffer) {
        await self.createOffer(peer, id);
      }
    };
    peer.onicecandidate = async (event) => {
      if (event.candidate) {
        const data = JSON.stringify(event.candidate);
        const candidate = await encryptData(data, self.key);
        self.socket.send('exchange', {to: id, candidate});
      }
    };

    peer.oniceconnectionstatechange = async (event) => {
      if (
        event.target.iceConnectionState === 'connected' ||
        event.target.iceConnectionState === 'disconnected'
      ) {
        if (self.onConnectionChange) {
          await self.onConnectionChange(event.target.iceConnectionState, id);
        }
      } else if (event.target.iceConnectionState === 'closed') {
        if (self.onConnectionChange && id != self.userId) {
          await self.onConnectionChange('disconnected', id);
        }
        await self.leave(id, true);
      } else if (event.target.iceConnectionState === 'failed') {
        if (self.onConnectionChange && id != self.userId) {
          await self.onConnectionChange('disconnected', id);
        }
        await self.leave(id, true);
        await self.createPeer(id, true);
      }
      console.log(
        self.userName,
        'peer.oniceconnectionstatechange',
        event.target.iceConnectionState,
      );
    };
    peer.onsignalingstatechange = () => {
      console.log(self.userName, 'peer.onsignalingstatechange');
    };
    peer.onicecandidateerror = async (err) => {
      console.log(err);
      await this.leave(id, true);
    };

    if (!this.peers[id]) {
      this.peers[id] = {};
    }
    this.createChannel(peer, id);

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
    if (data.candidate) {
      try {
        const decryptCandidate = JSON.parse(
          await decryptData(data.candidate, this.key),
        );
        await pc.addIceCandidate(decryptCandidate);
      } catch (ex) {
        await this.leave(fromId, true);
        console.log('exchange candidate error', this.userName, ex);
      }
    } else if (data.sdp) {
      try {
        const decryptSdp = JSON.parse(await decryptData(data.sdp, this.key));
        await pc.setRemoteDescription(decryptSdp);
        if (pc.remoteDescription.type == 'offer') {
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);

          const data = JSON.stringify(pc.localDescription);
          const sdp = await encryptData(data, this.key);
          this.socket.send('exchange', {to: fromId, sdp});
        }
      } catch (ex) {
        await this.leave(fromId, true);
        console.log('exchange sdp error', this.userName, ex);
      }
    }
  }
}
