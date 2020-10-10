import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { Gyroscope, Magnetometer, Accelerometer } from 'expo-sensors';
import Constants from "expo-constants";
import BigButton from '../components/BigButton'

class Sensor extends React.Component {
  state = {
    data: [],
    tempData: [],
  }
  
  gyroscopeSubscription = null;
  magnetometerSubscription = null;
  accelerometerSubscription = null;  
  scrollRef = null;

  start = () => {
    Gyroscope.setUpdateInterval(5000);
    Accelerometer.setUpdateInterval(5000);
    Magnetometer.setUpdateInterval(5000);
    this.gyroscopeSubscription = Gyroscope.addListener((data) => {
      this.state.tempData[0] = data;
      if (this.state.tempData[0] && this.state.tempData[1] && this.state.tempData[2]) {
        this.setState({
          data: this.state.data.concat([[...this.state.tempData, new Date().toISOString()]])
        })
        this.state.tempData = []
        setTimeout(() => {
          this.scrollRef.scrollToEnd({ animated: true })
        }, 0)
      }
    })
    this.magnetometerSubscription = Magnetometer.addListener((data) => {
      this.state.tempData[1] = data;
      if (this.state.tempData[0] && this.state.tempData[1] && this.state.tempData[2]) {
        this.setState({
          data: this.state.data.concat([[...this.state.tempData, new Date().toISOString()]])
        })
        this.state.tempData = []
        setTimeout(() => {
          this.scrollRef.scrollToEnd({ animated: true })
        }, 0)
      }
    })
    this.accelerometerSubscription = Accelerometer.addListener((data) => {
      this.state.tempData[2] = data;
      if (this.state.tempData[0] && this.state.tempData[1] && this.state.tempData[2]) {
        this.setState({
          data: this.state.data.concat([[...this.state.tempData, new Date().toISOString()]])
        })
        this.state.tempData = []
        setTimeout(() => {
          this.scrollRef.scrollToEnd({ animated: true })
        }, 0)
      }
    })
  }

  stop = () => {
    if (this.gyroscopeSubscription) {
      this.gyroscopeSubscription.remove(); 
    }
    if (this.magnetometerSubscription) {
      this.magnetometerSubscription.remove(); 
    }
    if (this.accelerometerSubscription) {
      this.accelerometerSubscription.remove(); 
    }
  }

  componentWillUnmount() {
    this.stop();
  }

  render() {
    const { data } = this.state
    return (
      <View style={{ flex: 1, flexDirection: "column", marginTop: Constants.statusBarHeight, marginLeft: 10 }} >
        <View style={{ flex: 0.8 }} >
          <ScrollView ref={(ref) => { this.scrollRef=ref}}>
            {
              data.map((ele) => {
                return (
                <>
                <Text style={{ fontWeight: 'bold' }} >Gyroscope</Text>
                <Text>
                  {`x: ${ele[0].x} y: ${ele[0].y} z: ${ele[0].z}`}
                </Text>
                <Text style={{ fontWeight: 'bold' }}>Magnetometer</Text>
                <Text>
                  {`x: ${ele[1].x} y: ${ele[1].y} z: ${ele[1].z}`}
                </Text>
                <Text style={{ fontWeight: 'bold' }} >Accelerometer</Text>
                <Text>
                  {`x: ${ele[2].x} y: ${ele[2].y} z: ${ele[2].z}`}
                </Text>
                <Text style={{ fontWeight: 'bold' }} >{`time ${ele[3]}`}</Text>
                <View style={{ width: '100%', borderBottomWidth: 1, marginVertical: 5 }} />
                </>
              )})
            }
          </ScrollView>
        </View>
        <View style={{ flex: 0.2, justifyContent: 'space-around' }} >
          <BigButton text="Start" onPress={this.start}  />
          <BigButton text="Stop" onPress={this.stop}  />
        </View>
      </View>
    )
  }
}

export default Sensor;