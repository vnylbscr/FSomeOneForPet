import React, { useContext, useState, useEffect } from 'react'
import firestore from '@react-native-firebase/firestore';
import { GiftedChat } from 'react-native-gifted-chat';
import { AuthContext } from '../contexts/AuthContext';

const messageRef = firestore().collection('message_threads');
const Message = ({ route }) => {
    const { user: currentUser } = useContext(AuthContext);
    const { userUid, username } = route.params;
    const [messages, setMessages] = useState([]);
    const [currentUserInfo, setCurrentUserInfo] = useState();
    const user1 = currentUser.uid;
    const user2 = userUid;
    var roomName = 'chat_' + (user1 < user2 ? user1 + '_' + user2 : user2 + '_' + user1);
    useEffect(() => {
        //  şuanki kullanıcının bilgilerini al
        firestore().collection('users').doc(currentUser.uid).get()
            .then(res => {
                const data = {
                    uid: res.data().uid,
                    username: res.data().username,
                    avatar: res.data().userProfileImagePath
                }
                setCurrentUserInfo(data);
            });
        const unsubscribe = messageRef.doc(roomName).collection('messages')
            .orderBy('createdAt', 'desc')
            .onSnapshot(documentSnapshot => {
                const messages = documentSnapshot.docs.map(doc => {
                    const firebaseData = doc.data()
                    const data = {
                        _id: doc.id,
                        text: firebaseData.text,
                        createdAt: firebaseData.createdAt,
                        user: firebaseData.user
                    }
                    return data;
                })
                setMessages(messages);
            });
        return () => {
            unsubscribe();
        }
    }, [roomName]);
    const createChatRoom = async (currentText) => {

        await messageRef.doc(roomName).set({
            members: firestore.FieldValue.arrayUnion(user1, user2),
            createdAt: new Date().getTime(),
            latestMessage: {
                text: currentText,
                createdAt: new Date().getTime(),
                user: {
                    _id: currentUser.uid,
                    name: currentUserInfo.username
                },
            },
            sender: {
                _id: userUid,
                name: username
            }
        })
            .then(() => {
                console.log('oda başarıyla oluşturuldu!');
            })
    }
    // chat odasının var olup olmadığını kontrol et
    const checkRoomIsExists = async () => {
        const res = await messageRef.doc(roomName).get();
        if (res.exists) {
            return true;
        } else {
            return false;
        }
    }
    const handleSend = async (message = []) => {
        try {
            const currentText = message[0].text;
            const res = await checkRoomIsExists();
            console.log(res);
            // oda varsa
            if (res) {
                //  yeni mesajı belgeye ekle
                await messageRef.doc(roomName).collection('messages')
                    .add({
                        text: currentText,
                        createdAt: new Date().getTime(),
                        user: {
                            _id: currentUserInfo && currentUserInfo.uid,
                            name: currentUserInfo && currentUserInfo.username
                        },
                    });
                // odadaki son mesajı güncelle
                await messageRef.doc(roomName).update({
                    latestMessage: {
                        text: currentText,
                        createdAt: new Date().getTime(),
                        user: {
                            _id: currentUser.uid,
                            name: currentUserInfo && currentUserInfo.username
                        }
                    }
                })
            }
            // oda yoksa
            else {
                //   oda oluştur
                console.log('oda zaten oluşturuldu!');
                await createChatRoom(currentText);
                //  son mesajı ekle
                await messageRef.doc(roomName).collection('messages')
                    .add({
                        text: currentText,
                        createdAt: new Date().getTime(),
                        user: {
                            _id: currentUserInfo && currentUserInfo.uid,
                            name: currentUserInfo && currentUserInfo.username
                        },
                    });
                //  son mesajı güncelle
                await messageRef.doc(roomName).update({
                    latestMessage: {
                        text: currentText,
                        createdAt: new Date().getTime(),
                        user: {
                            _id: currentUser.uid,
                            name: currentUser.username
                        }
                    }
                })
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <GiftedChat
            messages={messages}
            onSend={(message) => handleSend(message)}
            user={{
                _id: currentUser.uid,
                name: currentUserInfo && currentUserInfo.username,
            }}
            placeholder='Bir şeyler yaz.'
            locale={'tr'}
            showAvatarForEveryMessage={true}
            showUserAvatar={true}
        />

    )
}
export default Message;

