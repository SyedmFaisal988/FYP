import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native'
import { BackArrow } from './icons'
import logo from '../assets/conceptRemake.png'

const CustomHeader = ({ title, back, showLogo }) => (
    <View style={{ flex: 1, flexDirection: 'row', height: '100%', backgroundColor: '#f15e00', alignItems: 'center', paddingHorizontal: 20 }}>
        {back ? <TouchableOpacity onPress={back}>
            <BackArrow />
        </TouchableOpacity> : <View />}
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, marginRight: 20, }} >
            <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold' }} >
                {title}
            </Text>
        </View>
        {showLogo ? <View style={{ width: 40, height: 40, borderWidth: 2, borderColor: 'white', borderRadius: 50 }} >
            <Image source={logo} style={{
                width: '100%',
                height: "100%"
            }} resizeMode="contain" />
        </View> : <View />}
    </View>
)

export default CustomHeader;