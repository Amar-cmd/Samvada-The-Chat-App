import React, {useContext, useState} from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../context/ThemeContext';
import lightImage from '../../assets/light/1.jpg';
import darkImage from '../../assets/dark/1.jpg';

const screenWidth = Dimensions.get('window').width;

const WallpaperScreen = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const [wallpaperOptionActive, setWallpaperOptionActive] = useState(false); // New state

const handleGoBack = () => {
  if (wallpaperOptionActive) {
    setWallpaperOptionActive(false);
    return; // Exit early if we're just hiding the wallpaper options
  }

  if (navigation && navigation.goBack) {
    navigation.goBack();
  }
};

  const handleActivateWallpaperOptions = () => {
    setWallpaperOptionActive(true);
  };

const handleSetThemeWallpaper = themeType => {
  navigation.navigate('WallpaperViewer', {themeType: themeType});
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
        {/* Toolbar */}
        <View
          style={[
            styles.toolbar,
            {backgroundColor: theme.containerBackground},
          ]}>
          {/* Back Button */}
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="arrow-back" size={30} color="#7A7A7A" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.toolbarTitle, {color: theme.text}]}>
            {theme.containerBackground === '#000'
              ? 'Dark Theme Wallpaper'
              : 'Light Theme Wallpaper'}
          </Text>

          {/* Placeholder for right alignment */}
          <View style={styles.toolbarPlaceholder} />
        </View>

        {/* Wallpaper */}
        {wallpaperOptionActive ? (
          <View style={styles.wallpaperOptionContainer}>
            <TouchableOpacity onPress={() => handleSetThemeWallpaper('Light')}>
              <Image source={lightImage} style={styles.themeButton} />
              <Text>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleSetThemeWallpaper('Dark')}>
              <Image source={darkImage} style={styles.themeButton} />
              <Text>Dark</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.topSection}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleActivateWallpaperOptions}>
              <Image
                source={theme.wallpaperImage}
                style={styles.wallpaperImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.changeButton}
              onPress={handleActivateWallpaperOptions}>
              <Text style={styles.changeButtonText}>Change</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    flexDirection: 'row',
    height: 60,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
  },
  toolbarTitle: {
    fontSize: 18,
  },
  toolbarPlaceholder: {
    width: 30,
  },
  wallpaperContainer: {},
  wallpaperImage: {
    width: 0.7 * screenWidth, // 80% of screen width
    height: 1.4 * screenWidth, // 80% of screen width
    borderColor: '#6A5BC2', // Border color
    borderWidth: 2, // Border width
    borderRadius: 10,
  },
  topSection: {
    alignItems: 'center', // Horizontally center the content
    marginTop: 30, // Some spacing from the top
  },
  changeButton: {
    marginTop: 10, // Spacing from the image
    padding: 10, // Padding for the button
    borderRadius: 5, // Optional: rounded corners
    borderColor: '#6A5BC2',
    borderWidth: 1,
  },
  changeButtonText: {
    color: '#6A5BC2',
  },
  wallpaperOptionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    flex: 1,
  },

  themeButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderColor: '#7A7A7A',
    borderWidth: 2,
  },
});

export default WallpaperScreen;
