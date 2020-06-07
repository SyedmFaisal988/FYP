import React, { useState } from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Dropdown } from 'react-native-material-dropdown'; 
import Constants from "expo-constants";
import { Menu, Filter } from './icons'
import FilterModal from './filterModal'

const style = StyleSheet.create({
    container: {
        marginTop: Constants.statusBarHeight,
        display: "flex",
        justifyContent: 'center',
        height: 45,
        flexDirection: "row",
        alignItems: "center",
        paddingLeft: 10,
        paddingRight: 10    
    },
    textContainer: {
        display: "flex",
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    text: {
        fontSize: 17
    },
    options: {
        flex: 1,
        height: 30,
        backgroundColor: 'green'
    }
})

export default ({ navigation, text, filterModalOpen, setFilterModalOpen }) => 
        <View style={style.container} >
            <TouchableOpacity onPress={navigation.openDrawer} >
                <Menu />
            </TouchableOpacity>
            <View style={style.textContainer} >
                <Text style={style.text} >{text}</Text>
            </View>
            <TouchableOpacity onPress={()=>setFilterModalOpen(!filterModalOpen)} >
                <Filter />
            </TouchableOpacity>
        </View>