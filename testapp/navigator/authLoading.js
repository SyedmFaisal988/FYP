import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import unAuthorizeNavigator from './unAuthorizeNavigator';
import authorizeNavigator from './authorizeNavigator'
import Start from './start'

const AuthLoading = createStackNavigator({
    unAuthorizeNavigator,
    authorizeNavigator,
    Start
}, {
    initialRouteName: "Start",
    defaultNavigationOptions: {
        headerShown: false,
    }
})

export default createAppContainer(AuthLoading)