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
    marginRight: 10,
    color: '#6A5BC2',
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
    backgroundColor: 'black', // Or any other background color
  },
  fullScreenImage: {
    width: '100%', // Full width
    height: '80%', // Adjust as needed
    resizeMode: 'contain',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#0004', // Choose a suitable color
    borderRadius: 5,
    position: 'absolute',
    top: 0,
    right:10,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
  },
});

export default styles;