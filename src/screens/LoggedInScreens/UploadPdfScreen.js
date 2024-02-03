import React, {useState} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Ionicons';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const UploadPdfScreen = ({route, navigation}) => {
  const {documentUri, documentName, documentSize, receiverUID, UID} =
    route.params;
  const [loading, setLoading] = useState(false);

  // Function to convert document size
  const formatSize = size => {
    if (size < 1024) return size + ' bytes';
    else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
    else if (size < 1024 * 1024 * 1024)
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
  };

  //   const uploadPdf = async () => {
  //     setLoading(true);
  //     try {
  //       const fileName = `pdf_${documentName}_${new Date().getTime()}.pdf`;
  //       const response = await storage()
  //         .ref(`${UID}/${receiverUID}/pdf/${fileName}`)
  //         .putFile(documentUri);
  //       //   console.log(response);
  //       // After uploading, fetch the URL of the pdf
  //         // const uploadedUrl = await response.getDownloadURL();
  //         console.log(response);
  //       setLoading(false);
  //       navigation.goBack();
  //     } catch (error) {
  //       setLoading(false);
  //       Alert.alert('Error sending photo:', error.message);
  //     }
  //   };

  const uploadPdf = async () => {
    setLoading(true);
    try {
      const fileName = `pdf_${new Date().getTime()}_${documentName}.pdf`;
      // Reference to where the file is to be stored in Firebase Storage
      const fileRef = storage().ref(`${UID}/${receiverUID}/pdf/${fileName}`);

      // Upload the file to Firebase Storage
      await fileRef.putFile(documentUri);

      // After uploading, fetch the URL of the pdf
      const uploadedUrl = await fileRef.getDownloadURL();
      console.log('Download URL:', uploadedUrl);
      sendPdfMessage(uploadedUrl);
      setLoading(false);
      Alert.alert('Upload Successful', 'PDF has been uploaded successfully.');

      // Optional: You might want to do something with the download URL
      // For example, save it in your Firebase Realtime Database or Firestore

      navigation.goBack();
    } catch (error) {
      setLoading(false);
      console.log(error);
      Alert.alert('Error sending photo:', error.message);
    }
  };

  const sendPdfMessage = pdfUrl => {
    const chatID = [UID, receiverUID].sort().join('_');
    const chatRef = database().ref(`conversations/${chatID}/messages`);

    chatRef.push({
      pdfUrl: pdfUrl,
      name: documentName,
      size: documentSize,
      timestamp: database.ServerValue.TIMESTAMP,
      sender: UID,
      pdfPath: documentUri,
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5BC2" />
        <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>
          Uploading PDF
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: '#2c2c2c',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <MaterialCommunityIcons name="file-pdf-box" size={70} color="#6A5BC2" />
      <Text style={{color: '#fff', fontSize: 23, textAlign: 'center'}}>
        {documentName}
      </Text>
      <Text style={{color: '#fff', fontSize: 16, marginTop: 20}}>
        {formatSize(documentSize)}
      </Text>
      <View
        style={{
          position: 'absolute',
          right: 20,
          bottom: 20,
          backgroundColor: '#6A5BC2',
          padding: 15,
          borderRadius: 50,
        }}>
        <TouchableOpacity onPress={uploadPdf}>
          <Icon name="send" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
export default UploadPdfScreen;
