import React, { Component } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";

import { addExpense } from "../api";
import Header from "../components/Header";
import Loader from "../components/loader";
import InputField from "../components/InputFields";
import SubmitButton from "../components/BigButton";
import { cos } from "react-native-reanimated";

export default class Expense extends Component {
  state = {
    type: "",
    cost: "",
    vehicleNo: "",
    loading: false,
    description: "",
  };

  handleChangeInput = (key, value) => {
    this.setState({ [key]: value });
  };

  handleSubmit = async () => {
    await this.setState({ loading: true });
    const { type, cost, vehicleNo, description } = this.state;
    if (!type || !cost || !vehicleNo) {
      this.setState({ loading: false });
      return Alert.alert("Validation error", "Quantity needs to be numeric value");
    }
    const response = await addExpense({
      type,
      cost,
      vehicleNo,
      description,
    });
    if (response.status === 200) {
      Alert.alert("Message", "updated successfully");
      this.setState(
        JSON.parse(
          JSON.stringify({
            type: "",
            cost: "",
            vehicleNo: "",
            description: "",
          })
        )
      );
    } else {
      Alert.alert("Something went wrong", response.message);
    }
    this.setState({ loading: false });
  };

  render() {
    const { description, type, vehicleNo, cost, loading } = this.state;
    return (
      <ScrollView>
        <Header text="Add Expense" {...this.props} />
        <Loader loading={loading} />
        <View style={styles.content}>
          <Text style={styles.labelText}>Description</Text>
          <InputField
            customStyle={{
              height: 100,
            }}
            multiline
            placeholder="Enter description"
            value={description}
            onChange={(value) => this.handleChangeInput("description", value)}
          />
          <View style={{ marginBottom: 15 }} />

          <Text style={styles.labelText}>Type*</Text>
          <InputField
            customStyle={{
              height: 100,
            }}
            placeholder="Enter type"
            value={type}
            onChange={(value) => this.handleChangeInput("type", value)}
          />
          <View style={{ marginBottom: 15 }} />

          <Text style={styles.labelText}>Vehicle Registration*</Text>
          <InputField
            customStyle={{
              height: 100,
            }}
            placeholder="Enter vehicle registration number"
            value={vehicleNo}
            onChange={(value) => this.handleChangeInput("vehicleNo", value)}
          />
          <View style={{ marginBottom: 15 }} />

          <Text style={styles.labelText}>Cost*</Text>
          <InputField
            customStyle={{
              height: 100,
            }}
            value={cost}
            keyboardType="numeric"
            placeholder="Enter cost"
            onChange={(value) => this.handleChangeInput("cost", value)}
          />
          <View style={{ marginBottom: 15 }} />
        </View>
        <SubmitButton text="Submit" onPress={this.handleSubmit} />
        <View style={{ marginBottom: 15 }} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  labelText: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },
  content: {
    margin: 15,
  },
});
