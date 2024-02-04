import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import Video from 'react-native-video';

const ViewChatVideoScreen = ({route}) => {
  const {videoUrl} = route.params;

  const videoPlayer = useRef(null);
  const [paused, setPaused] = useState(false); // Start with video paused
  const [loading, setLoading] = useState(false); // Initialize loading as false

  const onLoadStart = () => {
    setLoading(true); // Set loading to true when video starts loading
  };

  const onLoad = () => {
    setLoading(false); // Set loading to false when video has loaded
  };

  const onBuffer = ({isBuffering}) => {
    setLoading(isBuffering); // Set loading based on buffering state
  };

  const onEnd = () => {
    setPaused(true); // Pause video on end
    videoPlayer.current?.seek(0); // Seek to start
  };

  const togglePlayPause = () => {
    setPaused(!paused); // Toggle play/pause state
  };

  // Setup back button handler and component unmount logic
  useEffect(() => {
    const backAction = () => {
      // Optionally perform actions before navigating back
      // This is where you can ensure video is stopped or any other cleanup
      return false; // Return false to execute the default back action
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => {
      backHandler.remove(); // Cleanup listener
      if (videoPlayer.current) {
        videoPlayer.current.pause(); // Pause the video
        videoPlayer.current.seek(0); // Seek to the start of the video
      }
    };

  }, []);
    
  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#6A5BC2"
          style={styles.loadingContainer}
        />
      )}
      <TouchableOpacity onPress={togglePlayPause} style={styles.videoTouchable}>
        <Video
          source={{uri: videoUrl}}
          ref={videoPlayer}
          onLoadStart={onLoadStart}
          onLoad={onLoad}
          onBuffer={onBuffer}
          onError={error => console.log('Video error:', error)}
          style={styles.backgroundVideo}
          paused={paused}
          resizeMode="contain"
          onEnd={onEnd}
          repeat={false}
          controls={true}
          muted={false}
        />
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
    width: '100%', // Use the screen width
    height: '100%', // Use the screen height for full-screen video
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  loadingContainer: {
    position: 'absolute',
    zIndex: 10, // Ensure loading indicator is visible above the video
  },
});

export default ViewChatVideoScreen;
