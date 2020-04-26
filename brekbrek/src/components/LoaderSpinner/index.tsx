import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';

interface ILaderSpinnerState {
}

interface ILoaderSpinnerProps {
    showLoader?: boolean;
    onCloseModal?: () => void
}

export class LoaderSpinner extends Component<ILoaderSpinnerProps, ILaderSpinnerState> {
    render() {
        return (
            <Modal visible={this.props.showLoader || false}
                transparent={true}
                onRequestClose={() => {
                    if (this.props.onCloseModal) {
                        this.props.onCloseModal();
                    }
                }}>
                <View style={[styles.container, styles.horizontal]}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            </Modal>
        )
    }
}

export default LoaderSpinner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: "#ffffff88"
    },
    horizontal: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        padding: 10
    }
})