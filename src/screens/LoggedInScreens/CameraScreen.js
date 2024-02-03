import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
  LogBox,
  Image,
  BackHandler,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const CameraScreen = ({route, navigation}) => {
  const UID = route.params.UID;
  const receiverUID = route.params.receiverUID;

  const [hasPermission, setHasPermission] = useState(null);
  const [photo, setPhoto] = useState(null); // New state for storing the photo URI
  const [showCamera, setShowCamera] = useState(true); // New state to control camera visibility
  const [loading, setloading] = useState(false); // New state to control camera visibility

  let cameraRef = useRef(null);

  const {width, height} = Dimensions.get('window'); // Get full screen dimensions

  useEffect(() => {
    // Ignore the ViewPropTypes deprecation warning
    LogBox.ignoreLogs([
      "ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the 'deprecated-react-native-prop-types' package.",
    ]);

    requestCameraPermission();
  }, []);

  useEffect(() => {
    requestCameraPermission();
    // Custom back button handling
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (photo) {
          setShowCamera(true); // Show camera when back button is pressed if image preview is active
          setPhoto(null); // Reset photo state
          return true; // Prevent default back action
        }
        return false; // Default back action
      },
    );

    return () => backHandler.remove();
  }, [photo]);

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
      setShowCamera(false); // Hide camera to show image preview
    }
  };

  const sendImageMessage = imageUrl => {
    const chatID = [UID, receiverUID].sort().join('_');
    const chatRef = database().ref(`conversations/${chatID}/messages`);

    setloading(true);
    // Push the new image message to the path.
    chatRef.push({
      imageUrl: imageUrl, // Include the image URL in the message
      timestamp: database.ServerValue.TIMESTAMP,
      sender: UID,
    });
    setloading(false);
  };

  const sendPhoto = async () => {
    if (!photo) {
      Alert.alert('No photo to send');
      return;
    }

    try {
      setloading(true);

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
      setloading(false);
      navigation.goBack(); // or navigation.navigate('ChatDetails', {imageUrl: url});
    } catch (error) {
      Alert.alert('Error sending photo:', error);
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
      {showCamera && (
        <>
          <RNCamera
            ref={cameraRef}
            style={styles.preview}
            type={RNCamera.Constants.Type.back}
            flashMode={RNCamera.Constants.FlashMode.off}
            captureAudio={false}
          />
          <TouchableOpacity
            onPress={takePicture}
            style={styles.takePictureButton}>
            <MaterialIcons name="camera" size={60} color="#fff" />
          </TouchableOpacity>
        </>
      )}
      {photo && (
        <View style={styles.fullScreenImageContainer}>
          <Image
            source={{uri: photo.uri}}
            style={styles.fullScreenImage}
            resizeMode="contain"
          />
          {loading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#6A5BC2" />
              <Text style={{color:'#fff', marginTop:10}}>Uploading</Text>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setShowCamera(true)}
            style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={30} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity onPress={sendPhoto} style={styles.sendButton}>
            <MaterialIcons name="send" size={30} color="#fff" />
          </TouchableOpacity>
        </View>
      )}
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

  buttonText: {
    color: 'white',
    fontSize: 16,
    position: 'absolute',
    bottom: 10,
    right: 10,
    zIndex: 10,
  },
  text: {
    fontSize: 16,
    color: 'white',
  },
  capture: {
    flex: 0,
    // backgroundColor: 'blue',
    padding: 15,
    alignSelf: 'center',
    margin: 20,
  },

  image: {
    width: '100%',
    height: '100%',
    // backgroundColor: 'blue',
    zIndex: -10,
  },
  fullScreenImageContainer: {
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  fullScreenImage: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 20,
    left: 10,
    padding: 10,
    backgroundColor: '#0004',
    zIndex: 10, // Ensure the button is clickable by placing it above the image
  },
  sendButton: {
    position: 'absolute',
    bottom: 40,
    right: 20,
    padding: 10,
    zIndex: 10, // Ensure the button is clickable
    backgroundColor: '#6A5BC2',
    borderRadius: 40,
  },

  takePictureButton: {
    position: 'absolute',
    bottom: 0,
    padding: 10,
    zIndex: 10, // Ensure the button is clickable
    alignSelf: 'center',
  },
  loadingContainer: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#0005', // Semi-transparent background
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20, // Ensure the loader is above the image
  },
});

export default CameraScreen;
