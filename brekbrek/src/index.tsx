import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';
import {SocketClient} from './tools/SocketClient';
import config from '@config';

interface IMassage {
  date?: Date;
  message?: string;
  sender?: string;
}
interface AppState {
  message?: string;
  messages?: IMassage[];
}

export default class App extends Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.socketClient = new SocketClient(config.wsUrl);
    this.state = {messages: []};
  }
  socketClient: SocketClient;
  async componentDidMount() {
    const result = await this.socketClient.connect();
    console.log(result);
    if (result == WebSocket.OPEN) {
      this.socketClient.send({msg: 'deneme'});
    } else {
      // this.socketClient.dispose();
      // this.socketClient = null;
    }
  }

  render() {
    return (
      <View style={{flex: 1}}>
        <View style={{flex: 1, borderWidth: 1}}>
          {this.state.messages?.map((msg, index) => {
            return (
              <View
                key={index}
                style={{
                  borderRadius: 10,
                  marginVertical: 5,
                  borderWidth: 1,
                  padding: 5,
                  flexDirection: 'row',
                }}>
                <Text>{msg.message}</Text>
              </View>
            );
          })}
        </View>
        <View style={{borderWidth: 1, height: 60, flexDirection: 'row'}}>
          <TextInput
            style={{borderWidth: 1, width: '80%'}}
            value={this.state.message}
            onChangeText={(text) => {
              this.setState({message: text});
            }}
          />
          <TouchableOpacity
            style={{
              borderWidth: 1,
              width: '20%',
              height: 60,
              borderRadius: 40,
              alignContent: 'center',
              alignItems: 'center',
              alignSelf: 'center',
            }}
            onPress={() => {
              // this.socket.send(this.state.message || '');
              this.setState({message: ''});
            }}>
            <Text
              style={{
                alignSelf: 'center',
                height: '100%',
                fontSize: 32,
                fontWeight: 'bold',
              }}>
              >
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
