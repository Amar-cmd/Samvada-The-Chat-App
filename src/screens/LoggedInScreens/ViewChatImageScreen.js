import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import database from '@react-native-firebase/database';
import storage from '@react-native-firebase/storage';

const ViewChatImageScreen = ({route, navigation}) => {
  const {url, uri: initialUri, UID, receiverUID} = route.params;
  const [loading, setLoading] = useState(false); // State to manage loading status
  const [uri, setUri] = useState(initialUri); // Use this state directly to manage the URI

  // Function to upload image to Firebase Storage and send the URL to Realtime Database
  const sendPhoto = async () => {
    if (!uri) {
      Alert.alert('No photo to send');
      return;
    }

    try {
      setLoading(true);
      const fileName = `photo_${new Date().getTime()}.jpg`; // Unique file name
      const storageRef = storage().ref(
        `${UID}/${receiverUID}/photos/${fileName}`,
      );

      // Upload the image
      await storageRef.putFile(uri);

      // After uploading, fetch the URL of the image
      const uploadedUrl = await storageRef.getDownloadURL();

      // Send the image URL as a message
      sendImageMessage(uploadedUrl);

      // Reset URI and loading state, then navigate back
      setUri(null); // Reset URI to clear the current image
      setLoading(false);
      navigation.goBack();
    } catch (error) {
      setLoading(false);
      Alert.alert('Error sending photo:', error.message);
    }
  };

  const sendImageMessage = imageUrl => {
    const chatID = [UID, receiverUID].sort().join('_');
    const chatRef = database().ref(`conversations/${chatID}/messages`);

    chatRef.push({
      imageUrl: imageUrl,
      timestamp: database.ServerValue.TIMESTAMP,
      sender: UID,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5BC2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Image source={{uri: uri || url}} style={styles.image} />
      {!url && (
        <TouchableOpacity style={styles.sendButton} onPress={sendPhoto}>
          <Icon name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6A5BC2',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});

export default ViewChatImageScreen;
