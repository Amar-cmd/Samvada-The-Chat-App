import {StyleSheet, Dimensions} from 'react-native';

const { width, height } = Dimensions.get('window');

const isTablet = width / height > 0.6;
console.log(isTablet);
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: isTablet ? 40 : 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: isTablet ? '50%' : '60%',
    height: height * (isTablet ? 0.1 : 0.2),
    marginBottom: 20,
  },
  illustratorImage: {
    width: '100%',
    height: height * (isTablet ? 0.5 : 0.4),
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: isTablet ? 40 : 30,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#6A5BC2',
    fontStyle: 'italic',
  },
  continueButton: {
    paddingVertical: isTablet ? 16 : 12,
    paddingHorizontal: isTablet ? 24 : 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#6A5BC2',
    borderRadius: 5,
    marginTop: 20,
    width: isTablet ? '70%' : '100%',
  },
  continueText: {
    color: '#6A5BC2',
    fontSize: isTablet ? 24 : 18,
    fontWeight: 'bold',
  },
});

export default styles