import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { pushtalk } from '@tools';

export class HomeScreen extends Component<any, any> {
    componentDidMount() {
        const listener = pushtalk.addListener(data => console.log(data));
        pushtalk.init({
            bufferSize: 4096,
            sampleRate: 44100,
            bitsPerChannel: 16,
            channelsPerFrame: 1,
        });
        pushtalk.start();
        // pushtalk.stop();
        // listener.remove();
    }
    render() {
        return (
            <View>
                <Text> textInComponent </Text>
            </View>
        )
    }
}