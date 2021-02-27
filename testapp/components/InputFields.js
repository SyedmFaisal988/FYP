import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
const { height } = Dimensions.get("screen")

const styles = StyleSheet.create({
    inputWrapper:{
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5*5 },
        shadowOpacity: 1,
        shadowRadius: 0.8 * 5,
        flexDirection: 'row', 
        height: height*0.06,
        borderRadius: 70,
        backgroundColor: "#fff",
        minWidth: '50%'
    },
    TextInputStlye: {
        color: "#00000080",
        fontSize: 15,
        fontWeight: 'bold',
    }
})

const InputField = ({placeholder, value, onChange, children, secureTextEntry, multiline, customStyle = {}, keyboardType="default"})=>{
    return(
        <View style={multiline ? [styles.inputWrapper, { borderRadius: 15, height: 100 }] : styles.inputWrapper} >
            {children && <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingLeft: 10 }} >
                {children}
            </View>}
            <View style={{flex: 0.8 , justifyContent: 'center', paddingLeft: children ? 10 : 30, marginTop: children ? 0 : 0 }} >
                <TextInput
                    multiline={multiline}
                    value={value.toString()}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    placeholderTextColor={"#00000080"}
                    onChangeText={(value)=>onChange(value)}
                    style={[styles.TextInputStlye, customStyle]}
                    secureTextEntry={secureTextEntry ? true : false}
                />
            </View>
        </View>
    )
}

export default InputField;