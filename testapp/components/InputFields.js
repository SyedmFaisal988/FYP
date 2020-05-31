import React from 'react';
import { View, Dimensions, TextInput, StyleSheet } from 'react-native';
const { height } = Dimensions.get("screen")


const InputField = ({placeholder, value, onChange, children, secureTextEntry})=>{
    return(
        <View style={styles.inputWrapper} >
            <View style={{ flex: 0.2, justifyContent: 'center', alignItems: 'center', paddingTop: 10, paddingLeft: 10 }} >
                {children}
            </View>
            <View style={{flex: 0.8 , justifyContent: 'center', paddingLeft: 10, marginTop: 5 }} >
                <TextInput
                    placeholder={placeholder}
                    placeholderTextColor={"#00000080"}
                    style={{
                        color: "#00000080",
                        fontSize: 15,
                        fontWeight: 'bold',
                    }}
                    secureTextEntry={secureTextEntry ? true : false}
                    onChangeText={(value)=>onChange(value)}
                    value={value.toString()}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    inputWrapper:{
        // padding: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5*5 },
        shadowOpacity: 1,
        shadowRadius: 0.8 * 5,
        flexDirection: 'row', 
        height: height*0.06,
        borderRadius: 70,
    }
})

export default InputField;