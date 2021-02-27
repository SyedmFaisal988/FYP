import React from 'react'
import Logout from '../screens/logout'
import Camera from '../screens/camera'
import Sensor from '../screens/sensor';
import Complain from '../screens/Complain';
import Driver from '../screens/Driver';
import mapTracker from '../screens/mapTracker'
import CrowdSourcing from '../screens/crowdSourcing';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


const Drawer = createDrawerNavigator();

export default (parentProps) => <NavigationContainer>
    <Drawer.Navigator  initialRouteName="Marker">
        <Drawer.Screen name="Marker" component={mapTracker}/>
        <Drawer.Screen name="Camera" component={Camera} />
        <Drawer.Screen name="Complain" component={Complain} />
        <Drawer.Screen name="Sensor" component={Sensor} />
        <Drawer.Screen name="Crowd Sourcing" component={CrowdSourcing} />
        <Drawer.Screen name="Driver" component={Driver} />
        <Drawer.Screen name="Logout" component={(props)=> <Logout parentProps={parentProps} {...props} /> } />
    </Drawer.Navigator>
</NavigationContainer>