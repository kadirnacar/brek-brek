import {FormModal, LoaderSpinner} from '@components';
import {IGroup, IUserGroup} from '@models';
import {NavigationProp} from '@react-navigation/native';
import {GroupActions, UserActions} from '@reducers';
import {ApplicationState} from '@store';
import React, {Component} from 'react';
import {
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import SafeAreaView from 'react-native-safe-area-view';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colors} from '@tools';

interface HomeScreenState {
  showAddGroup?: boolean;
  showEditGroup?: boolean;
  showDeleteGroup?: boolean;
  newGroupName?: string;
  currentGroupId?: string;
  search?: string;
  searchRow?: boolean;
  actionsRow?: boolean;
}

interface HomeProps {
  navigation: NavigationProp<any>;
  GroupActions: typeof GroupActions;
  UserActions: typeof UserActions;
}

type Props = HomeProps & ApplicationState;

export class HomeScreenComp extends Component<Props, HomeScreenState> {
  constructor(props) {
    super(props);
    this.state = {
      showAddGroup: false,
      search: '',
      searchRow: false,
      actionsRow: false,
    };
    this.props.navigation.setOptions({
      // headerLeft: () => { },
      headerRight: (props) => {
        return (
          <View style={{flexDirection: 'row', marginHorizontal: 5}}>
            <TouchableOpacity
              style={{
                padding: 10,
                width: 40,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={async () => {
                this.setState({searchRow: !this.state.searchRow, search: ''});
              }}>
              <FontAwesome5Icon
                name="search"
                size={20}
                color={colors.headerTextColor}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                padding: 10,
                width: 30,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={async () => {}}>
              <FontAwesome5Icon
                name="ellipsis-v"
                size={20}
                color={colors.headerTextColor}
              />
            </TouchableOpacity>
          </View>
        );
      },
      canGoBack: true,
    });
  }

  async componentDidMount() {}

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: colors.bodyBackground}}>
        <LoaderSpinner showLoader={this.props.Group.isRequest} />
        {this.state.searchRow ? (
          <View
            style={{
              backgroundColor: colors.color4,
              padding: 10,
              height: 50,
              borderBottomColor: colors.borderColor,
              borderBottomWidth: 1,
            }}>
            <TextInput
              placeholder="Ara..."
              autoFocus={true}
              clearTextOnFocus={true}
              clearButtonMode={'always'}
              selectTextOnFocus={true}
              value={this.state.search}
              placeholderTextColor={colors.color3}
              style={{
                flex: 1,
                padding: 5,
                color: colors.primaryButtonTextColor,
              }}
              onChangeText={(text) => {
                this.setState({search: text});
              }}
            />
          </View>
        ) : null}
        {this.state.actionsRow ? (
          <View
            style={{
              backgroundColor: colors.color4,
              paddingHorizontal: 10,
              height: 50,
              flexDirection: 'row',
            }}>
            <TouchableOpacity
              style={{
                padding: 10,
                width: 40,
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={async () => {
                this.setState({actionsRow: false, currentGroupId: null});
              }}>
              <FontAwesome5Icon
                name="arrow-left"
                size={20}
                color={colors.headerTextColor}
              />
            </TouchableOpacity>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                alignContent: 'center',
                alignItems: 'center',
                alignSelf: 'center',
                justifyContent: 'center',
              }}>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: 40,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={async () => {
                  this.setState({showDeleteGroup: true, actionsRow: false});
                }}>
                <FontAwesome5Icon
                  name="trash"
                  size={20}
                  color={colors.headerTextColor}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  padding: 10,
                  width: 40,
                  height: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={async () => {
                  this.setState({showEditGroup: true, actionsRow: false});
                }}>
                <FontAwesome5Icon
                  name="pencil-alt"
                  size={20}
                  color={colors.headerTextColor}
                />
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
        <ScrollView>
          {Object.keys(this.props.User.current.Groups)
            .filter((g) => {
              const group = this.props.User.current.Groups[g];
              return (
                group.Name.toLowerCase().indexOf(
                  this.state.search.toLowerCase(),
                ) > -1
              );
            })
            .map((id, index) => {
              const group = this.props.User.current.Groups[id];
              return (
                <View
                  key={index}
                  style={{
                    backgroundColor: this.state.currentGroupId
                      ? colors.color1
                      : colors.bodyBackground,
                    padding: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.borderColor,
                  }}>
                  <TouchableOpacity
                    style={{flexDirection: 'row'}}
                    onLongPress={() => {
                      this.setState({actionsRow: true, currentGroupId: id});
                    }}
                    onPress={async () => {
                      await this.props.GroupActions.setCurrent(id);
                      this.props.navigation.navigate('Group');
                    }}>
                    <View
                      style={{
                        backgroundColor: colors.color2,
                        alignContent: 'center',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 30,
                        width: 60,
                        height: 60,
                        marginRight: 10,
                      }}>
                      <FontAwesome5Icon
                        name="users"
                        size={30}
                        color={colors.color3}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: 'bold',
                        alignItems: 'center',
                        alignSelf: 'center',
                        color: colors.color3,
                      }}>
                      {group.Name}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
        </ScrollView>
        <View
          style={{
            backgroundColor: colors.primaryButtonColor,
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
            <FontAwesome5Icon
              name="plus"
              size={30}
              color={colors.primaryButtonTextColor}
            />
          </TouchableHighlight>
        </View>
        {this.state.showAddGroup ? (
          <FormModal
            show={this.state.showAddGroup}
            title={`Kanal Oluştur`}
            onCloseModal={() => {
              this.setState({showAddGroup: false, currentGroupId: null});
            }}
            onCancelPress={() => {
              this.setState({showAddGroup: false, currentGroupId: null});
            }}
            onOkPress={async () => {
              await this.setState(
                {showAddGroup: false, currentGroupId: null},
                async () => {
                  if (this.state.newGroupName)
                    await this.props.GroupActions.createItem({
                      Name: this.state.newGroupName,
                    });
                },
              );
            }}>
            <TextInput
              placeholder="Kanal Adı"
              autoFocus={true}
              selectTextOnFocus={true}
              value={this.state.newGroupName}
              placeholderTextColor={colors.color3}
              style={{
                borderBottomWidth: 1,
                flex: 1,
                padding: 5,
                borderBottomColor: colors.primaryButtonTextColor,
                color: colors.primaryButtonTextColor,
              }}
              onChangeText={(text) => {
                this.setState({newGroupName: text});
              }}
            />
          </FormModal>
        ) : null}
        {this.state.showEditGroup && !!this.state.currentGroupId ? (
          <FormModal
            show={this.state.showEditGroup && !!this.state.currentGroupId}
            title={`Kanal Düzenle`}
            onCloseModal={() => {
              this.setState({showEditGroup: false, currentGroupId: null});
            }}
            onCancelPress={() => {
              this.setState({showEditGroup: false, currentGroupId: null});
            }}
            onOkPress={async () => {
              if (this.state.currentGroupId) {
                await this.setState({showEditGroup: false}, async () => {
                  await this.props.GroupActions.updateItem(
                    this.props.User.current.Groups[this.state.currentGroupId],
                  );
                  this.setState({currentGroupId: null});
                });
              }
            }}>
            <TextInput
              placeholder="Kanal Adı"
              value={
                this.state.currentGroupId ? this.props.User.current.Groups[this.state.currentGroupId].Name : ''
              }
              placeholderTextColor={colors.color3}
              style={{
                borderBottomWidth: 1,
                flex: 1,
                padding: 5,
                borderBottomColor: colors.primaryButtonTextColor,
                color: colors.primaryButtonTextColor,
              }}
              onChangeText={(text) => {
                const {currentGroupId} = this.state;
                this.props.User.current.Groups[this.state.currentGroupId].Name = text;
                this.setState({currentGroupId});
              }}
            />
          </FormModal>
        ) : null}
        {this.state.showDeleteGroup && !!this.state.currentGroupId ? (
          <FormModal
            show={this.state.showDeleteGroup && !!this.state.currentGroupId}
            title={`Kanaldan Ayrıl: ${
              this.state.currentGroupId ? this.props.User.current.Groups[this.state.currentGroupId].Name : ''
            }`}
            onCloseModal={() => {
              this.setState({showDeleteGroup: false, currentGroupId: null});
            }}
            onCancelPress={() => {
              this.setState({showDeleteGroup: false, currentGroupId: null});
            }}
            onOkPress={async () => {
              await this.setState({showDeleteGroup: false}, async () => {
                await this.props.UserActions.leaveGroup(
                  this.state.currentGroupId,
                );
                this.setState({currentGroupId: null});
              });
            }}>
            <Text
              style={{
                color: colors.primaryButtonTextColor,
              }}>
              Kanaldan ayrılmak istediğinize eminmisiniz?
            </Text>
          </FormModal>
        ) : null}
      </SafeAreaView>
    );
  }
}
export const HomeScreen = connect(
  (state: ApplicationState) => state,
  (dispatch) => {
    return {
      GroupActions: bindActionCreators({...GroupActions}, dispatch),
      UserActions: bindActionCreators({...UserActions}, dispatch),
    };
  },
)(HomeScreenComp);
