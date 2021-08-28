import 'react-native-gesture-handler';
import * as React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Welcome from '../screens/Welcome';

const MainStack = createStackNavigator();

export default function Routes() {
  return (
    <MainStack.Navigator initialRouteName='Welcome'>
      <MainStack.Screen
        name='Login'
        options={{
          headerShown: false,
        }}
        component={Login}
      />
      <MainStack.Screen
        name='Register'
        options={{
          headerShown: false,
        }}
        component={Register}
      />
      <MainStack.Screen
        name='Welcome'
        options={{
          headerShown: false,
        }}
        component={Welcome}
      />
    </MainStack.Navigator>
  );
}
