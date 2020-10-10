import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Upload, AddFile } from "../components/icons";
import InputField from "../components/InputFields";
import * as ImagePicker from "expo-image-picker";
import { Audio } from 'expo-av';
import Header from "../components/Header";

const styles = StyleSheet.create({
  root: {
    marginHorizontal: 15,
  },
  imageContainer: {
    height: 200,
    marginVertical: 15,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    elevation: 10
  },
  labelText: {
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 5,
  },
  attachmentContainer: {
    flexDirection: "row",
  },
  addFileButton: {
    width: 100,
    height: 100,
    backgroundColor: "#eaeaea",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 10,
  },
});

class Complain extends React.Component {
  state = {
    imageUrl: "",
    subject: "",
    description: "",
    formData: {
      image: null,
    },
  };

  initializeComponent = async () => {
    const {
      status: cameraStatus,
    } = await ImagePicker.requestCameraRollPermissionsAsync();
    if (cameraStatus !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    const { status: audioStatus } = await Audio.requestPermissionsAsync();
    if (audioStatus !== "granted") {
      alert("Sorry, we need audio permissions to make this work!");
    }
  };

  handleChangeInput = (key, value) => {
    this.setState({ [key]: value });
  };

  componentDidMount() {
    this.initializeComponent();
  }

  handlePickImage = async (isCover = false) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: isCover
        ? ImagePicker.MediaTypeOptions.Images
        : ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.4,
      exif: true,
    });
    if (result && !result.cancelled) {
      if (isCover) {
        this.setState({
          imageUrl: result.uri,
        });
      } else {
        return console.log(result);
      }
    }
  };

  render() {
    const { imageUrl, subject, description } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} enabled>
        <Header text="Complain" {...this.props} />
        <ScrollView>
          <View style={styles.root}>
            <TouchableOpacity
              onPress={() => this.handlePickImage(true)}
              style={styles.imageContainer}
            >
              {!imageUrl ? (
                <Upload />
              ) : (
                <Image
                  style={{ borderWidth: 1, height: "100%", width: "100%" }}
                  source={{
                    uri: imageUrl,
                  }}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.labelText}>Subject</Text>
            <InputField
              placeholder="Enter Subject"
              value={subject}
              onChange={(value) => this.handleChangeInput("subject", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Description</Text>
            <InputField
              customStyle={{
                height: 100,
              }}
              multiline
              placeholder="Enter Description"
              value={description}
              onChange={(value) => this.handleChangeInput("description", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Attachments</Text>
            <View style={styles.attachmentContainer}>
              <View style={styles.addFileButton}>
                <TouchableOpacity onPressIn={() => { console.log('press') }} onLongPress={() => {console.log('long')}} onPressOut={() => {console.log('unPress')}}>
                  <AddFile  style={{ marginLeft: 10 }} />
                </TouchableOpacity>
                <Text>Add File</Text>
              </View>
            </View>
          </View>
          <View style={{ marginBottom: 15 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Complain;
