import { ApplicationState } from '@store';
import React, { Component } from 'react';
import { View, Text, Button } from 'react-native';
import { connect } from 'react-redux';
import { NavigationProp } from '@react-navigation/native';

interface HomeScreenState {
}

interface HomeProps {
    navigation: NavigationProp<any>;
}

type Props = HomeProps & ApplicationState;

export class HomeScreenComp extends Component<Props, HomeScreenState> {
    constructor(props) {
        super(props);
        this.props.navigation.setOptions({
            // headerLeft: () => { },
            // headerRight: () => { },
            canGoBack: true
        })
    }
    render() {
        return (
            <View>
                <Text>Hello World !</Text>
            </View>
        )
    }
}
export const HomeScreen = connect(
    (state: ApplicationState) => state,
    dispatch => {
        return {
        };
    }
)(HomeScreenComp);