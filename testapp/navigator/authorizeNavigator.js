import React from 'react'
import mapTracker from '../screens/mapTracker'
import Logout from '../screens/logout'
import Camera from '../screens/camera'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


const Drawer = createDrawerNavigator();

export default (parentProps) => <NavigationContainer>
    <Drawer.Navigator  initialRouteName="Marker">
        <Drawer.Screen name="Marker" component={mapTracker}/>
        <Drawer.Screen name="Camera" component={Camera} />
        <Drawer.Screen name="Logout" component={(props)=> <Logout parentProps={parentProps} {...props} /> } />
    </Drawer.Navigator>
</NavigationContainer>