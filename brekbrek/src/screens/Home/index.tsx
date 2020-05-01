import {NavigationProp} from '@react-navigation/native';
import {GroupActions} from '@reducers';
import {ApplicationState} from '@store';
import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import SafeAreaView from 'react-native-safe-area-view';
import {LoaderSpinner, FormModal} from '@components';
import {IGroup} from '@models';

interface HomeScreenState {
  showAddGroup?: boolean;
  showEditGroup?: boolean;
  showDeleteGroup?: boolean;
  newGroupName?: string;
  currentGroup?: IGroup;
}

interface HomeProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
}

type Props = HomeProps & ApplicationState;

export class HomeScreenComp extends Component<Props, HomeScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      showAddGroup: false,
    };
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
        <LoaderSpinner showLoader={this.props.Group.isRequest} />
        {this.props.Group.groups.map((group, index) => {
          return (
            <View
              key={index}
              style={{
                padding: 10,
                borderBottomWidth: 1,
                borderBottomColor: '#cccccc',
                minHeight: 50,
              }}>
              <Text
                style={{
                  fontSize: 16,
                  color: '#000',
                }}>
                {group.Name}
              </Text>
              <View
                style={{
                  position: 'absolute',
                  height: 40,
                  flexDirection: 'row',
                  right: 10,
                  top: 3,
                }}>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#aaa',
                    padding: 7,
                    borderRadius: 24,
                    flexDirection: 'column',
                    marginRight: 10,
                  }}
                  onPress={() => {
                    this.setState({currentGroup: group, showEditGroup: true});
                  }}>
                  <FontAwesome5Icon name="pen" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    borderWidth: 1,
                    borderColor: '#aaa',
                    padding: 7,
                    borderRadius: 24,
                    backgroundColor: '#f24979',
                    flexDirection: 'column',
                  }}
                  onPress={() => {
                    this.setState({currentGroup: group, showDeleteGroup: true});
                  }}>
                  <FontAwesome5Icon name="trash" size={24} color={'#ffffff'} />
                </TouchableOpacity>
              </View>
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
              this.setState({showAddGroup: true, newGroupName: ''});
              // await this.props.GroupActions.createItem({Name: 'group 1'});
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
        <FormModal
          show={this.state.showAddGroup}
          title={`Grup Oluştur`}
          onCancelPress={() => {
            this.setState({showAddGroup: false});
          }}
          onOkPress={async () => {
            await this.setState({showAddGroup: false}, async () => {
              if (this.state.newGroupName)
                await this.props.GroupActions.createItem({
                  Name: this.state.newGroupName,
                });
            });
          }}>
          <TextInput
            placeholder="Grup Adı"
            value={this.state.newGroupName}
            style={{borderWidth: 1, flex: 1, padding: 5, borderRadius: 5}}
            onChangeText={(text) => {
              this.setState({newGroupName: text});
            }}
          />
        </FormModal>

        <FormModal
          show={this.state.showEditGroup && !!this.state.currentGroup}
          title={`Düzenle - ${
            this.state.currentGroup ? this.state.currentGroup.Name : ''
          }`}
          onCancelPress={() => {
            this.setState({showEditGroup: false});
          }}
          onOkPress={async () => {
            if (this.state.currentGroup) {
              await this.setState({showEditGroup: false}, async () => {
                await this.props.GroupActions.updateItem(
                  this.state.currentGroup,
                );
              });
            }
          }}>
          <TextInput
            placeholder="Grup Adı"
            value={this.state.currentGroup ? this.state.currentGroup.Name : ''}
            style={{borderWidth: 1, flex: 1, padding: 5, borderRadius: 5}}
            onChangeText={(text) => {
              const {currentGroup} = this.state;
              currentGroup.Name = text;
              this.setState({currentGroup});
            }}
          />
        </FormModal>
        <FormModal
          show={this.state.showDeleteGroup && !!this.state.currentGroup}
          title={`${
            this.state.currentGroup ? this.state.currentGroup.Name : ''
          }`}
          onCancelPress={() => {
            this.setState({showDeleteGroup: false});
          }}
          onOkPress={async () => {
            await this.setState({showDeleteGroup: false}, async () => {
              await this.props.GroupActions.deleteItem(this.state.currentGroup);
            });
          }}>
          <Text>Grupdan ayrılmak istediğinize eminmisiniz?</Text>
        </FormModal>
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
