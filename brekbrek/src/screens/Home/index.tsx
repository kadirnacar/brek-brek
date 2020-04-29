import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native-gesture-handler';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import SafeAreaView from 'react-native-safe-area-view';

interface HomeScreenState {}

interface HomeProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = HomeProps & ApplicationState;

export class HomeScreenComp extends Component<Props, HomeScreenState> {
  constructor(props) {
    super(props);
    this.props.navigation.setOptions({
      // headerLeft: () => { },
      // headerRight: () => { },
      canGoBack: true,
    });
  }
  async componentDidMount() {
    await this.props.GroupActions.getUserGroups();
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.props.Group.groups.map((group, index) => {
          return (
            <View
              key={index}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cccccc',
                height: 60,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                }}>
                {group.Name}
              </Text>
            </View>
          );
        })}
        <View
          style={{
            backgroundColor: '#ff5722',
            width: 70,
            height: 70,
            borderRadius: 35,
            position: 'absolute',
            right: 10,
            bottom: 40,
          }}>
          <TouchableHighlight
            onPress={async () => {
              await this.props.GroupActions.createItem({Name: 'group 1'});
            }}
            style={{
              width: 70,
              borderRadius: 35,
              alignItems: 'center',
              justifyContent: 'center',
              alignContent: 'center',
              alignSelf: 'center',
              height: 70,
            }}>
            <FontAwesome5Icon name="plus" size={30} color="#ffffff" />
          </TouchableHighlight>
        </View>
      </SafeAreaView>
    );
  }
}
export const HomeScreen = connect(
  (state: ApplicationState) => state,
  (dispatch) => {
    return {
      GroupActions: bindActionCreators({...GroupActions}, dispatch),
    };
  },
)(HomeScreenComp);
