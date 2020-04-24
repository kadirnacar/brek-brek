import React, {Component} from 'react';
import {Text, TextInput, TouchableOpacity, View} from 'react-native';

interface IMassage {
  date?: Date;
  message?: string;
  sender?: string;
}
interface AppState {
  message?: string;
  messages?: IMassage[];
}

export class App extends Component<any, AppState> {
  constructor(props: any) {
    super(props);
    this.state = {messages: []};
  }
  socket!: WebSocket;
  componentDidMount() {
    console.log('load');
    this.socket = new WebSocket('ws://192.168.8.103:3001');
    this.socket.onmessage = (event) => {
      const {messages} = this.state;
      messages?.push({date: new Date(), message: event.data});
      this.setState({messages});
      console.log(event);
    };
    this.socket.onerror = (evt) => {
      console.error('error', evt);
    };
    this.socket.onopen = () => {
      console.log('open');
    };
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
                  padding:5,
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
              this.socket.send(this.state.message || '');
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
