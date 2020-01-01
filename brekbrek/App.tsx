import { pushtalk, SocketConnection } from '@tools';
import React, { Component } from 'react';
import { Text, TouchableHighlight, View, TouchableOpacity, StyleSheet } from 'react-native';
import { ExposedToJava } from './app/tools/ExposedToJava';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import config from '@config';
import Icon from 'react-native-vector-icons/FontAwesome5';

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);

interface AppState {
    isTalk: boolean;
}

export default class App extends Component<any, AppState> {
    constructor(props: any) {
        super(props);
        this.socket = new SocketConnection();
        this.state = {
            isTalk: false
        }
    }
    socket: SocketConnection;
    autoReconnectInterval = 5 * 1000;
    connectServer() {
        const listener = pushtalk.addListener(data => {
            this.socket.send({
                type: "buffer",
                buffer: data.buffer,
                codec: data.codec,
                compressCodec: data.compressCodec,
                compressBuffer: data.compressBuffer
            });
        });
        this.socket.connect();
        pushtalk.init({
            bufferSize: 4096,
            sampleRate: 44100,
            bitsPerChannel: 16,
            channelsPerFrame: 1,
        });
    }
    componentDidMount() {
        this.connectServer();
    }

    render() {
        return <View style={styles.container}>
            <TouchableHighlight
                underlayColor="#ffffff00"
                onPressIn={() => {
                    this.setState({ isTalk: true });
                    console.log(pushtalk.init)
                   

                    this.socket.send({ type: "start" });
                    pushtalk.start();
                }}
                onPressOut={() => {
                    pushtalk.stop();
                    this.socket.send({ type: "stop" });
                    this.setState({ isTalk: false });
                }}>
                <View style={[styles.myButton, { backgroundColor: this.state.isTalk ? '#ff0000' : '#4267B2' }]}>
                    <Icon name="microphone" size={75} style={{ color: "#fff" }} />
                </View>
            </TouchableHighlight>
        </View>
        // <View>
        //     <TouchableOpacity
        //         onPressIn={() => {
        //             pushtalk.init({
        //                 bufferSize: 4096,
        //                 sampleRate: 44100,
        //                 bitsPerChannel: 16,
        //                 channelsPerFrame: 1,
        //             });
        //             pushtalk.start();
        //         }}
        //         onPressOut={() => {
        //             pushtalk.stop();

        //         }}>
        //         <Icon name="microphone" size={75} style={{ color: "#999" }} />
        //     </TouchableOpacity>
        // </View>
        // return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
        //     {this.state.isLoaded ? <Provider store={this.store}>
        //         <AppContainer style={{ backgroundColor: 'transparent' }} />
        //     </Provider> : null}
        // </SafeAreaView>
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    myButton: {
        padding: 5,
        height: 200,
        width: 200,  //The Width must be the same as the height
        borderRadius: 400, //Then Make the Border Radius twice the size of width or Height   
        backgroundColor: '#4267B2',
        alignContent: "center",
        alignItems: "center",
        alignSelf: "center",
        justifyContent: "center"
    }
});