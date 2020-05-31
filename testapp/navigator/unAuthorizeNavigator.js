import { createStackNavigator } from 'react-navigation-stack';
import login from '../screens/login';
import register from '../screens/register';

export default createStackNavigator({
    login,
    register,

},{
    initialRouteName: "login",
    defaultNavigationOptions: {
        header: null,
    }
})