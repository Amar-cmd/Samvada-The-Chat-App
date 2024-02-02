import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  StatusBar,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../context/ThemeContext';
import {WallpaperContext} from '../../context/WallpaperContext'
import ToastContext from '../../context/ToastContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const isAM = hours < 12;
  return `${hours % 12 === 0 ? 12 : hours % 12}:${minutes
    .toString()
    .padStart(2, '0')} ${isAM ? 'AM' : 'PM'}`;
};

const messages = [
  {id: 1, type: 'sent', text: 'Hello!'},
  {id: 2, type: 'received', text: 'Hi there!'},
  {id: 3, type: 'sent', text: 'How are you doing?'},
];

const WallpaperPreviewScreen = ({route, navigation}) => {
  const wallpaper = route.params?.wallpaper;
  const theme = useContext(ThemeContext);
  const {setWallpaper} = useContext(WallpaperContext);
  const {showToast} = useContext(ToastContext);

    
  const handleGoBack = () => {
    navigation.goBack();
  };

const handleSetWallpaper = async () => {
  // Set the wallpaper in the global state
  const newWallpaper = route.params?.wallpaper;
  setWallpaper(newWallpaper);

  try {
    // Save the wallpaper source to AsyncStorage
    await AsyncStorage.setItem(
      'wallpaper',
      JSON.stringify(newWallpaper.source),
    );

    showToast('Wallpaper set!');
    navigation.navigate('Home');
  } catch (error) {
    console.error("Couldn't save wallpaper", error);
    showToast('Failed to set wallpaper!');
  }
};
    
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
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <View
          style={[
            styles.toolbar,
            {backgroundColor: theme.containerBackground},
          ]}>
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="arrow-back" size={30} color="#7A7A7A" />
          </TouchableOpacity>
          <Text style={[styles.toolbarTitle, {color: theme.text}]}>
            Preview
          </Text>
          <View style={styles.toolbarPlaceholder} />
        </View>
        <ImageBackground
          source={wallpaper.source}
          style={styles.wallpaperImage}>
          <ScrollView contentContainerStyle={styles.chatContainer}>
            {messages.map(message => (
              <View
                key={message.id}
                style={[
                  styles.messageBox,
                  message.type === 'sent'
                    ? styles.sentMessage
                    : styles.receivedMessage,
                ]}>
                <Text
                  style={[
                    styles.messageText,
                    message.type === 'sent' ? {color: '#fff'} : {color: '#000'},
                  ]}>
                  {message.text}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    message.type === 'sent' ? {color: '#fff'} : {color: '#000'},
                  ]}>
                  {getCurrentTime()}
                </Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.setWallpaperContainer}>
            <TouchableOpacity
              style={styles.setWallpaperButton}
              onPress={handleSetWallpaper}>
              <Text style={styles.setWallpaperText}>Set Wallpaper</Text>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wallpaperImage: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0,0,0,0.8)',
  },
  toolbarTitle: {
    color: 'white',
    fontSize: 18,
  },
  toolbarPlaceholder: {
    width: 30,
  },
  chatContainer: {
    padding: 10,
  },
  messageBox: {
    maxWidth: '70%',
    marginBottom: 10,
    padding: 10,
    borderRadius: 8,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#6A5BC2',
    borderTopLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    borderColor: '#6A5BC2',
    borderWidth: 1,
    borderBottomLeftRadius: 20,
    borderTopRightRadius: 20,
      backgroundColor: '#E4DFFC',
    color:'#000'
  },
  messageText: {
    fontSize: 16,
    color: '#6A5BC2',
    
  },
  messageTime: {
    fontSize: 12,
    alignSelf: 'flex-end',
    marginTop: 5,
    color: '#666',
  },
  setWallpaperContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  setWallpaperButton: {
    borderColor: 'white',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  },
  setWallpaperText: {
    color: 'white',
    fontSize: 16,
  },
});

export default WallpaperPreviewScreen;
