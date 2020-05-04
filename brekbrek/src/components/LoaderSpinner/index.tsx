import React, {Component} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleSheet,
  View,
  BackHandler,
} from 'react-native';

interface ILaderSpinnerState {
  showLoader?: boolean;
}

interface ILoaderSpinnerProps {
  showLoader?: boolean;
  onCloseModal?: () => void;
}

export class LoaderSpinner extends Component<
  ILoaderSpinnerProps,
  ILaderSpinnerState
> {
  constructor(props) {
    super(props);
    this.state = {showLoader: true};
  }
 
  componentDidMount() {
    this.setState({showLoader: this.props.showLoader});
  }
  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.showLoader != prevProps.showLoader 
    ) {
      this.setState({showLoader: this.props.showLoader});
    }
  }
  render() {
    return (
      <Modal
        visible={this.state.showLoader || false}
        transparent={true}
        onRequestClose={() => {
          this.setState({showLoader: false});
          if (this.props.onCloseModal) {
            this.props.onCloseModal();
          }
        }}>
        <View style={[styles.container, styles.horizontal]}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </Modal>
    );
  }
}

export default LoaderSpinner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff88',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
});
