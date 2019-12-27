import { AppContainer } from '@navigation';
import { ApplicationState } from '@store';
import React, { Component } from 'react';
import { Dimensions, SafeAreaView } from 'react-native';
import { Provider } from "react-redux";
import { Store } from 'redux';
import { configureStore } from './app/store/configureStore';

const { height, width } = Dimensions.get('window')

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

    store: Store<ApplicationState>;
    checkInterval: any;

    componentDidMount() {
        const initialState = {};
        this.store = configureStore(initialState);
        this.setState({ isLoaded: true });
    }

    render() {
        return <SafeAreaView style={{ flex: 1, width: width, height: height, backgroundColor: 'white' }} >
            {this.state.isLoaded ? <Provider store={this.store}>
                <AppContainer style={{ backgroundColor: 'transparent' }} />
            </Provider> : null}
        </SafeAreaView>
    }
}
