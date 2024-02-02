import {StyleSheet, Dimensions} from 'react-native';


const {width, height} = Dimensions.get('window');

const isTablet = width / height > 0.6;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 20 : 10,
    backgroundColor: '#f5f5f5',
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
    paddingTop: isTablet ? '10%' : '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  profileImage: {
    width: isTablet ? 300 : 150,
    height: isTablet ? 300 : 150,
    borderRadius: isTablet ? 300 / 2 : 150 / 2,
    marginBottom: 20,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: isTablet ? 20 : 10,
    right: isTablet ? 10 : 0,
    backgroundColor: '#6A5BC2',
    padding: isTablet ? 20 : 10,
    borderRadius: isTablet ? 60 : 30,
  },
  profileName: {
    fontSize: isTablet ? 30 : 20,
    fontWeight: 'bold',
    color: '#6A5BC2',
  },
  phoneNumber: {
    color: '#6A5BC2',
    marginTop: 10,
    fontSize: isTablet ? 20 : 16,
  },
  editButton: {
    marginTop: 20,
    padding: isTablet ? 15 : 10,
    borderColor: '#6A5BC2',
    borderWidth: 1,
    width: isTablet ? '80%' : '90%',
  },

  editButtonText: {
    color: 'white',
    alignSelf: 'center',
    fontSize: isTablet ? 20 : 18,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  profileNameInput: {
    fontSize: isTablet ? 26 : 20,
    fontWeight: 'bold',
    color: '#6A5BC2',
    borderBottomWidth: 1,
    borderBottomColor: '#6A5BC2',
  },
  updateButtonText: {
    marginLeft: 10,
    color: '#6A5BC2',
    fontWeight: 'bold',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000, // Ensure the overlay is on top of everything else
  },
  loadingIndicator: {
    padding: isTablet ? 60 : 40,
    backgroundColor: '#6A5BC2',
    borderRadius: 20,
  },
  wallpaperView: {
    marginVertical: 20,
    borderTopWidth: 1,
    width: isTablet ? '80%' : '90%',
  },
  wallpaperButton: {
    marginTop: 20,
    alignSelf:'center',
    padding: isTablet ? 15 : 10,
    borderColor: '#6A5BC2',
    borderWidth: 1,
    width: isTablet ? '80%' : '100%',
  },
});

export default styles;
