import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {NavigationProp} from '@react-navigation/native';
import {UserActions} from '@reducers';
import React, {Component} from 'react';
import {TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ApplicationState} from 'src/store';

interface HeaderRightState {}

interface HeaderRightProps {
  UserActions: typeof UserActions;
  navigation?: NavigationProp<any>;
}

type Props = HeaderRightProps & ApplicationState;

class HeaderRightComp extends Component<Props, HeaderRightState> {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <TouchableOpacity
        style={{marginHorizontal: 10}}
        onPress={async () => {
          await this.props.UserActions.clear();

          this.props.navigation.navigate('Login');
        }}>
        <FontAwesome5 name="power-off" size={20} color="#fff" />
      </TouchableOpacity>
    );
  }
}

export const HeaderRight = connect(
  (state: ApplicationState) => state,
  (dispatch) => {
    return {
      UserActions: bindActionCreators({...UserActions}, dispatch),
    };
  },
)(HeaderRightComp);
