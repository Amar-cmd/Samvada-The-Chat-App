import React, {useState, useCallback} from 'react';
import ToastContext from '../context/ToastContext';
import {View, Text} from 'react-native';
const ToastProvider = ({children}) => {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback(message => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000); // Hide after 3 seconds
  }, []);

  const hideToast = useCallback(() => {
    setToastMessage(null);
  }, []);

  return (
    <ToastContext.Provider value={{showToast, hideToast}}>
      {children}
      {toastMessage && (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toastMessage}</Text>
        </View>
      )}
    </ToastContext.Provider>
  );
};

const styles = {
  toast: {
    position: 'absolute',
    bottom: 50,
    alignSelf: 'center', // This will center the toast horizontally
    paddingVertical: 10,
    paddingHorizontal: 20, // Giving some horizontal padding
    backgroundColor: '#0E0E0E', // Slightly transparent black
        borderColor: '#fff',
    borderWidth:0.5,
    borderRadius: 25, // Rounded corners
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  toastText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
};


export default ToastProvider;
