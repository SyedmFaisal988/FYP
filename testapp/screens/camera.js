import React, { Component } from "react";
import {
  View,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import Loader from '../components/loader'
import { uploadImage, setLocation } from "../api";
import { endpoint } from "../constants";
import { Context } from '../context'

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
        const { mapRegion } = this.props.context;
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
          let newImageMarker = {
            coords: mapRegion,
            uri: base64data,
          };
          this.setState({ loading: false })
          this.props.navigation.navigate("Marker", {
            imageMarker: newImageMarker
          })
        };
      }else{
        this.props.navigation.navigate("Marker")
        return this.setState({ loading: false })
      }
    };
  
    uploadImageAsync(blob, name) {
      return uploadImage({ blob: blob, name });
    }
  
    openCamera = async () => {
      const { status } = await Camera.requestPermissionsAsync();
      this.setState({ cameraStatus: status });
    };
  
    render() {
      const { loading } = this.state
      return (
        <>
        <Loader loading={loading} />
        <View/>
        </>
      );
    }
  }
  
  export default (props) => <Context.Consumer>
    {
      context=> <Camera {...props} context={context} />
    }
  </Context.Consumer>;