import config from '@config';
import { pushtalk } from '@tools';
import React, { Component } from 'react';
import { TouchableHighlight, View, StyleSheet } from 'react-native';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { ExposedToJava } from './app/tools/ExposedToJava';
import Icon from 'react-native-vector-icons/FontAwesome5';

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);

interface AppState {
    isTalk: boolean;
}

export default class App extends Component<any, AppState> {
    constructor(props: any) {
        super(props);
        this.state = {
            isTalk: false
        }
    }
    store: any;
    connectServer() {
        pushtalk.init({
            wsUrl: config.wsUrl
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
                    pushtalk.start();
                }}
                onPressOut={() => {
                    pushtalk.stop();
                    this.setState({ isTalk: false });
                }}>
                <View style={[styles.myButton, { backgroundColor: this.state.isTalk ? '#ff0000' : '#4267B2' }]}>
                    <Icon name="microphone" size={75} style={{ color: "#fff" }} />
                </View>
            </TouchableHighlight>
        </View>
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