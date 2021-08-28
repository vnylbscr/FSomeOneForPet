import React, {useContext, useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import {Avatar, Divider} from 'react-native-elements';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import firestore from '@react-native-firebase/firestore';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../contexts/AuthContext';
const BG_IMAGE =
  'https://i.pinimg.com/originals/c8/c5/36/c8c5362f878f23cea126740c99a33dbb.jpg';
const DrawerContent = ({props, navigation}) => {
  const {user, signOut} = useContext(AuthContext);
  const [userdata, setUserData] = useState(null);
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    let reference = firestore().collection('users').doc(user.uid);
    try {
      const documentSnapshot = await reference.get();
      if (!documentSnapshot.exists) {
        console.log('Döküman bulunamadı');
        Alert.alert('Döküman bulunamadı! Tekrar Deneyin');
      } else {
        console.log(documentSnapshot.data());
        setUserData(documentSnapshot.data());
      }
    } catch (error) {
      console.log('Bilgileri alırken bir sorun oluştu', error);
    }
  };
  return (
    <>
      <Image
        source={{uri: BG_IMAGE}}
        style={StyleSheet.absoluteFill}
        blurRadius={30}
      />
      <View style={{flex: 1}}>
        <DrawerContentScrollView {...props}>
          <View style={styles.userInfo}>
            <Text style={styles.avatarText}>
              {userdata
                ? userdata.username + ' (' + userdata.age + ')'
                : 'Yaş belirtilmedi'}
            </Text>
          </View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{fontFamily: 'Poppins-BoldItalic', fontSize: 13}}>
              Host,Surfer
            </Text>
          </View>
          <View style={styles.DrawerSection}>
            <DrawerItem
              label='Anasayfa'
              icon={() => <Feather name='home' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('Home')}
            />
            <DrawerItem
              label='Profil'
              icon={() => <Feather name='user' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('Profil')}
            />
            <DrawerItem
              label='Mesajlar'
              icon={() => (
                <Feather name='message-square' size={20} color='black' />
              )}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('Mesajlar')}
            />
            <DrawerItem
              label='Ayarlar'
              icon={() => <Feather name='tool' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('Ayarlar')}
            />

            <DrawerItem
              label='İlanlarım'
              icon={() => <Feather name='bookmark' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('MyPosts')}
            />
            <Divider style={{backgroundColor: 'gray'}} />
            <DrawerItem
              label='Destek'
              icon={() => <Feather name='info' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => navigation.navigate('Destek')}
            />
            <DrawerItem
              label='Çıkış Yap'
              icon={() => <Feather name='log-out' size={20} color='black' />}
              labelStyle={styles.labelStyle}
              onPress={() => signOut()}
            />
          </View>
        </DrawerContentScrollView>
      </View>
    </>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  userInfo: {
    flexDirection: 'row',
    marginTop: 10,
    marginLeft: 10,
  },
  avatarText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    marginLeft: 10,
  },
  labelStyle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    paddingVertical: 5,
    marginLeft: 5,
  },
  DrawerSection: {
    marginTop: 5,
  },
});
