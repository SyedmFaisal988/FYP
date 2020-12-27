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
  ToastAndroid,
  Picker,
  Dimensions
} from "react-native";
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import {
  Upload,
} from "../components/icons";
import InputField from "../components/InputFields";
import Header from "../components/Header";
import SubmitButton from '../components/BigButton';
import { setCrowdData } from "../api";
import { Context } from '../context'

const { width } = Dimensions.get('window')

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
    marginLeft: 0,
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
    marginBottom: 10,
  },
  selectToggle: {
    height: 40,
    paddingTop: 7,
    marginTop: 10,
    paddingLeft: 10,
    borderRadius: 10,
    backgroundColor: '#e1e1e1'
  }
});

let recording = null;

class Complain extends React.Component {
  state = {
    quality: '',
    subject: "",
    imageUrl: "",
    description: "",
    selectedItems: "",
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
      base64: true,
      exif: true,
    });
    if (result && !result.cancelled) {
      if (isCover) {
        this.setState({
          imageUrl: result.uri,
          cover: result.base64,
        });
      } else {
        await new Promise((resolve, reject) => {
          fetch(result.uri).then((blob) => {
            const fileReaderInstance = new FileReader();
            fileReaderInstance.readAsDataURL(blob._bodyBlob);
            fileReaderInstance.onload = () => {
              result.base64 = fileReaderInstance.result;
              resolve();
            };
          }).catch((err) => {
            console.log("err", err)
            reject();
          });
        });
        this.setState((prevState) => ({
          attachments: prevState.attachments.concat([
            { type: result.type, uri: result.uri, blob: result.base64 },
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
      await soundObject.loadAsync({ uri: recordingInstance.uri });
      await soundObject.playAsync();
      setTimeout(() => {
        soundObject.unloadAsync().then(() => {});
      }, recordingInstance.length);
    } catch (error) {
      // An error occurred!
    }
  };

  onRecordingAudioEnd = async () => {
    if (!recording) return;
    Vibration.vibrate(100);
    await recording.stopAndUnloadAsync();
    const blob = await fetch(recording._uri);
    const fileReaderInstance = new FileReader();
    fileReaderInstance.readAsDataURL(blob._bodyBlob);
    fileReaderInstance.onload = () => {
      const base64data = fileReaderInstance.result;
      this.setState((prevState) => ({
        attachments: prevState.attachments.concat([
          {
            uri: recording._uri,
            length: recording._finalDurationMillis,
            blob: base64data,
          },
        ]),
      }));
      recording = null;
    };
  };

  handleRemoveAttachment = (index) => {
    const { attachments } = this.state;
    const newAttachments = JSON.parse(JSON.stringify(attachments));
    newAttachments.splice(index, 1);
    this.setState({
      attachments: newAttachments,
    });
    const attachment = attachments[index];
    ToastAndroid.show(
      `${
        attachment.length
          ? "Audio"
          : attachment.type === "image"
          ? "Picture"
          : "Video"
      } Deleted !`,
      ToastAndroid.SHORT
    );
  };

  handleSubmit = async () => {
    const {
      cover,
      quality,
      description,
      selectedItems,
    } = this.state;
    const { context: { mapRegion: { latitude, longitude } } } = this.props;
    await setCrowdData({
      cover,
      quality,
      latitude,
      longitude,
      description,
      selectedItems,
    });
  };

  render() {
    const {
      quality,
      imageUrl,
      description,
      selectedItems,
    } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} enabled>
        <Header text="Crowd Sourcing" {...this.props} />
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
            <Text style={styles.labelText}>Quantity</Text>
            <InputField
              customStyle={{
                width: 100
              }}
              value={quality}
              placeholder="Enter Quantity"
              onChange={(value) => this.handleChangeInput("quality", value)}
            />
            <View style={{ marginBottom: 15 }} />
            <Text style={styles.labelText}>Unit</Text>
            <Picker
              selectedValue={selectedItems}
              style={{height: 50, width: width - 20}}
              onValueChange={(itemValue, itemIndex) =>
                this.setState({selectedItems: itemValue})
              }>
              <Picker.Item label="K.G" value="kg" />
              <Picker.Item label="Pound" value="pound" />
              <Picker.Item label="Ton" value="ton" />
            </Picker>
            </View>
          <View style={{ marginBottom: 15 }} />
          <SubmitButton text="Submit" onPress={this.handleSubmit} />
          <View style={{ marginBottom: 15 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

export default (props) => <Context.Consumer>
{
  context=> <Complain {...props} context={context} />
}
</Context.Consumer>;
