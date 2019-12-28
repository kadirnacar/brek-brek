import { pushtalk } from '@tools';
import React, { Component } from 'react';
import { Text, TouchableHighlight, View } from 'react-native';
import { Store } from 'redux';
import { ExposedToJava } from './app/tools/ExposedToJava';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import config from '@config';

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);
// const { height, width } = Dimensions.get('window')

interface AppState {
    isLoaded: boolean;
}

export default class App extends Component<any, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }
    socket: WebSocket;

    componentDidMount() {
        this.setState({ isLoaded: true });
        const listener = pushtalk.addListener(data => {
            // console.log(data.buffer.length, data.codec.length, data.compressCodec.length);
            this.socket.send(JSON.stringify({ buffer: data.buffer.length, codec: data.codec.length, compressCodec: data.compressCodec.length }));
        });

        this.socket = new WebSocket(config.wsUrl);
        this.socket.onopen = () => {
        };

        this.socket.onmessage = (e) => {
            // a message was received
            console.log("socket message", e.data);
        };

        this.socket.onerror = (e) => {
            // an error occurred
            console.log("socket error", e.message);
        };

        this.socket.onclose = (e) => {
            // connection closed
            console.log("socket close", e.code, e.reason);
        };
    }

    render() {
        return <View>
            <TouchableHighlight onPress={() => {
                pushtalk.init({
                    bufferSize: 4096,
                    sampleRate: 44100,
                    bitsPerChannel: 16,
                    channelsPerFrame: 1,
                });

                pushtalk.start();
            }}><Text>Start</Text></TouchableHighlight>
            <TouchableHighlight onPress={() => {

                pushtalk.stop();
            }}><Text>Stop</Text></TouchableHighlight>
        </View>
        // return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
        //     {this.state.isLoaded ? <Provider store={this.store}>
        //         <AppContainer style={{ backgroundColor: 'transparent' }} />
        //     </Provider> : null}
        // </SafeAreaView>
    }
}
