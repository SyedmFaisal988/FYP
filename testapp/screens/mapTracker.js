import React, { Component } from "react";
import {
  StyleSheet,
  SafeAreaView,
  Text,
  Image,
  View,
  TouchableOpacity,
} from "react-native";
import MapView, { Marker, Polyline, Callout } from "react-native-maps";
import * as Location from "expo-location";
import * as Permissions from "expo-permissions";
import Loader from "../components/loader";
import Header from "../components/Header";
import { getLocationData } from "../api";
import { endpoint } from "../constants";
import { Check } from "../components/icons";

class Maptracker extends Component {
  state = {
    mapRegion: null,
    customMarker: [],
    timestamp: new Date().valueOf(),
    test: false,
    cameraStatus: null,
    imageMarker: [],
    loading: false,
    filterModalOpen: false,
    filter: "all",
  };
  coordinate = [];
  PositionWatcher = null;
  navigationListener = null;

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
      this.setState({ imageMarker });
    };
  };

  componentDidMount() {
    this.navigationListener = this.props.navigation.addListener(
      "focus",
      async () => {
        console.log("chala");
        const data = await getLocationData();
        const formatedData = this.mapData(data);
        this.setState({ imageMarker: formatedData });
        for (var i = 0; i < formatedData.length; i++) {
          await this.fetchImages(formatedData[i], i);
        }
        await this.getCurrentPosition();
        console.log("false");
        return this.setState({ loading: false });
      }
    );
  }

  componentWillUnmount() {
    this.navigationListener();
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

  setFilterModalOpen = (open) => {
    this.setState({ filterModalOpen: open });
  };

  render() {
    const {
      mapRegion,
      customMarker,
      imageMarker,
      loading,
      filterModalOpen,
      filter,
    } = this.state;
    let data = ["All", "Pending", "Processing", "Solved"];
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Header
          filterModalOpen={filterModalOpen}
          setFilterModalOpen={this.setFilterModalOpen}
          text="Markers"
          {...this.props}
        />
        <Loader loading={loading} />
        {mapRegion ? (
          <MapView
            key="-1"
            initialRegion={this.coordinate[0]}
            onRegionChange={(data) => this.onRegionChange(data)}
            style={{ flex: 1, zIndex: -1 }}
          >
            {imageMarker.length ? (
              imageMarker.map((ele, index) => (
                <Marker
                  key={index.toString()}
                  index={index.toString()}
                  coordinate={ele.coords}
                >
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
        <View style={[styles.optionContainer, filterModalOpen ? {} : {  height: 0, borderWidth: 0 } ]}>
          {data.map((ele, index) => (
            <View
              key={index.toString()}
              style={[
                styles.option,
                { borderBottomWidth: index !== data.length - 1 ? 1 : 0 },
              ]}
            >
              <TouchableOpacity
                onPress={() =>
                  this.setState({
                    filter: ele.toLowerCase(),
                    filterModalOpen: false
                  })
                }
                style={styles.optionWrapper}
              >
                <>
                  <Text style={styles.optionText}>{ele}</Text>
                  <Check
                    style={{
                      display:
                        filter.toLowerCase() === ele.toLowerCase()
                          ? "flex"
                          : "none",
                    }}
                  />
                </>
              </TouchableOpacity>
            </View>
          ))}
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
  option: {
    height: 40,
  },
  optionText: {
    fontSize: 17,
  },
  optionContainer: {
    position: "absolute",
    width: 200,
    height: 160,
    left: 212,
    top: 65,
    zIndex: 1,
    borderWidth: 2,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  optionWrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15
  },
});

export default Maptracker;
