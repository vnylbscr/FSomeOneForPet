import React, { useState, useEffect, useMemo, useContext } from 'react';
import Provider from './navigation/Provider';
import MyThemeProvider, { MyThemeContext } from './contexts/ThemeProvider';
import Toast from 'react-native-toast-message'
import { MenuProvider } from 'react-native-popup-menu';
const App = () => {
  return (
    <>
      <MenuProvider>
        <Provider></Provider>
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </MenuProvider>
      
    </>
  );
};

export default App;
