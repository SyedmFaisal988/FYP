import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import unAuthorizeNavigator from './unAuthorizeNavigator';
import authorizeNavigator from './authorizeNavigator'
import Start from './start'

const AuthLoading = createStackNavigator({
    unAuthorizeNavigator,
    
    Start
}, {
    initialRouteName: "Start",
    defaultNavigationOptions: {
        header: null,
    }
})

export default createAppContainer(AuthLoading)