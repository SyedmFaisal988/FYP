import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location'
import * as Permissions from 'expo-permissions'
import BigButton from './BigButton'

class App extends Component{

  state = {
    mapRegion: null,
    customMarker: [],
    timestamp: new Date().valueOf(),
    test: false
  }
  coordinate = [{
    latitude: 24.9399878,
    longitude: 67.0315282,
    latitudeDelta: 0.0922, 
    longitudeDelta: 0.0421,
  }]
  PositionWatcher = null;

  onRegionChange = (mapRegion)=>{
    const data = {
      coords : mapRegion
    }
    this.calculateCordinated(data)
    this.setState({ mapRegion })
  }

  componentDidMount() {
    return this.getCurrentPosition()
}

getCurrentPosition = async () => {
  let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        this.setState({
            locationResult: 'Permission to access location was denied',
            userId
        });
    } else {
        this.setState({ hasLocationPermissions: true })
        Location.getCurrentPositionAsync({
          accuracy: 6,
      }).then((res) => {
        console.log({ res })
          this.setState({ mapRegion: {
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            latitudeDelta: 0.0922, 
            longitudeDelta: 0.0421, } })
      })
    }
}

calculateCordinated = (res) => {
  const { mapRegion, timestamp, test } = this.state
  if(res.coords.latitude.toFixed(4)[6] !== this.coordinate[this.coordinate.length-1].latitude.toFixed(4)[6]){
    const newState = this.state
    const date = new Date();
    const threshold = test ? 1000 : 1200000
    if( (date.valueOf() - timestamp) >= threshold){
      const { customMarker } = this.state
      customMarker.push(mapRegion)
      newState.customMarker = customMarker
    }
    this.coordinate.push({
      latitude: res.coords.latitude,
      longitude: res.coords.longitude,
      latitudeDelta: 0.0922, 
      longitudeDelta: 0.0421
    })
    this.setState({ ...newState ,mapRegion: { latitude: res.coords.latitude, longitude: res.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }, timestamp: new Date().valueOf() })
  }
}

getLocationAsync = async (userId) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
        this.setState({
            locationResult: 'Permission to access location was denied',
            userId
        });
    } else {
        this.setState({ hasLocationPermissions: true })

        this.PositionWatcher = Location.watchPositionAsync({
          accuracy: 6,
          timeInterval: 2500
      }, (res) => {
        console.log({ res })
          this.calculateCordinated(res);
      })
    }

    // Center the map on the location we just fetched.
}
  clearMap = ()=>{
    const { mapRegion } = this.state
    this.coordinate = [mapRegion]
    if(this.PositionWatcher)
      this.PositionWatcher.then(res=>{
        console.log(res)
        res.remove()
      })
    this.setState({ customMarker: [], test: false,  })
  }

  render(){
    const { mapRegion, customMarker, test } = this.state
  return (
    <SafeAreaView style={{ flex: 1 }} >
      {
        mapRegion ? 
      <MapView
        initialRegion={mapRegion}
        onRegionChange={ (data)=> test && this.onRegionChange(data)}
        style={{ flex: 0.7 }}
      >
        <Marker
          coordinate={this.coordinate[0]}
        />
        {
          this.coordinate.length >= 2 ? 
          <Marker
            coordinate={this.coordinate[this.coordinate.length - 1]}
          /> : []
        } 
        {  customMarker.map(mark=> <Marker coordinate={mark} /> )}
        <Polyline
          coordinates={ JSON.parse(JSON.stringify(this.coordinate))}
          strokeWidth={3}
        />
      </MapView> :
      <></>
  }
  { mapRegion ? <View style={{ flex: 0.25, justifyContent: "space-between", marginVertical: 20 }} >
    <BigButton text="Start" onPress={()=>this.getLocationAsync()} />
    <BigButton text="End"  onPress={()=> this.clearMap()} />
    <BigButton text="Start Test" onPress={()=> this.setState({ test: true })} />
    </View> : <></> }
    </SafeAreaView>
  )}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


export default App;