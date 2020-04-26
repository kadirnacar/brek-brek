import {BackImage, LoaderSpinner} from '@components';
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
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

interface RegisterState {
  username?: string;
  password?: string;
  isRequest?: boolean;
}

interface RegisterProps {
  UserActions: typeof UserActions;
  navigation: NavigationProp<any>;
}

type Props = RegisterProps & ApplicationState;

export class RegisterScreenComp extends Component<Props, RegisterState> {
  constructor(props) {
    super(props);
    this.state = {};
    this.handleRegister = this.handleRegister.bind(this);
  }
  async componentDidMount() {
    await this.props.UserActions.clear();
  }
  async handleRegister() {
    this.setState({isRequest: true});
    const result = await this.props.UserActions.register(
      this.state.username,
      this.state.password,
    );
    if (!result) {
      // Alert.alert(
      //   'Giriş Başarısız. Lütfen bilgilerinizi kontrol ediniz.',
      //   null,
      //   [
      //     {
      //       text: 'Tamam',
      //       onPress: () => {
      //         this.setState({isRequest: false});
      //       },
      //     },
      //   ],
      // );
    } else {
      this.setState({isRequest: false});

      Alert.alert('Kayıt Başarılı', null, [
        {
          text: 'Tamam',
          onPress: () => {
            this.props.navigation.navigate('Home');
          },
        },
      ]);
    }
    this.setState({isRequest: false});
  }
  render() {
    return (
      <BackImage>
        <LoaderSpinner showLoader={this.state.isRequest} />
        <View style={{flex: 1, justifyContent: 'center'}}>
          <KeyboardAvoidingView behavior="padding" style={style.container}>
            <TextInput
              style={styles.input}
              textContentType="emailAddress"
              keyboardType="email-address"
              placeholder="E-Posta"
              placeholderTextColor="#ffffff"
              value={this.state.username}
              onChangeText={(text) => this.setState({username: text})}
            />
            <TextInput
              style={styles.input}
              secureTextEntry={true}
              placeholderTextColor="#ffffff"
              placeholder="Şifre"
              value={this.state.password}
              onChangeText={(text) => this.setState({password: text})}
            />
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={this.handleRegister}>
              <Text style={styles.primaryButtonText}>Kaydol</Text>
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

export const RegisterScreen = connect(
  (state: ApplicationState) => {
    return state;
  },
  (dispatch) => {
    return {
      UserActions: bindActionCreators({...UserActions}, dispatch),
    };
  },
)(RegisterScreenComp);
