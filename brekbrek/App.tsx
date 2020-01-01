import config from '@config';
import { AppContainer } from '@navigation';
import { pushtalk } from '@tools';
import React, { Component } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import BatchedBridge from 'react-native/Libraries/BatchedBridge/BatchedBridge';
import { Provider } from 'react-redux';
import { ExposedToJava } from './app/tools/ExposedToJava';
import { configureStore } from './app/store/configureStore';

const exposedToJava = new ExposedToJava();
BatchedBridge.registerCallableModule("JavaScriptVisibleToJava", exposedToJava);

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
    store: any;
    connectServer() {
        pushtalk.init({
            wsUrl: config.wsUrl
        });
    }

    componentDidMount() {
        this.connectServer();
        this.store = configureStore({});
        this.setState({ isLoaded: true })
    }

    render() {
        return <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            {this.state.isLoaded ? <Provider store={this.store}>
                <AppContainer style={{ backgroundColor: 'transparent' }} />
            </Provider> : null}
        </SafeAreaView>
    }
}