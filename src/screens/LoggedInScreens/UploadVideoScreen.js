import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
    Alert,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

const {width, height} = Dimensions.get('window');

// Function to convert document size
const formatSize = size => {
  if (size < 1024) return size + ' bytes';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  else if (size < 1024 * 1024 * 1024)
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const UploadVideoScreen = ({route, navigation}) => {
  const {videoUri, videoName, videoSize, UID, receiverUID} = route.params;
  console.log(videoUri);
  const [paused, setPaused] = useState(true);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const videoPlayer = useRef(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videoLength, setVideoLength] = useState(0);

  const onProgress = data => {
    setCurrentTime(data.currentTime);
  };

  const onLoad = data => {
    setDuration(data.duration);
  };

  const onEnd = () => {
    setPaused(true);
    setCurrentTime(0);
    videoPlayer.current?.seek(0);
  };

  const onSeek = value => {
    videoPlayer.current?.seek(value);
    setCurrentTime(value);
    if (paused) {
      setPaused(false);
    }
  };

  const togglePlayPause = () => {
    setPaused(!paused);
  };

    const uploadVideo = async () => {
      setLoading(true);
      try {
        const fileName = `video_${new Date().getTime()}_${videoName}.mp4`;
        const fileRef = storage().ref(
          `${UID}/${receiverUID}/video/${fileName}`,
        );

        const task = fileRef.putFile(videoUri);

        // Listen for state changes, errors, and completion of the upload.
        task.on(
          'state_changed',
          snapshot => {
            // Calculate and update upload progress
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          error => {
            // Handle unsuccessful uploads
            setLoading(false);
            Alert.alert('Upload failed', error.message);
          },
          () => {
            // Handle successful uploads on complete
            // For instance, get the download URL
            task.snapshot.ref.getDownloadURL().then(downloadURL => {
              console.log('Download URL:', downloadURL);
              sendVideoMessage(downloadURL);
              setLoading(false);
              setUploadProgress(0); // Reset upload progress
              Alert.alert(
                'Upload Successful',
                'Audio has been uploaded successfully.',
              );
              navigation.goBack();
            });
          },
        );
      } catch (error) {
        setLoading(false);
        Alert.alert('Error sending audio:', error.message);
      }
    };

    const sendVideoMessage = videoUrl => {
      const chatID = [UID, receiverUID].sort().join('_');
      const chatRef = database().ref(`conversations/${chatID}/messages`);

      chatRef.push({
        videoUrl: videoUrl,
        name: videoName,
        size: videoSize,
        timestamp: database.ServerValue.TIMESTAMP,
        sender: UID,
        videoPath: videoUri,
      });
    };

    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6A5BC2" />
          <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>
            Uploading audio...
          </Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.progressText}>
              {Math.round(uploadProgress)}%
            </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={100}
              value={uploadProgress}
              minimumTrackTintColor="#6A5BC2"
              maximumTrackTintColor="#aaa"
              thumbTintColor="#6A5BC2"
              disabled={true}
            />
          </View>
        </View>
      );
    }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={togglePlayPause} style={styles.videoTouchable}>
        <Video
          source={{
            uri: videoUri,
          }}
          ref={videoPlayer}
          onBuffer={this.onBuffer}
          onError={this.videoError}
          style={styles.backgroundVideo}
          paused={paused}
          resizeMode="contain"
          onLoad={onLoad}
          onProgress={onProgress}
          onEnd={onEnd}
          repeat={false}
        />
      </TouchableOpacity>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={duration}
        value={currentTime}
        onValueChange={onSeek}
        minimumTrackTintColor="#FFFFFF"
        maximumTrackTintColor="rgba(255, 255, 255, 0.5)"
        thumbTintColor="#FFFFFF"
      />
      <Text style={styles.videoText}>{videoName}</Text>
      <Text style={styles.videoText}>{formatSize(videoSize)}</Text>
      <TouchableOpacity style={styles.sendButton} onPress={uploadVideo}>
        <Icon name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  videoTouchable: {
    width: width, // Use the screen width
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundVideo: {
    width: width - 20, // Same as screen width but with some padding
    height: height - 200, // Fixed height, you can adjust it
  },
  slider: {
    width: width - 40, // Slider width
    // marginTop: 20, // Space between video and slider
  },
  videoText: {
    color: '#FFF',
    marginTop: 10,
  },
  sendButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#6A5BC2',
    padding: 15,
    borderRadius: 50,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  progressText: {
    color: '#fff',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20, // Add margin for spacing
    width: '80%',
  },
  slider: {
    flex: 1, // Take up all available space in the container
    marginLeft: 10, // Add some space before the slider
    marginRight: 10, // Add some space after the slider
  },
});

export default UploadVideoScreen;
