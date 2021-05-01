import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
  AsyncStorage,
  Dimensions,
  ScrollView,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { logIn } from "../api/authentication";
import InputField from "../components/InputFields";
import LoginButton from "../components/BigButton";
import { Envalop, Password } from "../components/icons";
import logo from "../assets/conceptRemake.png";
import LoadingScreen from "../components/loader";
import { Context } from "../context";

const { height } = Dimensions.get("window");

class Login extends Component {
  state = {
    username: "",
    password: "",
    loading: false,
  };

  handleLogin = async () => {
    await this.setState({ loading: true });
    const { username, password } = this.state;
    const response = await logIn({ username, password, pushToken: this.props.context.expoPushToken });
    if (response.success) {
      AsyncStorage.setItem(
        "token",
        JSON.stringify(response.token.replace(/"/g, ""))
      );
      AsyncStorage.setItem('user', JSON.stringify(response));
      console.log('response', response)
      await this.setState({ loading: false, username: "", password: "" });
      return this.props.navigation.navigate("authorizeNavigator");
    }
    await this.setState({ loading: false });
    return Alert.alert("Ops", "Invalid User name or password");
  };

  render() {
    const { username, password, loading } = this.state;
    console.log({props: this.props})
    return (
      <ScrollView>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <LoadingScreen loading={loading} />
        <SafeAreaView style={{ height: height }}>
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
              <Text style={styles.headerText}>Login</Text>
            </View>
          </LinearGradient>
          <View style={{ flex: 0.65 }}>
            <View style={styles.inputWrapper}>
              <InputField
                placeholder={"User Name"}
                value={username}
                onChange={(value) => this.setState({ username: value })}
              >
                <Envalop />
              </InputField>
              <InputField
                secureTextEntry
                value={password}
                placeholder={"Password"}
                onChange={(value) => this.setState({ password: value })}
              >
                <Password />
              </InputField>
            </View>
            <Text
              style={[
                styles.text,
                { textAlign: "right", paddingRight: 35, marginTop: 10 },
              ]}
            >
              Forgot Password ?
            </Text>
            <View style={{ flex: 0.6, justifyContent: "flex-end" }}>
              <LoginButton text="Login" onPress={() => this.handleLogin()} />
              <View style={styles.textWrapper}>
                <Text style={styles.text}>don't have a account ?</Text>
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("register");
                  }}
                >
                  <Text style={styles.textClickable}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </ScrollView>
    );
  }
}

export default (props) => (
  <Context.Consumer>
    {(context) => <Login {...props} context={context} />}
  </Context.Consumer>
);

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
  logoWrapper: {
    height: 100,
    width: 100,
    padding: 7,
    borderColor: "#fff",
    borderWidth: 5,
    borderRadius: 50,
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 29,
    color: "#fff",
    textAlign: "right",
    marginBottom: -5,
  },
  inputWrapper: {
    marginHorizontal: 30,
    marginTop: 40,
    flex: 0.3,
    justifyContent: "space-between",
  },
  headerTextWrapper: {
    alignSelf: "flex-end",
    flex: 0.2,
    marginBottom: -20,
  },
});

// export default Login;
