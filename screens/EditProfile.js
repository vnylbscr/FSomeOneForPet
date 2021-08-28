import React, {useContext, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import {AuthContext} from '../contexts/AuthContext';
import PickPetModal from './PickPetModal';
import {Button, Avatar, ThemeProvider} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import BottomSheet from 'reanimated-bottom-sheet';
import Loading from '../components/Loading';

const theme = {
  Button: {
    titleStyle: {
      fontFamily: 'Poppins-Regular',
    },
  },
};
const EditProfile = () => {
  const {user} = useContext(AuthContext);
  const sheetRef = useRef(null);
  const [visibleModal, setVisibleModal] = useState(false);
  const [profileImg, setProfileImg] = useState(null);
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    email: '',
    username: '',
    userLocation: '',
    age: null,
    gender: '',
    job: '',
    userProfileImagePath: null,
    about: '',
    createdAt: null,
    phoneNumber: '',
  });
  const [availablePets, setAvailablePets] = useState([]);
  const [kullaniciResimYol, setKullaniciResimYol] = useState('');
  //component did mount get user from db
  useEffect(() => {
    getUser();
  }, []);
  // get current user from firestore
  const getUser = async () => {
    setLoading(true);
    try {
      await firestore()
        .collection('users')
        .doc(user.uid)
        .get()
        .then(doc => {
          setState({
            email: doc.data().email,
            username: doc.data().username,
            userLocation: doc.data().location,
            age: doc.data().age,
            gender: doc.data().gender,
            job: doc.data().job,
            userProfileImagePath: doc.data().userProfileImagePath,
            about: doc.data().about,
            phoneNumber: doc.data().phoneNumber,
            createdAt: new Date(
              doc.data().createdAt.seconds * 1000,
            ).toLocaleDateString(),
            ...doc.data(),
          });
        })
        .catch(error => console.log(error));
    } catch (error) {
      console.log('Hata:', error);
    }
    setLoading(false);
  };

  //bakılacak petleri döndüren dizi
  const getAvailablePets = () => {
    const eklenecekPetler = [];
    availablePets.forEach(
      item => item.checked === true && eklenecekPetler.push(item.title),
    );
    console.log(eklenecekPetler);
    return eklenecekPetler;
  };

  // Değişiklikleri kaydet.
  const saveChanges = async () => {
    const uri = await uploadImage();
    const reference = firestore().collection('users').doc(user.uid);
    //resim eklenmemiş ise
    if (uri === null) {
      reference
        .update({
          about: state.about,
          location: state.userLocation,
          username: state.username,
          availablePets: getAvailablePets(),
          job: state.job,
          phoneNumber: state.phoneNumber,
        })
        .then(res => {
          console.log(res);
          Alert.alert('Profil başarıyla güncellendi.');
        })
        .catch(err => {
          console.log('Profil güncellenirken bir hata oluştu', err);
          Alert.alert('Profil güncellenemedi.', `${err}`);
        });
    } else {
      reference
        .update({
          about: state.about,
          location: state.userLocation,
          username: state.username,
          availablePets: getAvailablePets(),
          job: state.job,
          phoneNumber: state.phoneNumber,
          userProfileImagePath: uri,
        })
        .then(res => {
          console.log(res);
          Alert.alert('Profil başarıyla güncellendi.');
        })
        .catch(err => {
          console.log('Profil güncellenirken bir hata oluştu', err);
          Alert.alert(`Profil güncellenemedi.${err}`);
        });
    }
  };
  ///////////// Kamera ile çek
  const takePhotoWithCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        includeBase64: false,
      },
      res => {
        const src = res.uri;
        console.log(src);
        setProfileImg(src);
        sheetRef.current.snapTo(2);
      },
    );
  };
  ///////////// Galeriden seç
  const chooseImageFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 300,
        maxHeight: 300,
        includeBase64: false,
      },
      res => {
        const src = res.uri;
        console.log('File name res :' + res.fileName);
        setProfileImg(src);
        sheetRef.current.snapTo(2);
      },
    );
  };
  const uploadImage = async () => {
    if (profileImg === null) return null;
    const uploadUri = profileImg;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1); //  resmin dosya yolundan dosya ismi alınıyor
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setKullaniciResimYol(url);
      console.log('kullanici resmi:', kullaniciResimYol);
      console.log('upload image url:' + url);
      Alert.alert('Resim başarıyla yüklendi!');
      setProfileImg(null);
      return url;
    } catch (error) {
      console.log('Fotoğrafı yüklerken bir hata!', error);
      Alert.alert('Fotoğraf yüklenemedi. Hata:' + error.code);
    }
  };
  //Bottom sheet render Item
  const bottomRenderItem = () => (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 16,
        height: 300,
      }}>
      <View style={{marginTop: 5}}>
        <Text
          style={{
            fontSize: 25,
            textAlign: 'center',
            color: 'black',
            fontFamily: 'Poppins-Regular',
          }}>
          Fotoğraf Yükle
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: 'center',
            color: 'gray',
            fontFamily: 'Poppins-Regular',
          }}>
          Ya da Galeriden Bir Fotoğraf Seç
        </Text>
      </View>

      <Button
        buttonStyle={{backgroundColor: 'tomato', borderRadius: 10}}
        title='Fotoğraf Çek'
        onPress={takePhotoWithCamera}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
      <Button
        buttonStyle={{
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
        title='Galeriden Seç'
        onPress={chooseImageFromLibrary}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
      <Button
        buttonStyle={{backgroundColor: 'tomato', borderRadius: 10}}
        title='İptal'
        onPress={() => sheetRef.current.snapTo(2)}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
    </View>
  );
  // bottom sheet render header
  const bottomRenderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  const displayModal = () => {
    setVisibleModal(!visibleModal);
  };
  // Yükleniyor
  if (state === undefined) {
    return <Loading size='large' color='tomato' />;
  }
  // Render
  return (
    <ThemeProvider>
      <ScrollView>
        <View style={styles.container}>
          <BottomSheet
            renderContent={bottomRenderItem}
            ref={sheetRef}
            snapPoints={[300, 200, 0]}
            borderRadius={20}
            renderHeader={bottomRenderHeader}
            initialSnap={2}
            enabledContentGestureInteraction={false}
          />
          <PickPetModal
            visible={visibleModal}
            sendValues={item => setAvailablePets(item)}
            onRequestClose={() => setVisibleModal(!visibleModal)}
          />
          <View style={styles.imageContainer}>
            <TouchableOpacity
              onPress={() => {
                sheetRef.current.snapTo(0);
              }}>
              <View style={{justifyContent: 'center', alignItems: 'center'}}>
                <Avatar
                  source={{
                    uri:
                      state.userProfileImagePath && state.userProfileImagePath,
                  }}
                  size='xlarge'
                  rounded>
                  <Ionicons
                    name='camera-outline'
                    size={20}
                    color='black'
                    style={{
                      top: -4,
                      right: -4,
                    }}
                  />
                </Avatar>
              </View>
            </TouchableOpacity>
            <Text style={styles.name}>
              {' '}
              {state ? state.username : 'Isim belirtilmedi'}{' '}
            </Text>
          </View>
          <View style={styles.action}>
            <Feather
              name='user'
              size={20}
              color='black'
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInput}
              placeholder='İsminiz'
              autoCorrect={false}
              value={state ? state.username : ''}
              onChangeText={text =>
                setState({
                  ...state,
                  username: text,
                })
              }
            />
          </View>
          <View style={styles.action}>
            <Feather
              name='mail'
              size={20}
              color='black'
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Mail Adresi'
              autoCorrect={false}
              value={state ? state.email : ''}
              onChangeText={text =>
                setState({
                  ...state,
                  email: text,
                })
              }
            />
          </View>
          <View style={styles.action}>
            <Feather
              name='phone'
              size={20}
              color='black'
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Telefon Numarası'
              autoCorrect={false}
              keyboardType='numeric'
              value={state ? state.phoneNumber : ''}
              onChangeText={text =>
                setState({
                  ...state,
                  phoneNumber: text,
                })
              }
            />
          </View>
          <View style={styles.action}>
            <Ionicons
              name='pencil-outline'
              size={20}
              color='black'
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Hakkında'
              autoCorrect={false}
              value={state ? state.about : ''}
              onChangeText={text =>
                setState({
                  ...state,
                  about: text,
                })
              }
            />
          </View>
          <View style={styles.action}>
            <Ionicons
              name='location-outline'
              size={20}
              color='black'
              style={styles.iconStyle}
            />
            <TextInput
              style={styles.textInput}
              placeholder='Konum'
              autoCorrect={false}
              value={state ? state.userLocation : ''}
              onChangeText={text =>
                setState({
                  ...state,
                  userLocation: text,
                })
              }
            />
          </View>
          <TouchableOpacity onPress={displayModal}>
            <View style={styles.action}>
              <Ionicons name='paw' size={20} color='black' />
              <Text style={{fontSize: 15, marginLeft: 10}}>
                Bakabileceğin Pet Boyutlarını Düzenle{' '}
              </Text>
            </View>
          </TouchableOpacity>
          <Button
            type='solid'
            title='Kaydet'
            onPress={() => saveChanges()}
            containerStyle={{
              marginTop: 30,
              marginHorizontal: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            buttonStyle={{
              backgroundColor: '#3498db',
              borderRadius: 25,
              width: 250,
            }}
          />
        </View>
      </ScrollView>
    </ThemeProvider>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  panel: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    paddingTop: 20,
  },
  header: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#333333',
    shadowOffset: {width: -1, height: -3},
    shadowRadius: 2,
    shadowOpacity: 0.7,
    elevation: 10,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: 'center',
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },

  action: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f2',
    paddingBottom: 5,
    marginLeft: 5,
  },
  textInput: {
    marginTop: -12,
    flex: 1,
    marginLeft: 10,
  },
  sheetBtn: {
    marginHorizontal: 30,
    margin: 10,
  },
});
