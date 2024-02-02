import React, {useState, useContext} from 'react';
import {
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
  ActivityIndicator,
} from 'react-native';
import {ThemeContext} from '../../context/ThemeContext';
import ToastContext from '../../context/ToastContext';
import firestore from '@react-native-firebase/firestore';
import styles from '../../styles/LoggedOutScreenStyles/VerificationScreenStyle';

const VerificationScreen = ({route, navigation}) => {
  const theme = useContext(ThemeContext);
  const {showToast} = useContext(ToastContext);
  // const {confirmation} = route.params;
  const {name, confirmation} = route.params;

console.log(name);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleOtpChange = text => {
    if (text.length <= 6) {
      setOtp(text);
    }
  };

  const handleConfirmPress = async () => {
    setLoading(true);

    try {
      const result = await confirmation.confirm(otp);
      if (result.user) {
        // OTP is correct and user is logged in
        showToast('Logged In Successfully. Welcome.');

        // Here, add user data to Firestore
        const userRef = firestore().collection('users').doc(result.user.uid);
        const doc = await userRef.get();

        if (!doc.exists) {
          await userRef.set({
            username: name,
            phoneNumber: result.user.phoneNumber,
            UID: result.user.uid,
            timestamp: firestore.FieldValue.serverTimestamp(),
            userImage:
              'https://icon-library.com/images/user-image-icon/user-image-icon-9.jpg',
          });
        }
      }
    } catch (error) {
      Alert.alert(
        'Invalid OTP',
        'The entered OTP is incorrect. Please try again.',
      );
    }
    setLoading(false);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.background}]}>
      <View style={styles.topSection}>
        <Image source={theme.logo} style={styles.image} resizeMode="contain" />
      </View>

      <View style={styles.inputSection}>
        <Text style={[styles.heading, {color: theme.text}]}>Confirmation</Text>
        <Text style={[styles.instruction, {color: theme.text}]}>
          Please Enter The OTP
        </Text>

        <View style={styles.otpBoxesContainer}>
          {Array(6)
            .fill('')
            .map((_, idx) => (
              <View
                key={idx}
                style={[styles.otpBox, otp[idx] && styles.otpBoxFilled]}>
                <Text style={styles.otpText}>{otp[idx]}</Text>
              </View>
            ))}
          <TextInput
            value={otp}
            onChangeText={handleOtpChange}
            style={styles.hiddenInput}
            keyboardType="numeric"
            maxLength={6}
            autoFocus
            caretHidden={true}
          />
        </View>
      </View>

      <View style={styles.bottomSection}>
        {loading ? (
          <ActivityIndicator size="large" color="#6A5BC2" />
        ) : (
          <TouchableOpacity
            style={[styles.confirmButton, otp.length !== 6 && {opacity: 0.3}]}
            onPress={handleConfirmPress}
            disabled={otp.length !== 6}>
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default VerificationScreen;
