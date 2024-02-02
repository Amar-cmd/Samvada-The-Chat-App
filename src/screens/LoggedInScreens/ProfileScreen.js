import React, {useContext, useEffect, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import ToastContext from '../../context/ToastContext';
import styles from '../../styles/LoggedInScreenStyles/ProfileScreenStyle';

const ProfileScreen = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {showToast} = useContext(ToastContext);

  const UID = route.params.UID;
  const userImage = route.params.userImage;
  const [name, setName] = useState(route.params.name);
  const phoneNumber = route.params.phoneNumber;

  const [isEditing, setIsEditing] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(userImage);
  const [initialName] = useState(route.params.name);
  const [initialImageUri] = useState(userImage);
  const [hasChanged, setHasChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateName = () => {
    setIsEditing(false);
  };

  const handleWallpaperPress = () => {
    navigation.navigate('Wallpaper');
  };

  const handleProfileImagePress = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true,
      quality: 1,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.error('ImagePicker Error: ', response.errorMessage);
        Alert.alert('Error', 'Image picker error. Please try again.');
      } else if (response.assets && response.assets.length > 0) {
        const source = {uri: response.assets[0].uri};
        setSelectedImageUri(source.uri);
      }
    });
  };

  const uploadImageToFirebase = async uri => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = storage().ref().child(`profile_images/${UID}`);
    let downloadURL;
    let snapshot;
    try {
      snapshot = await ref.put(blob);

      // Use fullPath to get the download URL
      const fullPath = snapshot.metadata.fullPath;
      downloadURL = await storage().ref(fullPath).getDownloadURL();
    } catch (error) {
      console.error('Error during the upload process:', error);
      throw error; // re-throwing the error to be caught in handleUpdate
    } finally {
      // Ensure that the blob is closed even if there's an error
      blob.close();
    }

    return downloadURL;
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    let changes = {};
    console.log(UID);
    // Check if profile image has changed
    if (selectedImageUri !== userImage) {
      try {
        const imageUrl = await uploadImageToFirebase(selectedImageUri);
        changes.userImage = imageUrl;
      } catch (error) {
        setIsLoading(false);
        console.error('Error uploading image to Firebase: ', error);
        Alert.alert('Error', 'Failed to upload new profile image.');
        return;
      }
    }

    // Check if username has changed
    if (name !== route.params.name) {
      changes.username = name;
      console.log(UID);
    }

    // Update Firestore if there are any changes
    if (Object.keys(changes).length) {
      firestore()
        .collection('users')
        .doc(UID)
        .update(changes)
        .then(() => {
          showToast('Your profile has been updated.');
        })
        .catch(error => {
          setIsLoading(false);

          console.error('Error updating profile: ', error);
          Alert.alert('Error', `Error updating profile. ${error}`);
        });
    } else {
      showToast('No changes detected in your profile.');
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (name !== initialName || selectedImageUri !== initialImageUri) {
      setHasChanged(true);
    } else {
      setHasChanged(false);
    }
  }, [name, selectedImageUri]);

  return (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.containerBackground},
        ]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name="arrow-back"
              size={styles.icon.fontSize}
              color="#7A7A7A"
            />
          </TouchableOpacity>
          <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Icon name="menu" size={styles.icon.fontSize} color="#0000" />
          </View>
        </View>

        {/* Content Container */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={[styles.content, {backgroundColor: theme.background}]}>
              {/* Profile Image */}
              <View>
                <TouchableOpacity onPress={handleProfileImagePress}>
                  <Image
                    source={{
                      uri: selectedImageUri ? selectedImageUri : userImage,
                    }}
                    style={styles.profileImage}
                  />
                  <View style={styles.cameraIconContainer}>
                    <Icon
                      name="camera"
                      size={styles.icon.fontSize}
                      color="#fff"
                    />
                  </View>
                </TouchableOpacity>
              </View>

              {/* Name */}
              <TouchableOpacity
                style={styles.nameContainer}
                onPress={() => setIsEditing(true)}
                activeOpacity={0.7}>
                {isEditing ? (
                  <>
                    <TextInput
                      style={styles.profileNameInput}
                      value={name}
                      onChangeText={setName}
                    />
                    <TouchableOpacity onPress={handleUpdateName}>
                      <Text style={styles.updateButtonText}>Update</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <Text style={styles.profileName}>{name}</Text>
                    <Icon
                      name="pencil"
                      size={20}
                      color="#6A5BC2"
                      style={{marginLeft: 10}}
                    />
                  </>
                )}
              </TouchableOpacity>
              {/* Phone Number */}
              <Text style={styles.phoneNumber}>{phoneNumber}</Text>

              {/* Edit Button */}
              <TouchableOpacity
                style={[
                  styles.editButton,
                  {
                    backgroundColor: theme.containerBackground,
                    opacity: hasChanged ? 1 : 0.3,
                  },
                ]}
                onPress={handleUpdate}
                disabled={!hasChanged}>
                <Text style={[styles.editButtonText, {color: theme.text}]}>
                  Update
                </Text>
              </TouchableOpacity>
              <View
                style={[
                  styles.wallpaperView,
                  {borderColor: theme.containerBackground},
                ]}>
                <TouchableOpacity
                  style={[
                    styles.wallpaperButton,
                    {
                      backgroundColor: theme.containerBackground,
                      opacity: 1, // Always active
                    },
                  ]}
                  onPress={handleWallpaperPress}>
                  <Text style={[styles.editButtonText, {color: theme.text}]}>
                    Wallpaper
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      {isLoading && (
        <View style={styles.overlay}>
          <View style={styles.loadingIndicator}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        </View>
      )}
    </>
  );
};

export default ProfileScreen;
