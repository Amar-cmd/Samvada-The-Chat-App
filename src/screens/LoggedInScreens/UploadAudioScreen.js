import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

// Function to convert document size
const formatSize = size => {
  if (size < 1024) return size + ' bytes';
  else if (size < 1024 * 1024) return (size / 1024).toFixed(2) + ' KB';
  else if (size < 1024 * 1024 * 1024)
    return (size / (1024 * 1024)).toFixed(2) + ' MB';
  return (size / (1024 * 1024 * 1024)).toFixed(2) + ' GB';
};

const formatTime = time => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

const UploadAudioScreen = ({route, navigation}) => {
  const {audioUri, audioName, audioSize, UID, receiverUID} = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [audioLength, setAudioLength] = useState(0);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadAudio = async () => {
    setLoading(true);
    try {
      const fileName = `audio_${new Date().getTime()}_${audioName}.mp3`;
      const fileRef = storage().ref(`${UID}/${receiverUID}/audio/${fileName}`);

      const task = fileRef.putFile(audioUri);

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
            sendAudioMessage(downloadURL);
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

  const sendAudioMessage = audioUrl => {
    const chatID = [UID, receiverUID].sort().join('_');
    const chatRef = database().ref(`conversations/${chatID}/messages`);

    chatRef.push({
      audioUrl: audioUrl,
      name: audioName,
      size: audioSize,
      timestamp: database.ServerValue.TIMESTAMP,
      sender: UID,
      pdfPath: audioUri,
    });
  };

  // Define all hooks and their dependent functions at the top level
  useEffect(() => {
    Sound.setCategory('Playback');
    let sound = new Sound(audioUri, Sound.MAIN_BUNDLE, error => {
      if (error) {
        console.warn('failed to load the sound', error);
        return;
      }
      setAudioLength(sound.getDuration());
    });
    setAudio(sound);

    // Cleanup function to release audio resource
    return () => sound.release();
  }, [audioUri]);

  const playPauseAudio = () => {
    if (audio) {
      if (isPlaying) {
        audio.pause(() => setIsPlaying(false));
      } else {
        audio.play(success => {
          if (success) {
            console.log('Successfully finished playing');
          } else {
            console.log('Playback failed due to audio decoding errors');
          }
          setIsPlaying(false);
          setCurrentPosition(0);
          audio.setCurrentTime(0);
        });
        setIsPlaying(true);
      }
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        audio.getCurrentTime(seconds => setCurrentPosition(seconds));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, audio]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6A5BC2" />
        <Text style={{color: '#fff', fontSize: 20, marginTop: 10}}>
          Uploading audio...
        </Text>
        <View style={styles.sliderContainer}>
          <Text style={styles.progressText}>{Math.round(uploadProgress)}%</Text>
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
      <Icon name="volume-high" size={70} color="#6A5BC2" />
      <Text style={styles.audioName}>{audioName}</Text>
      <Text style={styles.audioSize}>{formatSize(audioSize)}</Text>
      <View style={styles.sliderContainer}>
        <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={audioLength}
          value={currentPosition}
          onValueChange={value => setCurrentPosition(value)}
          onSlidingComplete={value => {
            audio.setCurrentTime(value);
            setCurrentPosition(value);
          }}
          minimumTrackTintColor="#6A5BC2"
          maximumTrackTintColor="#000000"
          thumbTintColor="#6A5BC2"
        />
        <Text style={styles.timeText}>{formatTime(audioLength)}</Text>
      </View>
      <View>
        <TouchableOpacity style={styles.playPause} onPress={playPauseAudio}>
          <Icon name={isPlaying ? 'pause' : 'play'} size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={uploadAudio}>
        <Icon name="send" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#2c2c2c',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioName: {
    color: '#fff',
    fontSize: 23,
    textAlign: 'center',
    marginBottom: 20, // Add margin for spacing
  },
  audioSize: {
    color: '#fff',
    fontSize: 16,
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
  timeText: {
    color: '#FFFFFF',
  },
  playPause: {
    backgroundColor: '#6A5BC2',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 50,
    marginTop: 20, // Add margin for spacing
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
});

export default UploadAudioScreen;
