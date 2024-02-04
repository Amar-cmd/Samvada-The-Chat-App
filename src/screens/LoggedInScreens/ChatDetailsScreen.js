import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  Image,
  StatusBar,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ImageBackground,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ThemeContext} from '../../context/ThemeContext';
import database from '@react-native-firebase/database';
import styles from '../../styles/LoggedInScreenStyles/ChatDetailsScreenStyle';
import {WallpaperContext} from '../../context/WallpaperContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {launchImageLibrary} from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FileViewer from 'react-native-file-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';

const formatSize = size => {
  if (size < 1024) return size + ' bytes';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  else if (size < 1024 * 1024 * 1024)
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const ChatDetailsScreen = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {wallpaper, setWallpaper} = useContext(WallpaperContext);
  const UID = route.params.UID;
  const receiverUID = route.params.receiverUID;
  const username = route.params.user;
  const userImage = route.params.userImage;

  console.log('==========================');
  // console.log('sender UID = ', UID);
  // console.log('receiver UID = ', receiverUID);

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [localWallpaper, setLocalWallpaper] = useState(null);
  const [showIcons, setShowIcons] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false); // Track if the audio is playing
  const [audio, setAudio] = useState(null); // Hold the Sound instance
  const [currentPosition, setCurrentPosition] = useState(0); // Current position of the playback
  const [audioDuration, setAudioDuration] = useState(0);
  const [currentAudioUrl, setCurrentAudioUrl] = useState(null); // Track the URL of the currently playing audio

  console.log('URI -> ', selectedImageUri);
  // Toggle the visibility of the icons
  const toggleIcons = () => {
    setShowIcons(!showIcons);
  };

  // Define tasks for each icon
  const performFirstTask = () => {
    console.log('Performing first task');
    // Add your task code here
    navigateToCameraScreen(navigation, UID, receiverUID);
  };

  const performSecondTask = () => {
    console.log('Performing second task');
    // Add your task code here
  };
  const performThirdTask = () => {
    console.log('Performing second task');
    // Add your task code here
  };
  const performFourthTask = () => {
    console.log('Performing second task');
    // Add your task code here
  };

  const scrollViewRef = useRef(null);

  const handleToggleMessageSelection = messageId => {
    if (selectedMessages.includes(messageId)) {
      setSelectedMessages(prevSelected =>
        prevSelected.filter(id => id !== messageId),
      );
    } else {
      setSelectedMessages(prevSelected => [...prevSelected, messageId]);
    }
  };

  const handleActivateSelectionMode = messageId => {
    setIsSelectionMode(true);
    setSelectedMessages([messageId]);
  };

  const handleDeleteSelectedMessages = () => {
    Alert.alert(
      'Delete Message?',
      'Are you sure you want to delete the selected message(s)?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const chatID = [UID, receiverUID].sort().join('_');
            const chatRef = database().ref(`conversations/${chatID}/messages`);

            // Filter out the receiver's messages and store them
            const updatedChatMessages = chatMessages.filter(msg => {
              if (selectedMessages.includes(msg.id)) {
                // If the message sender is the current user, delete the message from the backend
                if (msg.sender === UID) {
                  chatRef.child(msg.id).remove();
                }
                return false;
              }
              return true;
            });

            // Update the local state with the filtered messages (excluding the receiver's selected messages)
            setChatMessages(updatedChatMessages);

            // Reset the selection mode
            setSelectedMessages([]);
            setIsSelectionMode(false);
          },
        },
      ],
    );
  };

  const formatTime = timestamp => {
    const date = new Date(timestamp);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
  };

  const handleSendMessage = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage) {
      setShouldScrollToBottom(true);
      // Create a chat reference based on sender and receiver UIDs
      const chatID = [UID, receiverUID].sort().join('_');
      const chatRef = database().ref(`conversations/${chatID}/messages`);

      // Push the new message to the path.
      chatRef.push({
        text: trimmedMessage,
        timestamp: database.ServerValue.TIMESTAMP,
        sender: UID,
      });

      setMessage('');
    }
  };

  const navigateToCameraScreen = (navigation, UID, receiverUID) => {
    navigation.navigate('CameraScreen', {
      UID: UID,
      receiverUID: receiverUID,
    });
  };

  const handleProfileImagePress = () => {
    setShowIcons(false);
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

    navigation.navigate('ViewChatImage', {
      uri: selectedImageUri,
      UID: UID,
      receiverUID: receiverUID,
    });
  };

  const handleSelectDocument = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf], // Only pick PDF files
        // type: [DocumentPicker.types.pdf, DocumentPicker.types.pptx], //! for multifile (later)
        copyTo: 'cachesDirectory',
      });

      // Assuming single file selection, get the first result
      const pickedDocument = results[0];
      console.log('Selected document: ', pickedDocument);

      // Extracted URI
      const documentUri = pickedDocument.fileCopyUri;
      const documentName = pickedDocument.name;
      const documentSize = pickedDocument.size;
      console.log('Selected document URI: ', documentUri);
      navigation.navigate('UploadPdfScreen', {
        documentUri: documentUri,
        documentName: documentName,
        documentSize: documentSize,
        UID: UID,
        receiverUID: receiverUID,
      });

      // Now you can use documentUri for uploading
      // If your upload function supports content URIs, you can use it directly
      // Otherwise, you might need to convert it into a file path or use a blob
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.warn(err);
        Alert.alert('Error', 'Unable to select document. Please try again.');
      }
    }
  };

  const handleSelectVideo = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.video], // Only pick PDF files
        // type: [DocumentPicker.types.pdf, DocumentPicker.types.pptx], //! for multifile (later)
        copyTo: 'cachesDirectory',
      });

      // Assuming single file selection, get the first result
      const pickedVideo = results[0];
      console.log('Selected document: ', pickedVideo);

      // Extracted URI
      const videoUri = pickedVideo.fileCopyUri;
      const videoName = pickedVideo.name;
      const videoSize = pickedVideo.size;
      console.log('Selected document URI: ', videoUri);
      navigation.navigate('UploadVideoScreen', {
        videoUri: videoUri,
        videoName: videoName,
        videoSize: videoSize,
        UID: UID,
        receiverUID: receiverUID,
      });

      // Now you can use documentUri for uploading
      // If your upload function supports content URIs, you can use it directly
      // Otherwise, you might need to convert it into a file path or use a blob
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.warn(err);
        Alert.alert('Error', 'Unable to select document. Please try again.');
      }
    }
  };

  const handleSelectAudio = async () => {
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.audio], // Only pick PDF files
        // type: [DocumentPicker.types.pdf, DocumentPicker.types.pptx], //! for multifile (later)
        copyTo: 'cachesDirectory',
      });

      // Assuming single file selection, get the first result
      const pickedAudio = results[0];
      console.log('Selected document: ', pickedAudio);

      // Extracted URI
      const audioUri = pickedAudio.fileCopyUri;
      const audioName = pickedAudio.name;
      const audioSize = pickedAudio.size;

      console.log('Selected document URI: ', audioUri);
      navigation.navigate('UploadAudioScreen', {
        audioUri: audioUri,
        audioName: audioName,
        audioSize: audioSize,
        UID: UID,
        receiverUID: receiverUID,
      });

      // Now you can use documentUri for uploading
      // If your upload function supports content URIs, you can use it directly
      // Otherwise, you might need to convert it into a file path or use a blob
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the document picker');
      } else {
        console.warn(err);
        Alert.alert('Error', 'Unable to select document. Please try again.');
      }
    }
  };

  const openPDF = async filePath => {
    try {
      await FileViewer.open(filePath, {showOpenWithDialog: true}); // Show "Open with" dialog if multiple PDF reader apps are installed
    } catch (error) {
      console.error(error);
    }
  };

  //! This function first download the pdf then open interpolate. it does not save the document in the Directory.
  //! Use this function when you want to download pdf (each time) and open it.

  // const downloadAndOpenPDF = async remoteUrl => {
  //   const {dirs} = RNFetchBlob.fs;
  //   const localFilePath = `${dirs.CacheDir}/temp.pdf`;

  //   try {
  //     // Download the file to local storage
  //     const res = await RNFetchBlob.config({
  //       path: localFilePath,
  //     }).fetch('GET', remoteUrl);

  //     // Use the local file path to open the PDF
  //     await FileViewer.open(localFilePath, {showOpenWithDialog: true});
  //   } catch (error) {
  //     console.error('The file could not be downloaded or opened:', error);
  //   }
  // };

  useEffect(() => {
    const chatID = [UID, receiverUID].sort().join('_');
    const chatRef = database().ref(`conversations/${chatID}/messages`);

    chatRef.on('value', snapshot => {
      const messages = [];
      snapshot.forEach(childSnapshot => {
        messages.push({
          id: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setChatMessages(messages);
    });

    return () => {
      chatRef.off();
    };
  }, [UID, receiverUID]);

  // Function to toggle audio play/pause
  // const togglePlayPause = audioUrl => {
  //   // Initialize Sound instance if it hasn't been already
  //   if (!audio) {
  //     const soundInstance = new Sound(audioUrl, '', error => {
  //       if (error) {
  //         console.log('failed to load the sound', error);
  //         return;
  //       }
  //       // Play the sound if the file is loaded successfully
  //       soundInstance.play(() => {
  //         soundInstance.release(); // Release the audio player resource when the audio ends
  //       });
  //       setIsPlaying(true);
  //     });

  //     setAudio(soundInstance);
  //   } else {
  //     // Control play/pause if audio is already initialized
  //     if (isPlaying) {
  //       audio.pause();
  //       setIsPlaying(false);
  //     } else {
  //       audio.play();
  //       setIsPlaying(true);
  //     }
  //   }
  // };

  const togglePlayPause = audioUrl => {
    // If the tapped audio is different from the currently playing one, stop the current audio
    if (audio && currentAudioUrl !== audioUrl) {
      audio.stop(() => {
        audio.release();
        setAudio(null);
        setIsPlaying(false);
        // Start the new audio
        playAudio(audioUrl);
      });
    } else if (audio && isPlaying) {
      // If the same audio is tapped and is playing, pause it
      audio.pause();
      setIsPlaying(false);
    } else {
      // If audio is paused, play it again, or if it's the first time, play the audio
      if (!audio) {
        playAudio(audioUrl);
      } else {
        audio.play();
        setIsPlaying(true);
      }
    }
  };

  const playAudio = audioUrl => {
    const soundInstance = new Sound(audioUrl, '', error => {
      if (error) {
        console.log('Failed to load the sound', error);
        return;
      }
      // Play the sound if the file is loaded successfully
      soundInstance.play(() => {
        soundInstance.release(); // Release the audio player resource when the audio ends
        setAudio(null);
        setIsPlaying(false);
        setCurrentAudioUrl(null);
      });
      setAudio(soundInstance);
      setIsPlaying(true);
      setCurrentAudioUrl(audioUrl);
    });
  };

  // Remember to clean up the Sound instance when the component unmounts or the URL changes
  // useEffect(() => {
  //   return () => {
  //     if (audio) {
  //       audio.release();
  //     }
  //   };
  // }, [audio]);
  useEffect(() => {
    return () => {
      if (audio) {
        audio.release();
      }
    };
  }, [audio]);


  useEffect(() => {
    // If the count of selected messages is 0, disable the selection mode
    if (selectedMessages.length === 0) {
      setIsSelectionMode(false);
    }
    setShouldScrollToBottom(false);
  }, [selectedMessages]);

  useEffect(() => {
    const loadWallpaper = async () => {
      try {
        // Retrieve the wallpaper source from AsyncStorage
        const savedWallpaper = await AsyncStorage.getItem('wallpaper');

        if (savedWallpaper !== null) {
          const parsedWallpaper = JSON.parse(savedWallpaper);
          setLocalWallpaper({source: parsedWallpaper});

          // Update the global wallpaper state if it's different
          // from the saved wallpaper
          if (
            JSON.stringify(wallpaper?.source) !==
            JSON.stringify(parsedWallpaper)
          ) {
            setWallpaper({source: parsedWallpaper});
          }
        }
      } catch (error) {
        console.error("Couldn't load wallpaper", error);
      }
    };

    loadWallpaper();
  }, [wallpaper, setWallpaper]);

  return (
    <>
      <StatusBar
        barStyle={
          theme.containerBackground === '#000'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={theme.containerBackground}
      />

      <View
        style={[
          styles.container,
          {backgroundColor: theme.containerBackground},
        ]}>
        {/* Toolbar */}
        <View style={styles.toolbar}>
          {/* Back Button */}
          <Icon
            name="arrow-back"
            size={30}
            color="#7A7A7A"
            onPress={() => navigation.goBack()}
          />

          {/* Middle Section: Name & Online Status */}
          <View style={styles.middleSection}>
            <Text style={styles.name}>{username}</Text>
            {/* <Text style={styles.onlineStatus}>Online</Text> */}
          </View>

          {/* Right Section: Profile Image */}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('RecieverProfile', {
                user: username,
                userImage: userImage,
              });
            }}>
            <Image source={{uri: userImage}} style={styles.profileImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {wallpaper ? (
            // <ImageBackground source={wallpaper.source} style={styles.backgroundImage}>
            <ImageBackground
              source={localWallpaper?.source || wallpaper.source}
              style={styles.backgroundImage}>
              <ScrollView
                showsVerticalScrollIndicator={true}
                ref={scrollViewRef}
                onContentSizeChange={() => {
                  if (shouldScrollToBottom) {
                    scrollViewRef.current.scrollToEnd({animated: false});
                  }
                }}>
                {chatMessages.map(msg => (
                  <TouchableOpacity
                    key={msg.id}
                    activeOpacity={0.8}
                    style={[
                      msg.sender === UID
                        ? styles.senderMessageContainer
                        : styles.recipientMessageContainer,
                      selectedMessages.includes(msg.id)
                        ? styles.selectedMessage
                        : null,
                    ]}
                    onLongPress={() => handleActivateSelectionMode(msg.id)}
                    onPress={() => {
                      // Only handle tap selection if selection mode is active
                      if (isSelectionMode) {
                        handleToggleMessageSelection(msg.id);
                      }
                    }}>
                    {/* <Text
                      style={
                        msg.sender === UID
                          ? styles.senderMessage
                          : styles.recipientMessage
                      }>
                      {msg.text}
                    </Text> */}

                    {msg.imageUrl ? (
                      // If there's an imageUrl, render an image
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('ViewChatImage', {
                            url: msg.imageUrl,
                          })
                        }>
                        <Image
                          source={{uri: msg.imageUrl}}
                          style={{width: 200, height: 200}}
                        />
                      </TouchableOpacity>
                    ) : (
                      // Otherwise, render the text message
                      <Text
                        style={
                          msg.sender === UID
                            ? styles.senderMessageText
                            : styles.recipientMessageText
                        }>
                        {msg.text}
                      </Text>
                    )}

                    <Text style={styles.messageTime}>
                      {formatTime(msg.timestamp)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </ImageBackground>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={true}
              ref={scrollViewRef}
              onContentSizeChange={() => {
                if (shouldScrollToBottom) {
                  scrollViewRef.current.scrollToEnd({animated: false});
                }
              }}>
              {chatMessages.map(msg => (
                <TouchableOpacity
                  key={msg.id}
                  activeOpacity={0.8}
                  style={[
                    msg.sender === UID
                      ? styles.senderMessageContainer
                      : styles.recipientMessageContainer,
                    selectedMessages.includes(msg.id)
                      ? styles.selectedMessage
                      : null,
                  ]}
                  onLongPress={() => handleActivateSelectionMode(msg.id)}
                  onPress={() => {
                    // Only handle tap selection if selection mode is active
                    if (isSelectionMode) {
                      handleToggleMessageSelection(msg.id);
                    }
                  }}>
                  {msg.imageUrl ? (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ViewChatImage', {
                          url: msg.imageUrl,
                        })
                      }>
                      <Image
                        source={{uri: msg.imageUrl}}
                        style={styles.messageImage}
                      />
                    </TouchableOpacity>
                  ) : (
                    // Otherwise, render the text message
                    <Text
                      style={
                        msg.sender === UID
                          ? styles.senderMessage
                          : styles.recipientMessage
                      }>
                      {msg.text}
                    </Text>
                  )}
                  {msg.pdfUrl && (
                    <View>
                      <TouchableOpacity onPress={() => openPDF(msg.pdfPath)}>
                        {/* <TouchableOpacity onPress={() => downloadAndOpenPDF(msg.pdfUrl)}> */}
                        <View
                          style={{flexDirection: 'row', alignSelf: 'center'}}>
                          <MaterialCommunityIcons
                            name="file-pdf-box"
                            size={30}
                            color="#fff"
                          />
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{
                              maxWidth: '100%',
                              color: '#fff',
                              marginLeft: 6,
                            }}>
                            {msg.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            marginTop: 10,
                          }}>
                          <Text
                            style={{
                              color: '#fff',
                            }}>
                            {formatSize(msg.size)}
                          </Text>
                          <Text style={{marginHorizontal: 10, color: '#fff'}}>
                            •
                          </Text>
                          <Text
                            style={{
                              color: '#fff',
                            }}>
                            PDF
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {msg.audioUrl && (
                    <TouchableOpacity
                      onPress={() => togglePlayPause(msg.audioUrl)}
                      style={{alignSelf: 'center'}}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon name="volume-high" size={30} color="#fff" />
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={{
                            maxWidth: 200, // Set a fixed max width for text
                            color: '#fff',
                            marginLeft: 6,
                          }}>
                          {msg.name}
                        </Text>
                      </View>
                      <View
                        style={{
                          marginTop: 10,
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{color: '#fff'}}>
                          {formatSize(msg.size)}
                        </Text>
                        <Text style={{marginHorizontal: 10, color: '#fff'}}>
                          •
                        </Text>
                        <Text style={{color: '#fff'}}>AUDIO</Text>
                      </View>
                    </TouchableOpacity>
                  )}

                  <Text style={styles.messageTime}>
                    {formatTime(msg.timestamp)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
      <View
        style={[
          styles.inputContainer,
          {backgroundColor: theme.containerBackground},
        ]}>
        <View style={{padding: 5}}>
          <TouchableOpacity onPress={() => console.log('emoji')}>
            <Entypo name="emoji-happy" size={25} color="#fff" />
          </TouchableOpacity>
        </View>
        {showIcons && (
          <View style={styles.iconsContainer}>
            <TouchableOpacity onPress={performFirstTask} style={styles.icon}>
              <Entypo name="camera" size={25} color="#6A5BC2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleProfileImagePress}
              style={styles.icon}>
              <MaterialIcons name="image" size={25} color="#6A5BC2" />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSelectAudio} style={styles.icon}>
              <MaterialIcons name="audiotrack" size={25} color="#6A5BC2" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelectVideo}
              style={styles.icon}>
              <MaterialIcons
                name="video-library"
                size={25}
                color="#6A5BC2"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSelectDocument}
              style={styles.icon}>
              <MaterialIcons name="text-snippet" size={25} color="#6A5BC2" />
            </TouchableOpacity>
          </View>
        )}

        <View style={{padding: 5}}>
          <TouchableOpacity onPress={toggleIcons}>
            <Entypo name="attachment" size={25} color="#fff" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={text => setMessage(text)}
          placeholder="Type a message..."
          placeholderTextColor="#6A5BC2"
          multiline
        />

        <View style={{padding: 5}}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CameraScreen', {
                UID: UID,
                receiverUID: receiverUID,
              })
            }>
            <Entypo name="camera" size={25} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
          <Icon name="send" size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {isSelectionMode && (
        <View
          style={[
            styles.selectionToolbar,
            {backgroundColor: theme.containerBackground},
          ]}>
          <Text style={styles.selectionText}>
            {selectedMessages.length} selected
          </Text>
          <TouchableOpacity onPress={handleDeleteSelectedMessages}>
            <Icon
              style={styles.deleteButton}
              name="trash-outline"
              size={30}
              color="#f00"
            />
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default ChatDetailsScreen;
