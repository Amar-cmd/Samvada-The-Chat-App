import React, {useContext, useState} from 'react';
import {Text, View, TouchableOpacity, Image} from 'react-native';
import styles from '../../styles/LoggedInScreenStyles/RecieverProfileScreenStyle';
import {ThemeContext} from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const RecieverProfileScreen = ({route, navigation}) => {
  const username = route.params.user;
  const userImage = route.params.userImage;

  const theme = useContext(ThemeContext);

  const [isImageEnlarged, setIsImageEnlarged] = useState(false);

  return (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: theme.containerBackground},
        ]}>
        <View style={styles.toolbar}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#7A7A7A" />
          </TouchableOpacity>
          <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
          <View>
            <Icon name="menu" size={30} color="#0000" />
          </View>
        </View>

        {isImageEnlarged ? (
          <TouchableOpacity
            style={{flex: 1}}
            onPress={() => setIsImageEnlarged(false)}>
            <Image
              source={{uri: userImage}}
              style={{flex: 1, resizeMode: 'contain'}}
            />
          </TouchableOpacity>
        ) : (
          <View style={[styles.content, {backgroundColor: theme.background}]}>
            {/* Profile Image */}
            <View>
              <TouchableOpacity onPress={() => setIsImageEnlarged(true)}>
                <Image source={{uri: userImage}} style={styles.profileImage} />
              </TouchableOpacity>
            </View>

            <View style={styles.nameContainer}>
              <Text style={styles.profileName}>{username}</Text>
            </View>
          </View>
        )}
      </View>
    </>
  );
};

export default RecieverProfileScreen;
