import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const isTablet = width / height > 0.6;

const profileContainer = {
  flexDirection: 'row',
  alignItems: 'center',
  padding: 10,
  borderRadius: 10,
  marginBottom: 10,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 20 : 10,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: isTablet ? 20 : 10,
    alignItems: 'center',
  },
  logo: {
    width: isTablet ? '20%' : '30%',
    height: isTablet ? 80 : 50,
  },
  icon: {
    fontSize: isTablet ? 50 : 30,
  },
  content: {
    width: '100%',
    height: '100%',
    marginTop: 30,
    borderTopLeftRadius: isTablet ? 100 : 80,
    borderTopRightRadius: isTablet ? 100 : 80,
  },
  allMessagesContainer: {
    padding: isTablet ? 20 : 10,
    marginTop: 20,
    alignItems: 'center',
  },
  allMessagesHeader: {
    fontSize: isTablet ? 20 : 16,
    marginBottom: 20,
    color: '#6A5BC2',
    paddingVertical: isTablet ? 15 : 10,
    paddingHorizontal: isTablet ? 30 : 20,
    borderRadius: 30,
  },
  profileContainer,

  profileImage: {
    width: isTablet ? 70 : 50,
    height: isTablet ? 70 : 50,
    borderRadius: isTablet ? 35 : 25,
    marginRight: isTablet ? 20 : 10,
  },
  messageInfo: {
    flex: 3,
  },
  profileName: {
    fontWeight: 'bold',
    fontSize: isTablet ? 20 : 16,
    color: '#7A7A7A',
  },
  recentMessage: {
    color: '#7A7A7A',
  },
  timeAndTick: {
    flex: 1,
    alignItems: 'flex-end',
  },
  time: {
    color: '#7A7A7A',
  },
  menuProfileImage: {
    width: isTablet ? 300 : 100,
    height: isTablet ? 300 : 100,
    borderRadius: isTablet ? 150 : 50,
    marginBottom: 20,
  },
  menuProfileName: {
    fontSize: isTablet ? 40 : 24,
    marginBottom: 10,
    color: '#000',
  },
  menuProfilePhone: {
    fontSize: isTablet ? 30 : 18,
    marginBottom: 20,
    color: '#000',
  },
  editButton: {
    width: isTablet ? '70%' : '40%',
    padding: isTablet ? 25 : 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#6A5BC2',
    marginTop: isTablet ? 25 : 10,
  },
  editText: {
    fontSize: isTablet ? 25 : 14,
    textAlign: 'center',
    color: '#6A5BC2',
  },

  fullScreenTouchable: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#0006',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  menuContainer: {
    width: '100%', // or any desired width
    borderTopLeftRadius: isTablet ? 70 : 50,
    alignItems: 'center',
    padding: isTablet ? 30 : 20,
    minHeight: '60%',
  },
  closeButtonContainer: {
    flexDirection: 'row',
    // alignSelf: 'flex-end',
    width: '100%',
    justifyContent: 'space-between',
  },
  selectionToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isTablet ? 15 : 10,
    borderBottomWidth: 1,
    // borderBottomColor: '#eee',
    backgroundColor: '#f5f5f5',
  },
  selectedProfileContainer: {
    ...profileContainer,
    backgroundColor: '#6A5BC2',
  },
});

export default styles;