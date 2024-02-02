import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const isTablet = width / height > 0.6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: isTablet ? 40 : 20,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
    justifyContent: isTablet ? 'center' : 'flex-start',
    alignItems: 'center',
  },
  inputSection: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center', // This centers all child components horizontally.
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
  instruction: {
    color: '#6A5BC2',
    fontSize: isTablet ? 30 : 20,
    alignSelf: 'center',
    marginBottom: 30,
  },

  confirmButton: {
    paddingVertical: isTablet ? 18 : 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#6A5BC2',
  },
  confirmButtonText: {
    color: '#6A5BC2',
    fontSize: isTablet ? 24 : 18,
    fontWeight: 'bold',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  otpInput: {
    flex: 1,
    height: isTablet ? 60 : 50,
    lineHeight: isTablet ? 60 : 50,
    borderColor: '#6A5BC2',
    borderWidth: 1,
    textAlign: 'center',
    fontSize: isTablet ? 28 : 24,
    marginHorizontal: isTablet ? 10 : 5,
  },

  otpBoxesContainer: {
    flexDirection: 'row',
    position: 'relative',
  },
  otpBox: {
    width: isTablet ? 60 : 50,
    height: isTablet ? 60 : 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6A5BC2',
    marginHorizontal: isTablet ? 10 : 5,
  },
  otpBoxFilled: {
    backgroundColor: '#CAC3F1',
  },
  otpText: {
    fontSize: isTablet ? 26 : 20,
    color: '#000',
  },
  hiddenInput: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    opacity: 0,
  },
});

export default styles