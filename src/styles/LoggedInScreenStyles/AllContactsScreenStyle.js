const {StyleSheet, Dimensions} = require('react-native');

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toolbar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    justifyContent: 'space-between',
  },

  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 18,
    color: '#7A7A7A',
  },
  searchButton: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    marginRight: 10,
  },
  highlighted: {
    color: '#6A5BC2', // Yellow color for the highlighted text
  },
  refreshButton: {
    marginLeft: 'auto',
    marginRight: 20,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  profileName: {
    fontSize: 16,
    color: '#7A7A7A',
  },
  border: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '80%',
    height: 0.5,
    opacity: 0.3,
    backgroundColor: '#7A7A7A',
  },
  initialsContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#7A7A7A',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  initialsText: {
    fontSize: 20,
    color: '#000',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageScrollView: {
    width: '100%',
    height: '100%',
  },
  imageScrollViewContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  enlargedImage: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'contain',
  },

  closeButton: {
    position: 'absolute',
    top: 50,
    right: 10,
    borderRadius: 10,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 20,
    color: '#6A5BC2',
    marginVertical: 10,
    marginLeft: 10,
    // fontWeight: 'bold',
  },
});

export default styles