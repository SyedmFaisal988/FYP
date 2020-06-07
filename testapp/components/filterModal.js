import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {        
        backgroundColor: 'red',
        height: 200,
        marginTop: 50
    }
})

export default ({ open, closeModal }) => 
<Modal
    animationType="slide"
    transparent={true}
    visible={open}
    onRequestClose={closeModal}
>
    <View style={styles.container}>
        
    </View>
</Modal>