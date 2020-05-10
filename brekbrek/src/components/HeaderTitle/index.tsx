import React, {Component} from 'react';
import {StyleProp, Text, TextStyle} from 'react-native';
import {connect} from 'react-redux';
import {ApplicationState, LocalStorage} from '../../store';
import {IUser} from '@models';

interface HeaderTitleState {
  user?: IUser;
}

interface HeaderTitleProps {
  style?: StyleProp<TextStyle>;
}

type Props = HeaderTitleProps & ApplicationState;

class HeaderTitleComp extends Component<Props, HeaderTitleState> {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }
  async componentDidMount() {
    const user = await LocalStorage.getItem('user');
    if (user) {
      this.setState({user: JSON.parse(user)});
    }
  }
  render() {
    return (
      <Text
        style={[
          this.props.style
        ]}>
        {'BrekBrek'}
      </Text>
    );
  }
}

export const HeaderTitle = connect(
  (state: ApplicationState) => state,
  (dispatch) => {
    return {};
  },
)(HeaderTitleComp);
