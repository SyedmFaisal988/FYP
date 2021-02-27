import React, { Component } from "react";
import {
  View,
  Text,
  Image,
  StatusBar,
  StyleSheet,
  Dimensions,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { signup } from "../api";
import logo from "../assets/conceptRemake.png";
import LoadingScreen from "../components/loader";
import InputField from "../components/InputFields";
import RegisterButton from "../components/BigButton";
import { Envalop, Password, UserAvatar } from "../components/icons";

const { height } = Dimensions.get("window");
class Register extends Component {
  state = {
    email: "",
    phone: "",
    address: "",
    fullName: "",
    password: "",
    loading: false,
  };

  onRegister = async () => {
    await this.setState({ loading: true });
    const { fullName, email, password, address } = this.state;
    const response = await signup({
      username: fullName,
      email,
      password,
      address,
    });
    if (response.success) {
      this.props.navigation.navigate("Start");
      return this.setState({ loading: false });
    } else {
      alert(response.messag || "Something went wrong");
      return this.setState({ loading: false });
    }
  };

  validate = () => {
    const { email } = this.state;
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      return alert("You have entered an invalid email address!");
    }
    this.onRegister();
  };

  render() {
    console.log("register");
    const { fullName, email, password, address, loading } = this.state;
    return (
      <ScrollView contentContainerStyle={{ height }}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <LoadingScreen loading={loading} />
        <View style={{ flex: 1 }}>
          <LinearGradient
            colors={["#f15e00", "#f28800"]}
            style={styles.logoContainer}
          >
            <View
              style={{
                flex: 0.8,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={styles.logoWrapper}>
                <Image
                  source={logo}
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                />
              </View>
            </View>
            <View style={styles.headerTextWrapper}>
              <Text style={styles.headerText}>Register</Text>
            </View>
          </LinearGradient>

          <View style={{ flex: 0.65 }}>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder={"Full Name"}
                value={fullName}
                onChange={(value) => this.setState({ fullName: value })}
              >
                <UserAvatar />
              </InputField>
              <InputField
                value={email}
                placeholder="Email"
                onChange={(value) => this.setState({ email: value })}
              >
                <Envalop />
              </InputField>
              <InputField
                secureTextEntry
                value={password}
                placeholder="Password"
                onChange={(value) => this.setState({ password: value })}
              >
                <Password />
              </InputField>
              <InputField
                placeholder={"Address"}
                value={address}
                onChange={(value) => this.setState({ address: value })}
              >
                <Password />
              </InputField>
            </View>
            <View style={{ flex: 0.15 }} />
            <View style={{ flex: 0.2, justifyContent: "center" }}>
              <RegisterButton text="Register" onPress={this.validate} />
              <View style={styles.textWrapper}>
                <Text style={styles.text}>Already a member ?</Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate("login")}
                >
                  <Text style={styles.textClickable}>Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  logoContainer: {
    flex: 0.35,
    borderBottomLeftRadius: 118,
    padding: 24,
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0.5 * 20 },
    shadowOpacity: 1,
    shadowRadius: 0.8 * 20,
  },
  text: {
    fontSize: 13,
    color: "#00000080",
    fontWeight: "bold",
  },
  textClickable: {
    paddingLeft: 3,
    color: "#f28800",
    fontSize: 13,
    fontWeight: "bold",
  },
  textWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 35,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 29,
    color: "#fff",
    textAlign: "right",
    marginBottom: -5,
  },
  logoWrapper: {
    height: 100,
    width: 100,
    padding: 7,
    borderColor: "#fff",
    borderWidth: 5,
    borderRadius: 50,
  },
  headerTextWrapper: {
    alignSelf: "flex-end",
    flex: 0.2,
    marginBottom: -20,
  },
  inputWrapper: {
    marginHorizontal: 30,
    marginTop: 40,
    flex: 0.6,
    justifyContent: "space-between",
  },
});

export default Register;
