import React, { createContext, Component } from 'react'
import { Text, View, Button, Vibration, Platform } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
const Context = createContext()

class ContextProvider extends Component {
    state = { 
        mapRegion: null,
        expoPushToken: '',
        notification: {},
    }

      registerForPushNotificationsAsync = async () => {
        if (Constants.isDevice) {
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = await Notifications.getExpoPushTokenAsync();
          console.log(token);
          this.setState({ expoPushToken: token });
        } else {
          alert('Must use physical device for Push Notifications');
        }
    
        if (Platform.OS === 'android') {
          Notifications.createChannelAndroidAsync('default', {
            name: 'default',
            sound: true,
            priority: 'max',
            vibrate: [0, 250, 250, 250],
          });
        }
      };
    
      componentDidMount() {
        this.registerForPushNotificationsAsync();
        this._notificationSubscription = Notifications.addListener(this._handleNotification);
      }
    
      _handleNotification = notification => {
        Vibration.vibrate();
        console.log(notification);
        this.setState({ notification: notification });
      };

    setMapRegion = (mapRegion)=> {
        this.setState({
            mapRegion
        })
    }

    getValues = () => ({
        ...this.state,
        setMapRegion: this.setMapRegion
    })

    render(){
        return(
            <Context.Provider value={this.getValues()}>
                {this.props.children}
            </Context.Provider>
        )
    }
}

export { ContextProvider, Context }  