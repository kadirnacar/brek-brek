import { AuthActions } from "@reducers";
import { ApplicationState } from "@store";
import { withSnackbar } from 'notistack';
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { WebRtcConnection, socket } from '@tools';
import Peer, { DataConnection } from 'peerjs';
import { Button } from "@material-ui/core";
import array from "array-compression";

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = {
      sendAudio: false, peerList: []
    }
  }

  // rtcCon: WebRtcConnection;
  peerListener: Peer;
  peerCon: DataConnection;
  name: string;
  peerList: string[];
  sendAudio: Boolean = false;
  audio: MediaStream;
  audioContext: AudioContext;
  recorder: MediaRecorder;
  startTime: number;
  chunks: any[] = [];
  firstChunk: any = null;

  playBuffer(buf) {
    var source = this.audioContext.createBufferSource();
    source.buffer = buf;
    source.connect(this.audioContext.destination);
    source.start(0);
  }

  async componentDidMount() {
    this.startTime = 0;
    this.name = prompt("name?");
    this.sendAudio = false;
    this.peerListener = new Peer(name, { host: 'localhost', port: 3001, path: 'api/peerjs' });

    this.audioContext = new AudioContext();
    this.peerListener.on('connection', (con) => {

      this.peerListener.listAllPeers((ids: string[]) => {
        this.setState({ peerList: ids.filter(i => i != this.peerListener.id) })
      });

      con.on('data', (data: ArrayBuffer) => {
        if (data instanceof ArrayBuffer) {
          this.audioContext.decodeAudioData(data, (soundBuffer) => {
            this.playBuffer(soundBuffer);
          }, (x) => {
            console.log(x);
          });
        } 
      })
    });

    this.audio = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: { noiseSuppression: true, channelCount: 2, echoCancellation: true },
    });
  }

  async handleAudioData(e: BlobEvent) {
    this.chunks.push(e.data);
    if (this.firstChunk == null)
      this.firstChunk = e.data;

    if (this.chunks.length == 10) {
      const blob: Blob = new Blob(this.chunks, { 'type': 'audio/ogg; codecs=opus' });
      this.sendData(blob);
      this.chunks = [];
      this.chunks.push(this.firstChunk);
    }
  }
  async startAudio() {
    if (this.recorder) {
      this.recorder.stop();
      this.recorder.ondataavailable = null;
      this.recorder = null;
    }
    this.peerListener.listAllPeers((ids: string[]) => {
      this.setState({ peerList: ids.filter(i => i != this.peerListener.id) },
        () => {
          var options = {
            audioBitsPerSecond: 16000,
            mimeType: 'audio/webm\;codecs=opus'
            // audioBitsPerSecond: 128000,
            // mimeType: 'audio/webm\;codecs=opus'
          }
          this.recorder = new MediaRecorder(this.audio, options);
          this.recorder.ondataavailable = this.handleAudioData.bind(this);
          this.recorder.start(60);
        })
    });
  }

  sendData(data: any) {
    this.state.peerList.forEach(id => {
      if (!this.peerCon) {
        this.peerCon = this.peerListener.connect(id);
        this.peerCon.on("open", () => {
          this.peerCon.send(data);
        })
      } else {
        this.peerCon.send(data);
      }
    })
  }


  render() {
    return (
      <React.Fragment >
        <audio id="audio">
          <source id="source" type="audio/webm;codecs=opus"></source>
        </audio>
        <Button onClick={() => {
          var name = prompt("name");
          this.sendData(name);
        }}>mesaj gönder</Button>
        <Button onClick={() => {
          this.startAudio();
        }}>ses data gönder</Button>
      </React.Fragment >
    );
  }
}

var component = withRouter(connect(
  (state: ApplicationState) => state.Auth,
  dispatch => {
    return {
      AuthActions: bindActionCreators({ ...AuthActions }, dispatch)
    };
  }
)(withSnackbar(Home)) as any);

export default (component as any) as typeof Home;
