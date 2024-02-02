import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const isTablet = width / height > 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 20,
  },
  topSection: {
    flex: 1.5,
    justifyContent: isTablet ? 'center' : 'flex-start',
    alignItems: 'center',
  },
  inputSection: {
    flex: 1.5,
    justifyContent: 'center',
    width: isTablet ? '70%' : '100%',
    alignSelf: 'center',
  },
  bottomSection: {
    flex: 1.5,
    justifyContent: 'flex-end',
    width: isTablet ? '70%' : '100%',
    alignSelf: 'center',
  },
  image: {
    width: isTablet ? '40%' : '60%',
    height: isTablet ? 200 : 150,
    marginBottom: 30,
    alignSelf: 'center',
  },
  heading: {
    color: '#6A5BC2',
    fontSize: isTablet ? 40 : 30,
    alignSelf: 'center',
    marginBottom: 30,
    fontStyle: 'italic',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  nameInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  countryCode: {
    flex: 1,
    fontSize: isTablet ? 20 : 16,
    marginRight: 10,
    padding: 10,
    color: '#000',
    borderWidth: 1,
    borderColor: '#6A5BC2',
    textAlign: 'center',
  },
  nameInitial: {
    flex: 1,
    fontSize: isTablet ? 20 : 16,
    marginRight: 10,
    padding: 10,
    color: '#fff',
    borderWidth: 1,
    borderColor: '#6A5BC2',
    textAlign: 'center',
  },
  input: {
    flex: 9,
    height: 45,
    paddingLeft: 10,
    fontSize: isTablet ? 20 : 16,
    borderWidth: 1,
    borderColor: '#6A5BC2',
    textTransform: 'capitalize',
  },
  customButton: {
    paddingVertical: isTablet ? 18 : 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6A5BC2',
    borderRadius: 5,
  },
  buttonText: {
    color: '#6A5BC2',
    fontSize: isTablet ? 24 : 18,
    fontWeight: 'bold',
  },
  memberText: {
    marginTop: 10,
    marginBottom: 5,
    textAlign: 'center',
    fontSize: isTablet ? 20 : 16,
  },
});

export default styles