import React, {createContext, useContext, useState} from 'react';

export const WallpaperContext = createContext();

export const WallpaperProvider = ({children}) => {
  const [wallpaper, setWallpaper] = useState(null);

  return (
    <WallpaperContext.Provider value={{wallpaper, setWallpaper}}>
      {children}
    </WallpaperContext.Provider>
  );
};
