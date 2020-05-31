import React from 'react'
import { View, StyleSheet, Image } from 'react-native'


export const Card = (props) => {
    return (
        <View style={styles.cardWrapper} >
            {props.children}
        </View>
    )
}

export const ItemCard = (props) => {
    const {image, children} = props
    return (
        <Card>
            <View style={{ flexDirection: 'row' }} >
                <View style={{ width: 80, height: 80, marginLeft: 20, marginTop: 10 }} >
                    <Image source={{uri: image}} style={{
                        width: '100%',
                        height: '100%',
                        resizeMode: 'contain',
                    }} />
                </View>
                <View style={{ flex: 1, marginLeft: 25, marginTop: 10, justifyContent: 'space-between', }} >
                    {children}
                </View>
            </View>
        </Card>
    )
}

const styles = StyleSheet.create({
    cardWrapper: {
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0.5 * 5 },
        shadowOpacity: 1,
        shadowRadius: 0.8 * 5,
        marginHorizontal: 20,
        height: 100,
        marginVertical: 9,
        borderRadius: 10
    }
})