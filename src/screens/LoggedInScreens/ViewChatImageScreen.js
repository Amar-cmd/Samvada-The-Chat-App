import React from 'react';
import {Text, View, Image, StyleSheet} from 'react-native';

const ViewChatImageScreen = ({route}) => {
  const {url} = route.params;
  console.log(url); // Log the received image URL

  return (
    <View style={styles.container}>
      <Image source={{uri: url}} style={styles.image} />
    </View>
  );
};

// Adding some basic styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Dark background for better visibility
  },
  image: {
    width: '100%', // Take up all available width
    height: '80%', // Use 80% of the screen height
    resizeMode: 'contain', // Ensure the aspect ratio is preserved
  },
});

export default ViewChatImageScreen;
