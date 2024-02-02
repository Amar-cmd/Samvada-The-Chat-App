import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  LogBox,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

const CameraScreen = ({ route, navigation }) => {
    const UID = route.params.UID;
    const receiverUID = route.params.receiverUID;

  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null); // New state for storing the photo URI
  let cameraRef = useRef(null);

    
  useEffect(() => {
    // Ignore the ViewPropTypes deprecation warning
    LogBox.ignoreLogs([
      "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.",
    ]);

    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const result = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.CAMERA
        : PERMISSIONS.ANDROID.CAMERA,
    );
    setHasPermission(result === RESULTS.GRANTED);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data); // Store the photo object containing the URI
      Alert.alert('Picture taken', data.uri);
    }
  };

    const sendImageMessage = imageUrl => {
      const chatID = [UID, receiverUID].sort().join('_');
      const chatRef = database().ref(`conversations/${chatID}/messages`);

      // Push the new image message to the path.
      chatRef.push({
        imageUrl: imageUrl, // Include the image URL in the message
        timestamp: database.ServerValue.TIMESTAMP,
          sender: UID,
        isImageUrl: true
      });
    };


//   const sendPhoto = async () => {
//     if (!photo) {
//       console.log('No photo to send');
//       return;
//     }

//     try {
//       const fileName = `photo_${new Date().getTime()}.jpg`; // Creating a unique file name

//       // Creating a reference to the location where you want to upload the image
//       const storageRef = storage().ref(`${UID}/${receiverUID}/photos/${fileName}`);

//       // Upload the image
//       await storageRef.putFile(photo.uri);

//       // After uploading, fetch the URL of the image
//       const url = await storageRef.getDownloadURL();
//       console.log('Uploaded photo URL:', url);
//     //   Alert.alert('Photo sent', url);
//         navigation.navigate('ChatDetails', {imageUrl: url});
//       // Here you can now save the `url` along with other message data to Firestore or Realtime Database
//     } catch (error) {
//       console.log('Error sending photo:', error);
//       Alert.alert('Error', 'Failed to send photo.');
//     }
//   };
    
    const sendPhoto = async () => {
      if (!photo) {
        console.log('No photo to send');
        return;
      }

      try {
        const fileName = `photo_${new Date().getTime()}.jpg`; // Creating a unique file name
        const storageRef = storage().ref(
          `${UID}/${receiverUID}/photos/${fileName}`,
        );

        // Upload the image
        await storageRef.putFile(photo.uri);

        // After uploading, fetch the URL of the image
        const url = await storageRef.getDownloadURL();
        console.log('Uploaded photo URL:', url);

        // Send the image URL as a message
        sendImageMessage(url);

        // Optionally navigate back or give feedback
        navigation.goBack(); // or navigation.navigate('ChatDetails', {imageUrl: url});
        Alert.alert('Photo sent', 'Your photo has been sent successfully.');
      } catch (error) {
        console.log('Error sending photo:', error);
        Alert.alert('Error', 'Failed to send photo.');
      }
    };


  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting permission...</Text>
      </View>
    );
  } else if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera permission is denied.</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestCameraPermission}>
          <Text style={styles.buttonText}>Tap to request camera access</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.on}
        captureAudio={false}
      />
      <View style={{flex: 0, flexDirection: 'row', justifyContent: 'center'}}>
        {!photo ? (
          <TouchableOpacity onPress={takePicture} style={styles.capture}>
            <Text style={styles.buttonText}>SNAP</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={sendPhoto} style={styles.capture}>
            <Text style={styles.buttonText}>SEND</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: '100%',
    width: '100%',
  },
  capture: {
    flex: 0,
    backgroundColor: 'blue',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
});

export default CameraScreen;
