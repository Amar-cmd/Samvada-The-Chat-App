import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {ThemeContext} from '../../context/ThemeContext';
import ToastContext from '../../context/ToastContext';
import styles from '../../styles/LoggedOutScreenStyles/RegisterScreenStyle';
import firestore from '@react-native-firebase/firestore';

const LoginScreen = ({navigation}) => {
  const theme = useContext(ThemeContext);
  const {showToast} = useContext(ToastContext);

  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  // Condition to check if the button should be disabled
  const isButtonDisabled = phoneNumber.length < 10;

  const handlePhoneNumberChange = text => {
    setPhoneNumber(text);
  };

  const handleLoginPress = async () => {
    setLoading(true);

    // Check if user exists in the Firestore
    const usersRef = firestore().collection('users');
    const userDocument = await usersRef
      .where('phoneNumber', '==', `${countryCode}${phoneNumber}`)
      .get();

    if (!userDocument.empty) {
      // If user exists
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          `${countryCode}${phoneNumber}`,
        );
        showToast('OTP Sent. Please Confirm.');
        navigation.navigate('LoginOTP', {
          confirmation: confirmation,
        });
      } catch (error) {
        Alert.alert('Error sending OTP', error.message);
      }
    } else {
      Alert.alert(
        'Please Register',
        'Your account does not exist. Please Register.',
        [
          {
            text: 'Cancel',
            onPress: () => {}, // Do nothing, just close the alert
            style: 'cancel',
          },
          {
            text: 'Register',
            onPress: handleRegisterNavigation,
          },
        ],
        {cancelable: false},
      );
    }

    setLoading(false);
  };
  const handleRegisterNavigation = () => {
    navigation.navigate('Register');
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{flex: 1}}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          <>
            <StatusBar
              barStyle={
                theme.containerBackground === '#000'
                  ? 'light-content'
                  : 'dark-content'
              }
              backgroundColor={theme.background}
            />
            <View
              style={[styles.container, {backgroundColor: theme.background}]}>
              <View style={styles.topSection}>
                <Image
                  source={theme.logo}
                  style={styles.image}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.inputSection}>
                <Text style={[styles.heading, {color: theme.text}]}>Login</Text>

                <View style={styles.phoneInputContainer}>
                  <Text style={[styles.countryCode, {color: theme.text}]}>
                    {countryCode}
                  </Text>
                  <TextInput
                    style={[styles.input, {color: theme.text}]}
                    placeholder="Enter Phone Number"
                    placeholderTextColor="#888"
                    keyboardType="phone-pad"
                    onChangeText={handlePhoneNumberChange}
                    value={phoneNumber}
                  />
                </View>
              </View>

              <View style={styles.bottomSection}>
                {loading ? (
                  <ActivityIndicator size="large" color="#6A5BC2" />
                ) : (
                  <>
                    <TouchableOpacity
                      style={[
                        styles.customButton,
                        {borderColor: theme.borderColor},
                        isButtonDisabled && {opacity: 0.3},
                      ]}
                      onPress={handleLoginPress}
                      disabled={isButtonDisabled}>
                      <Text
                        style={[styles.buttonText, {color: theme.buttonText}]}>
                        Continue
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.customButton,
                        {borderColor: theme.borderColor},
                      ]}
                      onPress={handleRegisterNavigation}>
                      <Text
                        style={[styles.buttonText, {color: theme.buttonText}]}>
                        New Member? Register Now
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          </>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
