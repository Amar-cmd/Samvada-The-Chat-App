import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 10,
    backgroundColor: '#f5f5f5',
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: '30%',
    height: 50,
  },
  content: {
    width: '100%',
    height: '100%',
    marginTop: 30,
    paddingTop: '20%',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderTopLeftRadius: 80,
    borderTopRightRadius: 80,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    marginBottom: 20,
  },
  profileName: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6A5BC2',
  },
  phoneNumber: {
    color: '#6A5BC2',
    marginTop: 10,
  },
  editButton: {
    marginTop: 20,
    padding: 10,
    borderColor: '#6A5BC2',
    borderWidth: 1,
    width: '90%',
  },
  editButtonText: {
    color: 'white',
    alignSelf: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  profileNameInput: {
    fontSize: 20,
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
  loadingIndicator: {padding: 40, backgroundColor: '#6A5BC2', borderRadius: 20},
});

export default styles;
