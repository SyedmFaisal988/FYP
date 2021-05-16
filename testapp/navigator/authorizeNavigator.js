import React from 'react'
import Logout from '../screens/logout'
import Camera from '../screens/camera'
import Sensor from '../screens/sensor';
import Driver from '../screens/Driver';
import Expense from '../screens/Expense';
import Complain from '../screens/Complain';
import mapTracker from '../screens/mapTracker'
import CrowdSourcing from '../screens/crowdSourcing';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';


const Drawer = createDrawerNavigator();

export default (parentProps) => {
    console.log('parent', parentProps);
    const { navigation: {state: { params: { user: { type } } }} } = parentProps;
 return (
   <NavigationContainer>
     <Drawer.Navigator initialRouteName="Marker">
       <Drawer.Screen name="Marker" component={mapTracker} />
       {/* <Drawer.Screen name="Camera" component={Camera} /> */}
       <Drawer.Screen name="Complain" component={Complain} />
       {/* <Drawer.Screen name="Sensor" component={Sensor} /> */}
       {/* <Drawer.Screen name="Crowd Sourcing" component={CrowdSourcing} /> */}
       {/* <Drawer.Screen name="Driver" component={Driver} /> */}
       {type === 'EMPLOYEE' && <Drawer.Screen name="Expense" component={Expense} />}
       <Drawer.Screen
         name="Logout"
         component={(props) => <Logout parentProps={parentProps} {...props} />}
       />
     </Drawer.Navigator>
   </NavigationContainer>
 );}