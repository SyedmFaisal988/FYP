import React, { Component } from "react";
import { StyleSheet, View, SafeAreaView, Text, Image } from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";
// import ImagePicker from 'react-native-image-picker';
import * as Permissions from "expo-permissions";
import Constants from "expo-constants";
import BigButton from "./BigButton";
import { getLocationData, uploadImage, setLocation } from "./api";
import { endpoint } from "./constants";

class App extends Component {
  state = {
    mapRegion: null,
    customMarker: [],
    timestamp: new Date().valueOf(),
    test: false,
    cameraStatus: null,
    imageMarker: [],
  };
  coordinate = [];
  PositionWatcher = null;

  mapData = (data) =>
    data.message.cords.map((ele) => ({
      coords: {
        latitude: ele.latitude,
        longitude: ele.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      uri: `${endpoint}/images/${ele.image}`,
    }));

  onRegionChange = (mapRegion) => {
    const data = {
      coords: mapRegion,
    };
    this.state.test && this.calculateCordinated(data);
    this.setState({ mapRegion });
  };

  fetchImages = async (image, index) => {
    const blob = await fetch(image.uri);

    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(blob._bodyBlob);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      let imageMarker = JSON.parse(JSON.stringify(this.state.imageMarker));
      imageMarker[index].uri = base64data;
      console.log("res");
      this.setState({ imageMarker });
    };
  };

  async componentDidMount() {
    const data = await getLocationData();
    const formatedData = this.mapData(data);
    this.setState({ imageMarker: formatedData });
    formatedData.forEach((ele, index) => {
      this.fetchImages(ele, index);
    });
    return this.getCurrentPosition();
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
  };

  uploadImageAsync(blob, name) {
    return uploadImage({ blob: blob, name });
  }

  getCurrentPosition = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
        userId,
      });
    } else {
      this.setState({ hasLocationPermissions: true });
      Location.getCurrentPositionAsync({
        accuracy: 6,
      }).then((res) => {
        this.coordinate.push({
          latitude: res.coords.latitude,
          longitude: res.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
        this.setState({
          mapRegion: {
            latitude: res.coords.latitude,
            longitude: res.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          },
        });
      });
    }
  };

  calculateCordinated = (res) => {
    const { mapRegion, timestamp, test } = this.state;
    const newState = this.state;
    if (
      res.coords.latitude.toFixed(4)[6] !==
      this.coordinate[this.coordinate.length - 1].latitude.toFixed(4)[6]
    ) {
      const date = new Date();
      const threshold = test ? 1000 : 1200000;
      if (date.valueOf() - timestamp >= threshold) {
        const { customMarker } = this.state;
        customMarker.push(mapRegion);
        newState.customMarker = customMarker;
      }
      this.coordinate.push({
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        image: "",
      });
    }
    this.setState({
      ...newState,
      mapRegion: {
        latitude: res.coords.latitude,
        longitude: res.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      timestamp: new Date().valueOf(),
    });
  };

  getLocationAsync = async (userId) => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== "granted") {
      this.setState({
        locationResult: "Permission to access location was denied",
        userId,
      });
    } else {
      this.setState({ hasLocationPermissions: true });
      this.PositionWatcher = Location.watchPositionAsync(
        {
          accuracy: 6,
          timeInterval: 2500,
        },
        (res) => {
          this.calculateCordinated(res);
        }
      );
    }

    // Center the map on the location we just fetched.
  };
  clearMap = () => {
    const { mapRegion } = this.state;
    this.coordinate = [mapRegion];
    if (this.PositionWatcher)
      this.PositionWatcher.then((res) => {
        res.remove();
      });
    this.setState({ customMarker: [], test: false });
  };

  openCamera = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    this.setState({ cameraStatus: status });
  };

  render() {
    const { mapRegion, customMarker, test, imageMarker } = this.state;
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {mapRegion ? (
          <MapView
            initialRegion={this.coordinate[0]}
            onRegionChange={(data) => this.onRegionChange(data)}
            style={{ flex: 0.65 }}
          >
            {imageMarker.length ? (
              imageMarker.map((ele, index) => (
                <Marker index={index.toString()} coordinate={ele.coords}>
                  <Callout style={{ flex: -1 }}>
                    <Text style={{ flexDirection: "column", marginTop: -95 }}>
                      <Image
                        style={{ height: 200, width: 200 }}
                        resizeMode="contain"
                        source={{ uri: ele.uri }}
                      />
                    </Text>
                  </Callout>
                </Marker>
              ))
            ) : (
              <></>
            )}
            {this.coordinate.length >= 2 ? (
              <Marker
                coordinate={this.coordinate[this.coordinate.length - 1]}
              />
            ) : (
              []
            )}
            {customMarker.map((mark) => (
              <Marker coordinate={mark} />
            ))}
            <Polyline
              coordinates={JSON.parse(JSON.stringify(this.coordinate))}
              strokeWidth={3}
            />
          </MapView>
        ) : (
          <></>
        )}
        <View
          style={{
            flex: 0.3,
            justifyContent: "space-between",
            marginVertical: 20,
          }}
        >
          <BigButton text="Start" onPress={() => this.getLocationAsync()} />
          <BigButton text="End" onPress={() => this.clearMap()} />
          <BigButton
            text="Start Test"
            onPress={() => this.setState({ test: true })}
          />
          <BigButton text="Camera" onPress={() => this._pickImage()} />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
