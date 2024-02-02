import React, {createContext, useState, useEffect} from 'react';
import {Appearance} from 'react-native';
import lightLogo from '../assets/samvada-logo-black.png';
import darkLogo from '../assets/samvada-logo-white.png';
import wallpaperTemplateBlack from '../assets/wallpaper-template-black.png';
import wallpaperTemplateWhite from '../assets/wallpaper-template-white.png';

export const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const deviceTheme = Appearance.getColorScheme();
  const [theme, setTheme] = useState(
    deviceTheme === 'dark' ? darkTheme : lightTheme,
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({colorScheme}) => {
      setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
    });

    return () => subscription.remove();
  }, []);

  return (
    <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
  );
};

const lightTheme = {
  containerBackground: '#ffffff',
  background: '#F7F7F7',
  text: '#000',
  buttonBackground: '#6A5BC2',
  borderColor: '#6A5BC2',
  buttonText: '#6A5BC2',
  logo: lightLogo,
  wallpaperImage: wallpaperTemplateWhite,
};

const darkTheme = {
  // containerBackground: '#0E0E0E',
  containerBackground: '#000',
  background: '#191919',
  text: '#fff',
  buttonBackground: '#fff',
  borderColor: '#6A5BC2',
  buttonText: '#6A5BC2',
  logo: darkLogo,
  wallpaperImage: wallpaperTemplateBlack,
};
