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

import { setMaintaince } from "../api";
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

  handleSubmit = async () => {
    await this.setState({ loading: true });
    const {
      houseNo,
      type1,
      type2,
      type3,
      type4,
      type1Amount,
      type2Amount,
      type3Amount,
      type4Amount,
    } = this.state;
    if (!houseNo || !type1 || !type2 || !type3 || !type4) {
      this.setState({ loading: false });
      return Alert.alert("Validation error", "All fields are required");
    }

    if (typeof +type1Amount === 'number' || typeof +type2Amount === 'number' || typeof +type3Amount === 'number' || typeof +type4Amount === 'number' ) {
      this.setState({ loading: false });
      return Alert.alert("Validation error", "Quantity needs to be numeric value");
    } 
    const response = await setMaintaince({
      houseNo,
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
            <Text style={styles.labelText}>Type 1</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type1Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type1Amount", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Unit</Text>
            <Picker
              selectedValue={type1}
              style={{ height: 50, width: width - 20 }}
              onValueChange={(itemValue) => this.setState({ type1: itemValue })}
            >
              <Picker.Item label="K.G" value="kg" />
              <Picker.Item label="Pound" value="pound" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type 2</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type2Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type2Amount", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Unit</Text>
            <Picker
              selectedValue={type2}
              style={{ height: 50, width: width - 20 }}
              onValueChange={(itemValue) => this.setState({ type2: itemValue })}
            >
              <Picker.Item label="K.G" value="kg" />
              <Picker.Item label="Pound" value="pound" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type 3</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type3Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type3Amount", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Unit</Text>
            <Picker
              selectedValue={type3}
              style={{ height: 50, width: width - 20 }}
              onValueChange={(itemValue) => this.setState({ type3: itemValue })}
            >
              <Picker.Item label="K.G" value="kg" />
              <Picker.Item label="Pound" value="pound" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>

            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Type 4</Text>
            <InputField
              customStyle={{
                height: 50,
              }}
              value={type4Amount}
              placeholder="Enter quantity"
              onChange={(value) => this.handleChangeInput("type4Amount", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Unit</Text>
            <Picker
              selectedValue={type4}
              style={{ height: 50, width: width - 20 }}
              onValueChange={(itemValue) => this.setState({ type4: itemValue })}
            >
              <Picker.Item label="K.G" value="kg" />
              <Picker.Item label="Pound" value="pound" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>
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
