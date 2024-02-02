import React, {useContext, useState, useEffect} from 'react';
import {
  Text,
  View,
  Button,
  Alert,
  TouchableOpacity,
  ScrollView,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/LoggedInScreenStyles/HomeScreenStyle';
import firestore from '@react-native-firebase/firestore';
import database from '@react-native-firebase/database';
import ToastContext from '../../context/ToastContext';

const HomeScreen = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [showMenu, setShowMenu] = useState(false);
  const [userData, setUserData] = useState(null);
  const [recentChats, setRecentChats] = useState([]);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);

  const {showToast} = useContext(ToastContext);

  // const senderUID = auth().currentUser.uid;
  const senderUID = auth().currentUser ? auth().currentUser.uid : null;

  const handleUserSelect = userUID => {
    if (selectedUsers.includes(userUID)) {
      setSelectedUsers(prevSelectedUsers =>
        prevSelectedUsers.filter(uid => uid !== userUID),
      );
    } else {
      setSelectedUsers(prevSelectedUsers => [...prevSelectedUsers, userUID]);
    }
  };

  const handleDeleteSelected = () => {
    setLoading(true);
    // Prompt the user for confirmation using an Alert
    Alert.alert(
      'Delete Messages',
      `Are you sure you want to delete ${selectedUsers.length} messages?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // Delete each selected chat from the Realtime Database
            const conversationsRef = database().ref('conversations');

            for (let userUID of selectedUsers) {
              let chatId = `${senderUID}_${userUID}`;
              if (chatId > userUID) {
                chatId = `${userUID}_${senderUID}`;
              }

              // Delete the chat from the Realtime Database
              try {
                await conversationsRef.child(chatId).remove();
              } catch (error) {
                console.error(
                  `Failed to delete chat for UID ${userUID}:`,
                  error,
                );
              }
            }

            // Reset the selection state
            setIsSelectionMode(false);
            setSelectedUsers([]);
            setLoading(false);
          },
        },
      ],
    );
  };

  const handleLogout = async () => {
    setLoading(true);

    try {
      setIsLoggingOut(true);
      await auth().signOut();
      showToast('Successfully Logged Out.');
    } catch (error) {
      Alert.alert('Logout Error', error.message);
      setIsLoggingOut(false); // reset state if there's an error
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async uid => {
    setLoading(true);

    try {
      const userDocument = await firestore().collection('users').doc(uid).get();
      if (userDocument.exists) {
        setUserData(userDocument.data());
      } else {
        console.log('No user data found!');
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      fetchUserData(currentUser.uid);
    }
  }, []);

  const handleEditPress = () => {
    setShowMenu(false); // hide the profile menu
    navigation.navigate('Profile', {
      UID: senderUID,
      userImage: userData.userImage,
      name: userData.username,
      phoneNumber: userData.phoneNumber,
    });
  };

  useEffect(() => {
    if (!senderUID) return;

    // Fetch recent chats from Firebase Realtime Database
    const conversationsRef = database().ref('conversations');
    const handleDataChange = snapshot => {
      const conversationsData = snapshot.val();
      const recentChatUsers = [];

      // Iterate over the conversations data to find recent chats for the current user
      for (let chatId in conversationsData) {
        if (chatId.includes(senderUID)) {
          const ids = chatId.split('_');
          const otherUserId = ids[0] === senderUID ? ids[1] : ids[0];
          recentChatUsers.push(otherUserId);
        }
      }

      // Fetch user metadata for these UIDs from Firestore
      const fetchUserMetadata = async () => {
        const fetchedUsers = [];
        for (let uid of recentChatUsers) {
          const userDoc = await firestore().collection('users').doc(uid).get();
          if (userDoc.exists) {
            fetchedUsers.push(userDoc.data());
          }
        }
        setRecentChats(fetchedUsers);
      };
      console.log(recentChats);
      fetchUserMetadata();
    };

    conversationsRef.on('value', handleDataChange);

    return () => {
      conversationsRef.off('value', handleDataChange);
    };
  }, [senderUID]);

  useEffect(() => {
    if (isSelectionMode && selectedUsers.length === 0) {
      setIsSelectionMode(false);
    }
  }, [selectedUsers]);

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
      {/* {loading && <ActivityIndicator size={large} color='#4DB6AC'/>} */}
      <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
        <View
          style={[
            styles.container,
            {backgroundColor: theme.containerBackground},
          ]}>
          <View style={styles.toolbar}>
            <TouchableOpacity onPress={() => setShowMenu(true)}>
              <Icon name="menu" size={styles.icon.fontSize} color="#6A5BC2" />
            </TouchableOpacity>

            <Image
              source={theme.logo}
              style={styles.logo}
              resizeMode="contain"
            />

            <TouchableOpacity
              onPress={() => {
                navigation.navigate('AllContacts');
              }}>
              <Icon name="people" size={styles.icon.fontSize} color="#6A5BC2" />
            </TouchableOpacity>
          </View>

          <View style={[styles.content, {backgroundColor: theme.background}]}>
            {/* //* Pinned Messages */}
            <View></View>

            {/* //* All Messages */}
            {loading ? (
              <View style={{width:'100%', height:'100%', justifyContent:'center', alignItems:'center'}}>
                <ActivityIndicator size="large" color="#6A5BC2" />
                <Text style={color= theme.text}>Loading...</Text>
              </View>
            ) : (
              <View style={styles.allMessagesContainer}>
                <Text
                  style={[
                    styles.allMessagesHeader,
                    {backgroundColor: theme.containerBackground},
                  ]}>
                  All Messages
                </Text>

                {recentChats.map(user => (
                  <TouchableOpacity
                    key={user.UID}
                    style={
                      selectedUsers.includes(user.UID)
                        ? styles.selectedProfileContainer
                        : styles.profileContainer
                    }
                    onLongPress={() => {
                      if (!isSelectionMode) {
                        setIsSelectionMode(true);
                      }
                      handleUserSelect(user.UID);
                    }}
                    onPress={() => {
                      if (isSelectionMode) {
                        handleUserSelect(user.UID);
                      } else {
                        navigation.navigate('ChatDetails', {
                          UID: senderUID,
                          receiverUID: user.UID,
                          user: user.username,
                          userImage: user.userImage,
                        });
                      }
                    }}
                    activeOpacity={0.7}>
                    <Image
                      source={{uri: user.userImage}}
                      style={styles.profileImage}
                    />
                    <View style={styles.messageInfo}>
                      <Text style={styles.profileName}>
                        {senderUID === user.UID
                          ? `${user.username} (You)`
                          : user.username}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {showMenu && userData && (
        <TouchableOpacity
          style={styles.fullScreenTouchable}
          onPress={() => setShowMenu(false)}
          activeOpacity={1}>
          <View
            style={[styles.menuContainer, {backgroundColor: theme.background}]}
            onStartShouldSetResponder={() => true} // To prevent touch events from reaching the outer TouchableOpacity
          >
            <View style={styles.closeButtonContainer}>
              <TouchableOpacity onPress={handleLogout}>
                <Icon name="power" size={styles.icon.fontSize} color="red" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowMenu(false)}>
                <Icon
                  name="close"
                  size={styles.icon.fontSize}
                  color="#7A7A7A"
                />
              </TouchableOpacity>
            </View>
            {loading ? (<ActivityIndicator color='#6A5BC2' size='large'/>) : ( <Image
              source={{uri: userData.userImage}}
              style={styles.menuProfileImage}
            />)}
           
            <Text style={[styles.menuProfileName, {color: theme.text}]}>
              {userData.username}
            </Text>
            <Text style={[styles.menuProfilePhone, {color: theme.text}]}>
              {userData.phoneNumber}
            </Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={handleEditPress}>
              <Text style={styles.editText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      {isSelectionMode && (
        <View
          style={[
            styles.selectionToolbar,
            {backgroundColor: theme.containerBackground},
          ]}>
          <Text style={{color: '#6A5BC2', paddingLeft: 10}}>
            {selectedUsers.length} selected
          </Text>
          <TouchableOpacity
            onPress={() => {
              // handle delete action here
              setIsSelectionMode(false);
              setSelectedUsers([]);
            }}>
            <TouchableOpacity onPress={handleDeleteSelected}>
              <Icon
                name="trash-outline"
                size={styles.icon.fontSize}
                color="#900"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      )}
    </>
  );
};

export default HomeScreen;
