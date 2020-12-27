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
  Modal,
  Dimensions
} from "react-native";
import { Video } from 'expo-av';
import { Audio } from "expo-av";
import * as ImagePicker from "expo-image-picker";
import {MaterialIcons} from '@expo/vector-icons';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import {
  Upload,
  AddFile,
  ImageIcon,
  VideoIcon,
  AudioIcon,
  CloseIcon,
} from "../components/icons";
import InputField from "../components/InputFields";
import Header from "../components/Header";
import SubmitButton from '../components/BigButton';
import { setComplaint } from "../api";
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
    imageUrl: "",
    subject: "",
    description: "",
    cover: "",
    preview: {},
    attachments: [],
    options: [
      {
        name: "Sindh Departments",
        id: "0",
        children: [
          {
            name: "KU",
            id: "00",
          },
          {
            name: "KMC",
            id: "01",
          },
          {
            name: "K.E",
            id: "02",
          },
          {
            name: "C.B",
            id: "03",
          },
          {
            name: "NHA",
            id: "04",
          },
        ],
      },
    ],
    selectedItems: [],
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
    console.log(this.props.context.mapRegion)
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

  onSelect = (selectedItems) => {
    this.setState({ selectedItems });
  };

  handleSubmit = async () => {
    const {
      subject,
      description,
      attachments,
      selectedItems: selectedItemsRaw,
      cover,
      options,
    } = this.state;
    const { context: { mapRegion: { latitude, longitude } } } = this.props;
    const selectedItems = selectedItemsRaw.map((ele) => {
      const parent = ele.slice(0, 1);
      return options[+parent].children[+ele.slice(1)].name;
    });
    const status = await setComplaint({
      subject,
      description,
      attachments,
      selectedItems,
      cover,
      latitude,
      longitude,
    });
    console.log({ status });
  };

  render() {
    const {
      imageUrl,
      subject,
      description,
      attachments,
      preview,
      options,
      selectedItems,
    } = this.state;
    return (
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }} enabled>
        <Header text="Complain" {...this.props} />
        <Modal
          animationType="slide"
          visible={Boolean(Object.keys(preview).length)}
          onRequestClose={() => {
            this.setState({
              preview: {},
            });
          }}
        >
          <View style={{ backgroundColor: "#000", flex: 1 }}>
            <TouchableOpacity
              onPress={() =>
                this.setState({
                  preview: {},
                })
              }
              style={{
                alignSelf: "flex-end",
                marginTop: 15,
              }}
            >
              <CloseIcon fill="#fff" />
            </TouchableOpacity>
            <View style={{ flex: 1, justifyContent: "center" }}>
              {preview.length ? (
                <View />
              ) : (
                <View
                  style={{
                    width: width,
                    backgroundColor: "#fff",
                    height: width * (9 / 16),
                  }}
                >
                  {preview.type === "image" ? (
                    <Image
                      style={{ height: "100%", width: "100%" }}
                      source={{ uri: preview.uri }}
                    />
                  ) : (
                    <Video
                      source={{ uri: preview.uri }}
                      rate={1.0}
                      volume={1.0}
                      shouldPlay
                      isMuted={false}
                      isLooping
                      useNativeControls
                      resizeMode="contain"
                      style={{
                        height: "100%",
                        width: "100%",
                      }}
                    />
                  )}
                </View>
              )}
            </View>
          </View>
        </Modal>
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
            <SectionedMultiSelect
              styles={{
                selectToggle: styles.selectToggle,
              }}
              items={options}
              IconRenderer={MaterialIcons}
              uniqueKey="id"
              subKey="children"
              selectText="Select"
              hideSearch={true}
              showDropDowns={true}
              readOnlyHeadings={true}
              onSelectedItemsChange={this.onSelect}
              selectedItems={selectedItems}
              colors={{
                primary: "#f28800",
              }}
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
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                {attachments.map((attachment, index) => (
                  <TouchableOpacity
                    key={attachment.uri}
                    onLongPress={() => this.handleRemoveAttachment(index)}
                    onPress={() => this.setState({ preview: attachment })}
                    style={styles.attachmentButtons}
                  >
                    {attachment.length ? (
                      <>
                        <AudioIcon />
                        <Text>Audio</Text>
                      </>
                    ) : attachment.type === "image" ? (
                      <>
                        <ImageIcon />
                        <Text>Picture</Text>
                      </>
                    ) : (
                      <>
                        <VideoIcon />
                        <Text>Video</Text>
                      </>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
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
