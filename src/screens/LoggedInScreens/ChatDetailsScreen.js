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
  Modal,
  Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import {ThemeContext} from '../../context/ThemeContext';
import database from '@react-native-firebase/database';
import styles from '../../styles/LoggedInScreenStyles/ChatDetailsScreenStyle';
import {WallpaperContext} from '../../context/WallpaperContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ChatDetailsScreen = ({navigation, route}) => {
  const theme = useContext(ThemeContext);
  const {wallpaper, setWallpaper} = useContext(WallpaperContext);
  const UID = route.params.UID;
  const receiverUID = route.params.receiverUID;
  const username = route.params.user;
  const userImage = route.params.userImage;

  console.log('==========================');
  console.log('sender UID = ', UID);
  console.log('receiver UID = ', receiverUID);

  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedMessages, setSelectedMessages] = useState([]);
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [localWallpaper, setLocalWallpaper] = useState(null);

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

  // Check for msg debug
  {
    chatMessages.map(msg => {
      console.log(msg.imageUrl);
    });
  }
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
          {/* <ScrollView
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
                <Text
                  style={
                    msg.sender === UID
                      ? styles.senderMessage
                      : styles.recipientMessage
                  }>
                  {msg.text}
                </Text>
                <Text style={styles.messageTime}>
                  {formatTime(msg.timestamp)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView> */}

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
                    // If there's an imageUrl, render an image
                    // <TouchableOpacity
                    //   onPress={() => setSelectedImageUri(msg.imageUrl)}>
                    //   <Image
                    //     source={{uri: msg.imageUrl}}
                    //     style={styles.messageImage}
                    //   />
                    // </TouchableOpacity>
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
        <View style={styles.emojiButton}>
          <TouchableOpacity onPress={() => console.log('emoji')}>
            <Entypo name="emoji-happy" size={30} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.emojiButton}>
          <TouchableOpacity onPress={() => console.log('add')}>
            <Entypo name="attachment" size={30} color="#fff" />
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

        <View style={styles.emojiButton}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('CameraScreen', {
                UID: UID,
                receiverUID: receiverUID,
              })
            }>
            <Entypo name="camera" size={30} color="#fff" />
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
