import { HomeScreen } from "@screens";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const AppNavigator = createStackNavigator({
    Home: HomeScreen,
}, {
    initialRouteName: 'Home',
    mode: "card",
    headerMode: 'screen',
    cardShadowEnabled: false,
    cardStyle: { backgroundColor: 'white' },
    transparentCard: true,    
    defaultNavigationOptions: {
        gesturesEnabled: false,
    }
})

export const AppContainer = createAppContainer(AppNavigator);