import { NavigationContainer } from '@react-navigation/native';
import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import AppRoutes from './AppRoutes';
import Routes from './Routes';
import auth from '@react-native-firebase/auth';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DrawerContent from '../screens/DrawerContent';

const Drawer = createDrawerNavigator();
export default function Router() {
  const [initializing, setInitializing] = useState(true);
  const { user, setUser } = useContext(AuthContext);

  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }
    
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (initializing) return null;

  return (
    <NavigationContainer>
      {
        user ?
          (
            // Anasayfaya -->
            <Drawer.Navigator drawerContent={(props) => <DrawerContent {...props} />}>
              <Drawer.Screen name='HomeDrawer' component={AppRoutes} />
            </Drawer.Navigator>
          )
            //Login Ekranına -->
          : <Routes />
      }
    </NavigationContainer>
  );
}
