import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import {ThemeContext} from '../../context/ThemeContext';

import lightImage1 from '../../assets/light/1.jpg';
import lightImage2 from '../../assets/light/2.jpg';
import lightImage3 from '../../assets/light/3.jpg';
import lightImage4 from '../../assets/light/4.jpg';
import lightImage5 from '../../assets/light/5.jpg';
import lightImage6 from '../../assets/light/6.jpg';
import lightImage7 from '../../assets/light/7.jpg';
import darkImage1 from '../../assets/dark/1.jpg';
import darkImage2 from '../../assets/dark/2.jpg';
import darkImage3 from '../../assets/dark/3.jpg';
import darkImage4 from '../../assets/dark/4.jpg';
import darkImage5 from '../../assets/dark/5.jpg';
import darkImage6 from '../../assets/dark/6.jpg';
import darkImage7 from '../../assets/dark/7.jpg';
import darkImage8 from '../../assets/dark/8.jpg';
import darkImage9 from '../../assets/dark/9.jpg';

const screenWidth = Dimensions.get('window').width;

const lightWallpapers = [
  {id: '1', source: lightImage1, name: 'Light Image 1'},
  {id: '2', source: lightImage2, name: 'Light Image 2'},
  {id: '3', source: lightImage3, name: 'Light Image 3'},
  {id: '4', source: lightImage4, name: 'Light Image 4'},
  {id: '5', source: lightImage5, name: 'Light Image 5'},
  {id: '6', source: lightImage6, name: 'Light Image 6'},
  {id: '7', source: lightImage7, name: 'Light Image 7'},
];

const darkWallpapers = [
  {id: '1', source: darkImage1, name: 'Dark Image 1'},
  {id: '2', source: darkImage2, name: 'Dark Image 2'},
  {id: '3', source: darkImage3, name: 'Dark Image 3'},
  {id: '4', source: darkImage4, name: 'Dark Image 4'},
  {id: '5', source: darkImage5, name: 'Dark Image 5'},
  {id: '6', source: darkImage6, name: 'Dark Image 6'},
  {id: '7', source: darkImage7, name: 'Dark Image 7'},
  {id: '8', source: darkImage8, name: 'Dark Image 8'},
  {id: '9', source: darkImage9, name: 'Dark Image 9'},
];

const WallpaperViewer = ({route, navigation}) => {
  const themeType = route.params.themeType;
  const theme = useContext(ThemeContext);

  const [selectedImage, setSelectedImage] = useState(null);

 const handleImageSelect = image => {
   // Navigate to WallpaperPreviewScreen and pass the selected image data
   navigation.navigate('WallpaperPreview', {wallpaper: image});
 };


  const toolbarTitle = () => {
    return themeType;
  };

  const handleGoBack = () => {
    if (navigation && navigation.goBack) {
      navigation.goBack();
    }
  };

  const wallpapers = themeType === 'Light' ? lightWallpapers : darkWallpapers;

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
          {/* Back Button */}
          <TouchableOpacity onPress={handleGoBack}>
            <Icon name="arrow-back" size={30} color="#7A7A7A" />
          </TouchableOpacity>

          {/* Title */}
          <Text style={[styles.toolbarTitle, {color: theme.text}]}>
            {toolbarTitle()}
          </Text>

          {/* Placeholder for right alignment */}
          <View style={styles.toolbarPlaceholder} />
        </View>
        <View style={styles.gridContainer}>
          {wallpapers.map(image => (
            <TouchableOpacity
              key={image.id}
              onPress={() => handleImageSelect(image)}>
              <Image
                source={image.source}
                style={[
                  styles.gridImage,
                  {borderColor: theme.containerBackground},
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
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
  sectionTitle: {
    fontSize: 16,
    marginVertical: 10,
    marginLeft: 10,
    fontWeight: 'bold',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridImage: {
    width: screenWidth / 3,
    height: (screenWidth / 3) * 1.5, // 1.5 is the aspect ratio (height/width)
    borderWidth: 2,
  },
});

export default WallpaperViewer;
