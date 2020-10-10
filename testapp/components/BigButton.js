import React from 'react';
import { Text, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'
const { height } = Dimensions.get("screen")

const BigButton = ({ text, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} >
            <LinearGradient
                colors={["#f28800", "#f15e00"]}
                start={[0, 1]}
                end={[1, 0]}
                style={{ marginHorizontal: 30, backgroundColor: 'red', height: height * 0.06, borderRadius: 70, justifyContent: 'center', alignItems: 'center' }} >
                <Text style={{ color: "#fff", fontSize: 17, fontWeight: '500' }} >
                    {text}
                </Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export default BigButton;