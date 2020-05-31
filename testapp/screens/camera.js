import React, { Component } from "react";
import {
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import { uploadImage, setLocation } from "../api";
import { endpoint } from "../constants";

class Camera extends Component {
    state = {
      timestamp: new Date().valueOf(),
      cameraStatus: null,
      loading: true,
    };

    navigationListener = null
  
    async componentDidMount() { 
        this.navigationListener = this.props.navigation.addListener('focus', async ()=>{
            await this.getPermissionAsync()
        return this._pickImage()
        })
        
    }

    componentWillUnmount(){
        this.navigationListener()
    }
  
    getPermissionAsync = async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
  
    _pickImage = async () => {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        exif: true,
      });
      await this.setState({ loading: true })
      if (!result.cancelled) {
        const filename = `${new Date().valueOf()}`;
        await this.uploadImageAsync(result.base64, filename);
        const { mapRegion, imageMarker } = this.state;
        await setLocation({
          point: {
            latitude: mapRegion.latitude,
            longitude: mapRegion.longitude,
            image: `${filename}.jpg`,
          },
        });
        const blob = await fetch(`${endpoint}/images/${filename}.jpg`);
  
        const fileReaderInstance = new FileReader();
        fileReaderInstance.readAsDataURL(blob._bodyBlob);
        fileReaderInstance.onload = () => {
          const base64data = fileReaderInstance.result;
          imageMarker.push({
            coords: mapRegion,
            uri: base64data,
          });
          this.setState({ imageMarker });
        };
      }
      this.props.navigation.navigate("mapTracker")
      return this.setState({ loading: false })
    };
  
    uploadImageAsync(blob, name) {
      return uploadImage({ blob: blob, name });
    }
  
    openCamera = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      this.setState({ cameraStatus: status });
    };
  
    render() {
      return (
        <View/>
      );
    }
  }
  
  export default Camera;