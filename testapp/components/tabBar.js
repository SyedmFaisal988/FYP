import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

const TabBar = ({ navigation }) => {
    const { routeName } = navigation.state;
    return (
        <View style={{ flexDirection: 'row', height: 55 }} >
            <TouchableOpacity 
            onPress={()=>navigation.navigate('home')}
            style={{flex: 1, backgroundColor: routeName === "home"?  "#f15e00" : "#f28800", justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '600'
                }} >
                    Home
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>navigation.navigate('cart')}
            style={{flex: 1, backgroundColor: routeName === "cart"? "#f15e00" : "#f28800", justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '600'
                }}>
                    Cart
                </Text>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>navigation.navigate('setting')}
            style={{flex: 1, backgroundColor: routeName === "setting"? "#f15e00" : "#f28800", justifyContent: 'center', alignItems: 'center'}} >
                <Text style={{
                    color: 'white',
                    fontSize: 20,
                    fontWeight: '600'
                }}>
                    Settings
                </Text>
            </TouchableOpacity>
        </View>
    )
}

export default TabBar;