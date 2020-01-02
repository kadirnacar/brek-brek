import { AuthActions } from "@reducers";
import { ApplicationState } from "@store";
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { Button } from "@material-ui/core";
import { withSnackbar, useSnackbar } from 'notistack';
import config from "@config";

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }
  context: AudioContext;
  handleClick = () => {
    this.props.enqueueSnackbar('I love snacks.');
  };

  componentDidMount() {
    try {
      // Fix up for prefixing
      window.AudioContext = window.AudioContext || window["webkitAudioContext"];
      this.context = new AudioContext();
    }
    catch (e) {
      alert('Web Audio API is not supported in this browser');
    }
    const ws: WebSocket = new WebSocket(config.wsUrl);
    ws.onopen = () => {
      console.log('connected')
      ws.send("web client")

    }
    let bsn: AudioBufferSourceNode;


    ws.onmessage = async evt => {
      console.log(evt);

      if (evt.data == "start") {

      } else if (evt.data == "stop") {

      } else {
        new Response(evt.data).arrayBuffer().then(value => {
          this.context.decodeAudioData(value).then(buffer => {

            if (bsn == null) {
              bsn = this.context.createBufferSource();
              bsn.buffer = buffer;
              bsn.connect(this.context.destination);
              bsn.start(0);
              bsn.addEventListener("ended", () => {
                bsn = null;
              })
            }

          })

        })
      }



      // var arrayBuffer = await new Response(evt.data).arrayBuffer();
      // let buffer = await this.context.decodeAudioData(arrayBuffer);
      // var source = this.context.createBufferSource(); // creates a sound source
      // source.buffer = buffer;                    // tell the source which sound to play
      // source.connect(this.context.destination);       // connect the source to the context's destination (the speakers)
      // source.start(0);

      // this.context.decodeAudioData(arrayBuffer);
      // context.decodeAudioData(request.response, function(buffer) {
      //   dogBarkingBuffer = buffer;
      // }, onError);
    }

    ws.onclose = () => {
      console.log('disconnected')
    }
  }

  render() {
    return (
      <React.Fragment>
        <div>Brek Brek</div>
      </React.Fragment>
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
