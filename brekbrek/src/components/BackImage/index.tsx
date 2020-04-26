import React, { Component } from 'react';
import { ImageBackground } from 'react-native';

interface BackImageState {
}

interface BackImageProps {
}

type Props = BackImageProps;


export class BackImage extends Component<Props, BackImageState> {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <ImageBackground source={require("../../../assets/background.jpg")} style={{ flex: 1 }}>
                {this.props.children}
            </ImageBackground>
        )
    }
}

