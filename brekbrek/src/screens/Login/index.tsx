import {BackImage, LoaderSpinner} from '@components';
import messaging from '@react-native-firebase/messaging';
import {NavigationProp} from '@react-navigation/native';
import {UserActions} from '@reducers';
import {ApplicationState} from '@store';
import {colors, styles} from '@tools';
import React, {Component} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

interface LoginState {
  username?: string;
  password?: string;
  isRequest?: boolean;
  fcmToken?: string;
}

interface LoginProps {
  UserActions: typeof UserActions;
  navigation: NavigationProp<any>;
}

type Props = LoginProps & ApplicationState;

export class LoginScreenComp extends Component<Props, LoginState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleFacebookLogin = this.handleFacebookLogin.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
  }
  async componentDidMount() {
    await this.props.UserActions.clear();
    const fcmToken = await messaging().getToken();
    this.setState({fcmToken: fcmToken});
    console.log('fcmToken', fcmToken);
  }

  async handleGoogleLogin() {
    this.setState({isRequest: true});
    const result = await this.props.UserActions.loginWithGoogle(
      this.state.fcmToken,
    );
    if (!result || !result['success']) {
      Alert.alert(
        !result['message']
          ? 'Giriş Başarısız. Lütfen bilgilerinizi kontrol ediniz.'
          : result['message'],
        null,
        [
          {
            text: 'Tamam',
            onPress: () => {
              this.setState({isRequest: false});
            },
          },
        ],
      );
    } else {
      this.props.navigation.navigate('Home');
      this.setState({isRequest: false});
    }
  }
  async handleFacebookLogin() {
    this.setState({isRequest: true});
    const result = await this.props.UserActions.loginWithFacebook(
      this.state.fcmToken,
    );
    if (!result || !result['success']) {
      Alert.alert(
        !result['message']
          ? 'Giriş Başarısız. Lütfen bilgilerinizi kontrol ediniz.'
          : result['message'],
        null,
        [
          {
            text: 'Tamam',
            onPress: () => {
              this.setState({isRequest: false});
            },
          },
        ],
      );
    } else {
      this.props.navigation.navigate('Home');
      this.setState({isRequest: false});
    }
  }
  render() {
    return (
      <BackImage>
        <LoaderSpinner showLoader={this.state.isRequest} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <KeyboardAvoidingView behavior="padding" style={style.container}>
            <Text
              style={[
                styles.primaryButtonText,
                {marginBottom: 10, textAlign: 'center'},
              ]}>
              Giriş Yapınız
            </Text>
            <TouchableOpacity
              style={{
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                marginBottom: 20,
                borderRadius: 10,
                padding: 10,
                flexDirection: 'row',
              }}
              onPress={this.handleGoogleLogin}>
              <FontAwesome5
                name="google"
                size={25}
                style={{
                  width: '30%',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                }}
              />
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: '#000000',
                    textAlign: 'left',
                    width: '70%',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                Google Hesabı
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                alignContent: 'center',
                alignItems: 'center',
                backgroundColor: '#ffffff',
                marginBottom: 20,
                borderRadius: 10,
                padding: 10,
                flexDirection: 'row',
              }}
              onPress={this.handleFacebookLogin}>
              <FontAwesome5
                name="facebook"
                size={25}
                style={{
                  width: '30%',
                  alignContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  textAlign: 'center',
                }}
              />
              <Text
                style={[
                  styles.primaryButtonText,
                  {
                    color: '#000000',
                    textAlign: 'left',
                    width: '70%',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                  },
                ]}>
                Facebook Hesabı
              </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </BackImage>
    );
  }
}

const style = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    paddingTop: 20,
    backgroundColor: colors.color1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
});

export const LoginScreen = connect(
  (state: ApplicationState) => {
    return state;
  },
  (dispatch) => {
    return {
      UserActions: bindActionCreators({...UserActions}, dispatch),
    };
  },
)(LoginScreenComp);
