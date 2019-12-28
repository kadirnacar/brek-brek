import React, { Component } from 'react'
import { Text, View, TouchableHighlight } from 'react-native'
import { pushtalk } from '@tools';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { ExposedToJava } from '../../tools/ExposedToJava';

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);


export class HomeScreen extends Component<any, any> {
    componentDidMount() {
        
        // pushtalk.stop();
        // listener.remove();
    }
    render() {
        return (
            <View>
                <TouchableHighlight onPress={() => {
                    const listener = pushtalk.addListener(data => console.log(data));
                    pushtalk.init({
                        bufferSize: 4096,
                        sampleRate: 44100,
                        bitsPerChannel: 16,
                        channelsPerFrame: 1,
                    });
                    pushtalk.start();
                    console.log("ok")
                }}><Text>deneme</Text></TouchableHighlight>
            </View>
        )
    }
}