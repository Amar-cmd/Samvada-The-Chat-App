import {StyleSheet} from 'react-native'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
  },
  toolbar: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#7A7A7A',
  },
  onlineStatus: {
    color: 'green',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  content: {
    flex: 1,
    // paddingHorizontal: 10,
    // paddingVertical: 10,
  },
  recipientMessageContainer: {
    alignSelf: 'flex-start',
    padding: 10,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 30,
    marginBottom: 10,
    maxWidth: '70%',
    minWidth: '25%',
    borderColor: '#6A5BC2',
    borderWidth: 1,
    marginHorizontal: 10,
    backgroundColor: '#E4DFFC',
  },
  senderMessageContainer: {
    alignSelf: 'flex-end',
    backgroundColor: '#6A5BC2',
    padding: 10,
    borderTopLeftRadius: 25,
    borderBottomRightRadius: 25,
    borderBottomLeftRadius: 10,
    marginBottom: 10,
    maxWidth: '70%',
    minWidth: '25%',

    marginHorizontal: 10,
  },
  recipientMessage: {
    color: '#000',
  },
  senderMessage: {
    color: 'white',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  textInput: {
    flex: 1,
    padding: 10,
    borderWidth: 0.5,
    borderColor: '#6A5BC2',
    borderRadius: 20,
    // marginRight: 10,
    color: '#fff',
    maxHeight: 150,
  },
  sendButton: {
    backgroundColor: '#6A5BC2',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageTime: {
    alignSelf: 'flex-end',
    fontSize: 12,
    color: '#000',
    marginTop: 5,
    opacity: 0.6,
    fontWeight: 'bold',
  },
  selectedMessage: {
    borderColor: '#FFFAF0',
    borderWidth: 2,
    backgroundColor: '#900',
  },
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#6A5BC2',
    backgroundColor: '#FFFFFF',
    color: '#6A5BC2',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6A5BC2',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButtonText: {
    marginRight: 5,
    color: '#FF0000',
  },
  backgroundImage: {
    flex: 1,
  },
  messageImage: {
    width: 200, // Or any size you prefer
    height: 200, // Or any size you prefer
    resizeMode: 'cover', // Adjust as needed
    borderRadius: 10, // Optional: for rounded corners
    marginVertical: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  fullScreenImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black', // This ensures that the background is visible
  },
  fullScreenImage: {
    width: 100, // This should fill the screen width
    height: 100, // This should fill the screen height
    resizeMode: 'contain', // This ensures the image fits within the screen bounds
  },

  closeButton: {
    position: 'absolute',
    top: 40, // Adjust as per the safe area insets or header height
    right: 20, // Keep it towards the top-right corner of the screen
    zIndex: 1, // Ensure it's above the image
    backgroundColor: 'rgba(0,0,0,0.6)', // Optional: make it slightly transparent
    padding: 8,
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 24,
    color: 'white',
  },
  iconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 5,
    backgroundColor: '#6A5BC2',
    position: 'absolute',
    bottom: 70,
    width: '100%',
    borderRadius: 20,
    paddingVertical: 20,
  },
  icon: {
    // Styles for the icon touchable opacity, if needed
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  image: {
    width: 200, // Set image size as needed
    height: 200,
    // marginTop: 20,
    // borderRadius: 100, // Round the corners if needed
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: 20,
    // marginBottom: 20, // Add margin for spacing
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
});

export default styles;