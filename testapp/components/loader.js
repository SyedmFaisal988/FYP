import React from 'react'
import { Modal, Image, View } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'

const splash = require('../assets/icon.png')

export default loader = (props) => (
    <Modal
        animationType="none"
        visible={props.loading}
    >
        <LinearGradient
            colors={["#f28800", "#f15e00"]}
            start={[0, 1]}
            end={[1, 0]}
            style={{ justifyContent: 'center', alignItems: 'center', flex: 1, paddingBottom: 30 }}
        >
            <View style={{ width: 150, height: 150 }} >
                <Image source={splash} style={{ resizeMode: "cover", width: '100%', height: '100%' }} />
            </View>
        </LinearGradient>

    </Modal>
)