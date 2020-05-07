import React, { Component } from 'react';
import { StyleSheet, View, SafeAreaView, Text, Image } from 'react-native';
import MapView, { Marker, Polyline, Callout } from 'react-native-maps';
import * as Location from 'expo-location'
import * as ImagePicker from 'expo-image-picker';
// import ImagePicker from 'react-native-image-picker';
import * as Permissions from 'expo-permissions'
import Constants from 'expo-constants'
import BigButton from './BigButton'
import { getLocationData, uploadImage } from './api'

class App extends Component{

  state = {
    mapRegion: null,
    customMarker: [],
    timestamp: new Date().valueOf(),
    test: false,
    cameraStatus: null,
    imageMarker: [],
    image: ""
  }
  coordinate = []
  PositionWatcher = null;
  

  onRegionChange = (mapRegion)=>{
    const data = {
      coords : mapRegion
    }
    this.calculateCordinated(data)
    this.setState({ mapRegion })
  }

  async componentDidMount() {
    const data = await getLocationData()
    return this.getCurrentPosition()
}

getPermissionAsync = async () => {
  if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
    }
  }
}

_pickImage = async () => {
  let result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    aspect: [4, 3],
    quality: 1,
    base64: true
  });
  if (!result.cancelled) {
    const resporse = await fetch(result.uri)
    const blob = await resporse.blob()
    await this.uploadImageAsync(blob)
    // const src = DOMURL.createObjectURL( blob );
    console.log({ blob })
    console.log({ result })
    this.setState({ image: result.uri });
    const { mapRegion, imageMarker } = this.state
    console.log({ state: this.state })
    imageMarker.push({
      coords: mapRegion,
      src: `${result.uri}`
    })
    this.setState({ imageMarker })
  }
}


uploadImageAsync(blob) {
  let formData = new FormData();
  // formData.append('photo', blob, blob._data.name);

  return uploadImage({blob: blob._data})
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
        this.coordinate.push({
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
          latitudeDelta: 0.0922, 
          longitudeDelta: 0.0421, })
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
  const newState = this.state
  if(res.coords.latitude.toFixed(4)[6] !== this.coordinate[this.coordinate.length-1].latitude.toFixed(4)[6]){
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
  }
  this.setState({ ...newState ,mapRegion: { latitude: res.coords.latitude, longitude: res.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421 }, timestamp: new Date().valueOf() })
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
        res.remove()
      })
    this.setState({ customMarker: [], test: false,  })
  }

  openCamera = async ()=>{
    const { status } = await Camera.requestPermissionsAsync();
    console.log(status)
    this.setState({ cameraStatus: status })
  }

  render(){
    const { mapRegion, customMarker, test, imageMarker } = this.state
    console.log({ imageMarker })
  return (
    <SafeAreaView style={{ flex: 1 }} >
      {
        mapRegion ? 
      <MapView
        initialRegion={this.coordinate[0]}
        onRegionChange={ (data)=> test && this.onRegionChange(data)}
        style={{ flex: 0.65 }}
      >
        {/* <Marker
          coordinate={this.coordinate[0]}
        >
          <Callout>
            <View style={{ width: 50, height: 30 }} >
              <Text>Hello</Text>
            </View>
          </Callout>
        </Marker > */}
        <Marker
            coordinate={this.coordinate[0]}
          >
            <Callout style={{  }} >
              <Text style={{height: 300, width: 200, marginTop: -95 }} >
                <Image style={{ height: 200, width: 200 }} resizeMode ={"contain"} source={{ uri: this.state.image}}  />
              </Text>
            </Callout>
          </Marker >
        {
          imageMarker.length ?
          imageMarker.map(ele=><Marker
            coordinate={ele.coords}
          >
            <Callout style={{ flex: -1}} >
              <Text>
                <Image style={{ height: 100, width: 100 }} resizeMode="cover" source={{ uri: this.state.image}}  />
              </Text>
            </Callout>
          </Marker >)
          : <></>
        }
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
   <View style={{ flex: 0.3, justifyContent: "space-between", marginVertical: 20 }} >
    <BigButton text="Start" onPress={()=>this.getLocationAsync()} />
    <BigButton text="End"  onPress={()=> this.clearMap()} />
    <BigButton text="Start Test" onPress={()=> this.setState({ test: true })} />
    <BigButton text="Camera" onPress={()=>this._pickImage()} />
    </View>
    </SafeAreaView>
  )
}
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