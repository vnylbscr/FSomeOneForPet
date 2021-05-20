import React from 'react';
import AuthProvider from '../contexts/AuthContext';
import NotificationController from '../notification/NotificationController';
import Router from './Router';

//Sağlayıcı App'e aktarmak için gerekli bileşen
export default function Provider() {
  return (
    <AuthProvider>
      <NotificationController />
      <Router />
    </AuthProvider>
  );
}
