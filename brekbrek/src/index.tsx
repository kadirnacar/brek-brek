import { AppNavigation } from '@navigation';
import React, { Component } from 'react';
import { View } from 'react-native';
import SafeAreaView, { SafeAreaProvider } from 'react-native-safe-area-view';
import { Provider } from "react-redux";
import store from './tools/store';

interface AppState {
    isLoaded: boolean;
}
export default class App extends Component<any, AppState> {
    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false
        }
    }
    async componentDidMount() {
        this.setState({ isLoaded: true });
    }
    render() {
        return <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, flexDirection: "row" }} forceInset={{ top: "always", bottom: "never" }}>
                {this.state.isLoaded ? <Provider store={store}>
                    <AppNavigation />
                </Provider> : <View></View>}
            </SafeAreaView>
        </SafeAreaProvider>
    }
}