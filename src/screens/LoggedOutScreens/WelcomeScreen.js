import React, {useContext} from 'react';
import {Text, View, Image, TouchableOpacity, StatusBar} from 'react-native';
import welcome_messages from '../../assets/welcome-messages.png';
import {ThemeContext} from '../../context/ThemeContext';
import styles from '../../styles/LoggedOutScreenStyles/WelcomeScreenStyle';

const WelcomeScreen = ({navigation}) => {
  const theme = useContext(ThemeContext);

  const handleContinuePress = () => {
    navigation.navigate('Login');
  };

  return (
    <>
      <StatusBar
        barStyle={
          theme.containerBackground === '#000'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={theme.background}
      />
      <View style={[styles.container, {backgroundColor: theme.background}]}>
        <Image source={theme.logo} style={styles.logo} resizeMode="contain" />
        <Image
          source={welcome_messages}
          style={styles.illustratorImage}
          resizeMode="contain"
        />
        <Text style={[styles.welcomeText, {color: theme.text}]}>Welcome</Text>
        <TouchableOpacity
          style={[styles.continueButton, {borderColor: theme.borderColor}]}
          onPress={handleContinuePress}>
          <Text style={[styles.continueText, {color: theme.buttonText}]}>
            Continue
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};


export default WelcomeScreen;
