import { HeaderRight, HeaderTitle } from '@components';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { GroupScreen, HomeScreen, LoginScreen } from '@screens';
import { colors } from '@tools';
import * as React from 'react';

const Stack = createStackNavigator();

export const AppNavigation = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        headerMode={'screen'}
        screenOptions={(navigation) => {
          return {
            headerStyle: {backgroundColor: colors.color1},
            headerTintColor: '#fff',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitle: (props) => {
              return (
                <HeaderTitle
                  style={[
                    props.style,
                    {color: '#fff', fontWeight: 'bold', fontSize: 20},
                  ]}
                />
              );
            },
            headerLeft: null,
            safeAreaInsets: {bottom: 0, left: 0, right: 0, top: 0},
            animationTypeForReplace: 'pop',
            headerRight: (props) => {
              return <HeaderRight navigation={navigation.navigation} />;
            },
            headerStatusBarHeight: 0,
          };
        }}
        initialRouteName={props.isLogin ? 'Home' : 'Login'}
        mode="card">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerRight: null}}
        />
        {/* <Stack.Screen name="Department"
                    options={{ headerLeft: null }}
                    component={DepartmentScreen} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Group" component={GroupScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
