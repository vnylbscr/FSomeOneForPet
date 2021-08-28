import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../contexts/AuthContext';
import {Avatar} from 'react-native-elements';
const messageRef = firestore().collection('message_threads');
const ChatRooms = ({navigation}) => {
  const {user: currentUser} = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [userAvatar, setUserAvatar] = useState();
  const [emptyArray, setEmptyArray] = useState(false);
  useEffect(() => {
    firestore()
      .collection('users')
      .doc(currentUser.uid)
      .get()
      .then(res => {
        setUserAvatar(res.data().userProfileImagePath);
      });
    const unsubscribe = messageRef
      .where('members', 'array-contains', [currentUser.uid])
      .onSnapshot(querySnapshot => {
        const rooms = querySnapshot.docs.map(documentSnapshot => {
          return {
            _id: documentSnapshot.id,
            latestMessage: documentSnapshot.data().latestMessage,
            sender: documentSnapshot.data().sender,
          };
        });
        if (rooms.length === 0) {
          setEmptyArray(true);
        }
        setRooms(rooms);
      });
    //  will unmount
    return () => {
      unsubscribe();
    };
  }, []);
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.container}
          onPress={() =>
            navigation.navigate('Message', {userUid: item.sender._id})
          }>
          <View style={{flexDirection: 'row'}}>
            <Avatar
              source={{uri: userAvatar && userAvatar}}
              rounded
              size='large'
            />
            <View style={{marginLeft: 50}}>
              <Text style={[styles.title]}>{item.latestMessage.user.name}</Text>
              <Text style={styles.subtitle}>
                <Text style={{color: 'black'}}>son mesaj: </Text>
                {item.latestMessage.text}
              </Text>
              <Text style={styles.subtitle}>{item.sender.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  };
  if (emptyArray) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{fontFamily: 'Poppins-Regular', fontSize: 18}}>
          Henüz mesajın yok.
        </Text>
      </View>
    );
  }
  return (
    <>
      <FlatList
        data={rooms}
        keyExtractor={item => item._id}
        renderItem={renderItem}
      />
    </>
  );
};
export default ChatRooms;

const styles = StyleSheet.create({
  container: {},
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 20,
    color: 'black',
  },
  subtitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: 'gray',
  },
  subContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
