import { AuthActions } from "@reducers";
import { ApplicationState } from "@store";
import { withSnackbar } from 'notistack';
import * as React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { bindActionCreators } from "redux";
import { WebRtcConnection, socket } from '@tools';
import Peer from 'peerjs';

class Home extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

  rtcCon: WebRtcConnection;

  handleClick = () => {
    this.props.enqueueSnackbar('I love snacks.');
  };

  componentDidMount() {
    var name = prompt("name?");
    const peer = new Peer(name, { host: 'localhost', port: 3001, path: '/peerjs' });
    const conn: Peer.DataConnection = peer.connect(name == "kadir" ? 'ozan' : 'kadir');
    peer.on("open", (id) => {
      console.log("open", id)
      conn.send("lşlöşlöş")
    });
    conn.on("data", (data) => {
      console.log(data);
    })
    // this.rtcCon = new WebRtcConnection("1");

    // socket.addEvent("connect", (data) => {
    //   this.rtcCon.doOffer().then(() => {
    //     socket.sendMessage("info", this.rtcCon.getInfo());
    //   })
    // });

    // socket.addEvent("info", (data) => {
    //   this.rtcCon.setAnswer(data);
    // });

    // this.rtcCon.onReady = () => {
    //   socket.sendMessage("ready", null);
    // }

    // this.rtcCon.start();
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
