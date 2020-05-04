import React, {Component} from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
} from 'react-native';

interface IFormModalState {
  show?: boolean;
}

interface IFormModalProps {
  show?: boolean;
  title?: string;
  onCloseModal?: () => void;
  onCancelPress?: () => void;
  onOkPress?: () => void;
}

export class FormModal extends Component<IFormModalProps, IFormModalState> {
  constructor(props) {
    super(props);
    this.state = {show: false};
  }

  componentDidMount() {
    this.setState({show: this.props.show});
  }
  componentDidUpdate(prevProps, prevState) {
    if (this.props.show != prevProps.show) {
      this.setState({show: this.props.show});
    }
    // if (
    //   this.state.show != prevState.show
    // ) {
    //   this.setState({show: this.props.show});
    // }
  }
  render() {
    return (
      <Modal
        visible={this.state.show || false}
        transparent={true}
        onRequestClose={() => {
          this.setState({show: false});
          if (this.props.onCloseModal) {
            this.props.onCloseModal();
          }
        }}>
        <View style={[styles.container, styles.horizontal]}>
          <View style={styles.formContainer}>
            <View style={styles.formActionBar}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <Text
                  style={{
                    backgroundColor: '#bbb',
                    marginTop: -10,
                    borderTopLeftRadius: 10,
                    borderTopRightRadius: 10,
                    padding: 10,
                    justifyContent: 'center',
                    textAlign: 'center',
                    fontSize: 16,
                    fontWeight: 'bold',
                  }}>
                  {this.props.title}
                </Text>
              </View>
            </View>

            <View style={styles.formContent}>{this.props.children}</View>
            <View style={styles.formActionBar}>
              <View style={{flexDirection: 'column', flex: 1}}>
                <TouchableOpacity
                  style={styles.cancelAction}
                  onPress={() => {
                    if (this.props.onCancelPress) {
                      this.props.onCancelPress();
                    }
                  }}>
                  <Text style={styles.buttonText}>İptal</Text>
                </TouchableOpacity>
              </View>
              <View style={{flexDirection: 'column', flex: 1}}>
                <TouchableOpacity
                  style={styles.okAction}
                  onPress={() => {
                    if (this.props.onOkPress) {
                      this.props.onOkPress();
                    }
                  }}>
                  <Text style={styles.buttonText}>Tamam</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}

export default FormModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff88',
    alignContent: 'center',
    alignItems: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
  },
  formContainer: {
    backgroundColor: '#f6f6f6',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#aaa',
    width: '100%',
    padding: 10,
  },
  formContent: {
    width: '100%',
    padding: 5,
    paddingTop: 15,
    flexDirection: 'row',
  },
  formActionBar: {
    borderRadius: 10,
    marginBottom: -10,
    marginRight: -10,
    marginLeft: -10,
    flexDirection: 'row',
    backgroundColor: '#f6f6f6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelAction: {
    borderBottomLeftRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    borderColor: '#fff',
    borderTopWidth: 1,
    backgroundColor: '#40cca2',
    width: '100%',
  },
  okAction: {
    borderBottomRightRadius: 10,
    borderColor: '#fff',
    borderTopWidth: 1,
    borderLeftWidth: 1,
    backgroundColor: '#40cca2',
    padding: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
});
