import React from 'react'
import mapTracker from '../screens/mapTracker'
import Camera from '../screens/camera'
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';


const Drawer = createDrawerNavigator();

export default () => <NavigationContainer>
    <Drawer.Navigator initialRouteName="mapTracker">
        <Drawer.Screen name="mapTracker" component={mapTracker}/>
        <Drawer.Screen name="camera" component={Camera} />
    </Drawer.Navigator>
</NavigationContainer>