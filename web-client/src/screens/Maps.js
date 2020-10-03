import React, { Component } from "react";
import GoogleMapReact from "google-map-react";
import { AppBarComponent } from "../component";
import { getLocationData } from "../api";
import { getImage } from "../utlis.js";
import { DisplayCard } from './MapCard'

const AnyReactComponent = ({ text }) => <div style={{border: '10px solid' }}>{text}</div>;

class Maps extends Component {
  state = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 17,
    data: [],
  };

  initializeData = () => {
    getLocationData().then((res) => {
      if (res.status) {
        const {
          message: { cords },
        } = res;
        const newData = cords.map((ele) => ({
          lat: ele.latitude,
          lng: ele.longitude,
          data: {
            url: getImage(ele.image),
            created: ele.created,
            processing: ele.processing,
            complete: ele.complete,
            point: {
              id: res.message._id,
              point: ele,
            },
          }
        }));
        this.setState({
          data: newData,
        });
      }
    });
  }


  componentDidMount() {
    navigator.geolocation.getCurrentPosition((position) => {
      const {
        coords: { latitude, longitude },
      } = position;
      this.setState({
        center: {
          lat: latitude || 59,
          lng: longitude || 24,
        },
      });
      this.initializeData()
    });
  }

  render() {
    const {
      state: { center, zoom, data },
    } = this;
    console.log({ data, center })
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "calc(100vh - 64px)", width: "100%" }}>
        <AppBarComponent title="Maps" />
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyBXWuCYSYQ886FGEsscmc5NQNA6bLrkyec" }}
          defaultCenter={center}
          defaultZoom={zoom}
          onChange={( props ) => {
            this.setState({
              zoom: props.zoom
            })
          }}
        >
          {data.map((ele) => (
            <DisplayCard lat={ele.lat} lng={ele.lng} data={ele.data} refresh={this.initializeData} />
          ))}
        </GoogleMapReact>
      </div>
    );
  }
}

export { Maps };
