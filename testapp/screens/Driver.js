import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Picker,
  Dimensions,
  Alert,
} from "react-native";

import { setMaintaince, getUser } from "../api";
import Header from "../components/Header";
import Loader from "../components/loader";
import InputField from "../components/InputFields";
import SubmitButton from "../components/BigButton";

const { width } = Dimensions.get("window");
const initialValues = {
  houseNo: "",
  type1: "K.G",
  type2: "K.G",
  type3: "K.G",
  type4: "K.G",
  loading: false,
  type1Amount: "",
  type2Amount: "",
  type3Amount: "",
  type4Amount: "",
};

class Driver extends Component {
  state = JSON.parse(JSON.stringify(initialValues));

  handleChangeInput = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    this.navigationListener = this.props.navigation.addListener(
      "focus",
      async () => {
        const {
          route: {
            params: { userId },
          },
        } = this.props;
        getUser({
          userId,
        })
          .then((res) => {
            console.log('new res', res)
            if (res.status !== 200) {
              throw "Something went wrong";
            }
            const {
              message: { address },
            } = res;
            this.setState({
              houseNo: address,
            });
          })
          .catch((err) => {
            console.log("err", err);
            Alert.alert("Error", err);
          });
      }
    );
  }

  handleSubmit = async () => {
    await this.setState({ loading: true });
    const {
      route: {
        params: { _id, coords },
      },
    } = this.props;

    const {
      type1,
      type2,
      type3,
      type4,
      houseNo,
      type1Amount,
      type2Amount,
      type3Amount,
      type4Amount,
    } = this.state;
    if (!houseNo || !type1 || !type2 || !type3 || !type4) {
      this.setState({ loading: false });
      return Alert.alert("Validation error", "All fields are required");
    }

    if (
      typeof +type1Amount !== "number" ||
      typeof +type2Amount !== "number" ||
      typeof +type3Amount !== "number" ||
      typeof +type4Amount !== "number"
    ) {
      this.setState({ loading: false });
      return Alert.alert(
        "Validation error",
        "Quantity needs to be numeric value"
      );
    }
    console.log("ab jae ga");
    const response = await setMaintaince({
      houseNo,
      point: coords,
      userId: _id,
      type1: `${type1};${type1Amount}`,
      type2: `${type2};${type2Amount}`,
      type3: `${type3};${type3Amount}`,
      type4: `${type4};${type4Amount}`,
    });
    if (response.status === 200) {
      Alert.alert("Message", "updated successfully");
      this.setState(JSON.parse(JSON.stringify(initialValues)));
    } else {
      Alert.alert("Something went wrong", response.message);
    }
    this.setState({ loading: false });
  };

  render() {
    const {
      houseNo,
      type1,
      type2,
      type3,
      type4,
      loading,
      type1Amount,
      type2Amount,
      type3Amount,
      type4Amount,
    } = this.state;

    console.log(this.props);
    return (
      <>
        <Header text="Pick Up" {...this.props} />
        <Loader loading={loading} />
        <ScrollView>
          <View style={styles.root}>
            <Text style={styles.labelText}>House No</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={houseNo}
              placeholder="Enter house number"
              onChange={(value) => this.handleChangeInput("houseNo", value)}
            />

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type Brown</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type1Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type1Amount", value)}
            />

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type Yellow</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type2Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type2Amount", value)}
            />

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type White</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type3Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type3Amount", value)}
            />

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type Green</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type4Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type4Amount", value)}
            />
          </View>
          <View style={{ marginBottom: 15 }} />
          <SubmitButton text="Submit" onPress={this.handleSubmit} />
          <View style={{ marginBottom: 15 }} />
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    paddingVertical: 15,
    marginHorizontal: 15,
  },
  labelText: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default Driver;
