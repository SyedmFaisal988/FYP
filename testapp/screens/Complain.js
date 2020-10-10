import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  Vibration,
} from "react-native";
import { Upload, AddFile, ImageIcon, VideoIcon, AudioIcon } from "../components/icons";
import InputField from "../components/InputFields";
import * as ImagePicker from "expo-image-picker";
import { Audio } from "expo-av";
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
    elevation: 10,
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
    marginLeft: 0
  },
  attachmentButtons: {
    backgroundColor: "#eaeaea",
    width: 100,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: 15,
    marginBottom: 10
  }
});

let recording = null;

class Complain extends React.Component {
  state = {
    imageUrl: "",
    subject: "",
    description: "",
    attachments: [{
      type: ImagePicker.MediaTypeOptions.Images
    }, {
      length: 234,
    }, {
      uri: ''
    }],
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
      allowsMultipleSelection: true,
      exif: true,
      
    });
    console.log({ result });
    if (result && !result.cancelled) {
      if (isCover) {
        this.setState({
          imageUrl: result.uri,
        });
      } else {
        this.setState((prevState) => ({
          attachments: prevState.attachments.concat([
            { type: result.type, uri: result.uri },
          ]),
        }));
      }
    }
  };

  onRecordingAudioStart = async () => {
    Vibration.vibrate(300);
    recording = new Audio.Recording();
    try {
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
    } catch (error) {
      console.log({ error });
    }
  };

  playBackRecording = async (recordingInstance) => {
    const soundObject = new Audio.Sound();
    try {
      await soundObject.loadAsync({ uri: recordingInstance._uri });
      await soundObject.playAsync();
      setTimeout(() => {
        soundObject.unloadAsync().then(() => {});
      }, recordingInstance._finalDurationMillis);
    } catch (error) {
      // An error occurred!
    }
  };

  onRecordingAudioEnd = async () => {
    if (!recording)
      return;
    Vibration.vibrate(100);
    await recording.stopAndUnloadAsync();
    await this.playBackRecording(recording);
    this.setState((prevState) => ({
      attachments: prevState.attachments.concat([
        { uri: recording._uri, length: recording._finalDurationMillis },
      ]),
    }));
    recording = null;
  };

  render() {
    const { imageUrl, subject, description, attachments } = this.state;
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
              <TouchableOpacity
                onPress={() => this.handlePickImage()}
                onLongPress={this.onRecordingAudioStart}
                onPressOut={this.onRecordingAudioEnd}
              >
                <View style={[styles.addFileButton, styles.attachmentButtons]}>
                  <AddFile style={{ marginLeft: 10 }} />
                  <Text>Add File</Text>
                </View>
              </TouchableOpacity>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
              {attachments.map((attachment) => (
                <View style={styles.attachmentButtons}>
                  {attachment.length ? (
                    <AudioIcon />
                  ) : attachment.type ===
                        "image" ? (
                    <ImageIcon />
                  ) : (
                    <VideoIcon />
                  )}
                </View>
              ))}
              </ScrollView>
            </View>
          </View>
          <View style={{ marginBottom: 15 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default Complain;
