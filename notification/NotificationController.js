import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import PushNotification from 'react-native-push-notification';

const NotificationController = () => {

    const [token, setToken] = useState(null);
    const setTokenToDb = () => {
        messaging().getToken()
            .then(token => setToken(token))
            .catch(error => console.log(error))
    }
    //bildirim geldiğinde
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async (remoteMessage) => {
            PushNotification.localNotification({
                message: remoteMessage.notification.body,
                title: remoteMessage.notification.title,
                bigPictureUrl: remoteMessage.notification.android.imageUrl,
                smallIcon: remoteMessage.notification.android.imageUrl,
            });
        });
        setTokenToDb();
        return unsubscribe;
    }, []);
    return null;
};

export default NotificationController;