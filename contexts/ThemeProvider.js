import React, {createContext, useState} from 'react';
import {View, Text} from 'react-native';
export const MyThemeContext = createContext();

export default function MyThemeProvider({children}) {
  const [theme, setTheme] = useState('light');

  return (
    <MyThemeContext.Provider
      value={{
        theme,
        setTheme,
      }}>
      {children}
    </MyThemeContext.Provider>
  );
}
