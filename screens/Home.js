import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  Alert,
  ToastAndroid,
  TouchableOpacity
} from 'react-native';
import {
  Avatar,
  Divider,
  Overlay
} from 'react-native-elements';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import messaging from '@react-native-firebase/messaging';
import { AuthContext } from '../contexts/AuthContext';
import firestore from '@react-native-firebase/firestore';
import SplashScreen from 'react-native-splash-screen';
import Icon from 'react-native-vector-icons/Feather';
const { width, height } = Dimensions.get('window');
import CalculatePostDate from '../components/CalculatePostDate';
import Share from 'react-native-share';
const BG_IMAGE = "https://i.pinimg.com/564x/78/28/cb/7828cba384536458998a822f82ca0fc7.jpg";
//  Home  //
export default function Home({ navigation }) {
  const { user: currentUser } = useContext(AuthContext);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(false);
  const [MyBottomSheetVisible, setMysetBottomSheetVisible] = useState(false);
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    // kullanıcının tokeni veritabanına kaydediliyor
    messaging()
      .getToken()
      .then(token => {
        return saveTokenToDatabase(token);
      });
    // gerçek zamanlı veriler dinleniyor
    const unsubscribe = firestore().collection('posts')
      .orderBy("createdAt", "desc")
      .onSnapshot(querySelector => {
        const posts = querySelector.docs.map(doc => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
        setPosts(posts);
      })
    SplashScreen.hide();
    return () => unsubscribe();
  }, []);
  const onShare = (title) => {
    try {
      Share.open({
        title: `${title} adlı ilanı paylaş!`,
        message: `F SomeOne'da For Pet'de ${title} ilan tam sana göre. Hemen göz at!`,
        url: 'https://mertgenc.ga'
      })
        .then((res) => console.log(res.message()))
        .catch(error => {
          console.log(error.message);
        })
    } catch (error) {
      Alert.alert('Gönderi paylaşılırken bir hata oluştu')
      console.log(error);
    }
  }
  async function saveTokenToDatabase(token) {
    const userId = currentUser.uid;
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        tokens: firestore.FieldValue.arrayUnion(token),
      });
  }
  /////////////////
  // değiştir
  const toggleOverlay = () => {
    setBottomSheetVisible(!bottomSheetVisible);
  }
  const toggleOverlayMyPost = () => {
    setMysetBottomSheetVisible(!MyBottomSheetVisible);
  }
  //////////////////////
  const renderItem = ({ item }) => {
    return (
      <>
        <View style={styles.postContainer}>
          <View style={styles.postOwnerInfo}>
            <Avatar source={{ uri: item.ownerAvatar ? item.ownerAvatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" }} size="medium" rounded
              onPress={() => {
                item.owner === currentUser.email ? navigation.navigate('Profil')
                  : navigation.navigate('ShowProfile', { user: item })
              }} />
            <Text style={styles.userOwnerName}>{item.ownerUsername}</Text>
            <Overlay isVisible={MyBottomSheetVisible} containerStyle={{ backgroundColor: 'transparent' }} onBackdropPress={toggleOverlayMyPost}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.buttonContainer}>
                  <Icon name='edit' size={20} color='#fff' />
                  <Text style={styles.modalText}>İlanı Düzenle</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                  <Text style={styles.modalText}>İlanı Sil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}
                  onPress={toggleOverlayMyPost}>
                  <Text style={styles.modalText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
            <Overlay isVisible={bottomSheetVisible} containerStyle={{ backgroundColor: 'transparent' }} onBackdropPress={toggleOverlay}>
              <View style={styles.modalContainer}>
                <TouchableOpacity style={styles.buttonContainer}>
                  <Icon name='message-square' size={20} color='#fff' />
                  <Text style={styles.modalText}>İlan Sahibine Mesaj Gönder</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}>
                  <Text style={styles.modalText}>İlanı Şikayet Et</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonContainer}
                  onPress={toggleOverlay}>
                  <Text style={styles.modalText}>İptal</Text>
                </TouchableOpacity>
              </View>
            </Overlay>
            <Menu>
              <MenuTrigger>
                <Icon name="more-vertical" size={38} color='black' />
              </MenuTrigger>
              <MenuOptions>
                <MenuOption>
                  <Text
                    style={{ color: 'black' }}
                    onPress={() => { }}
                  >İlanı Görüntüle</Text>
                </MenuOption>
                <MenuOption onSelect={() => {
                  item.ownerUid === currentUser.uid ? navigation.navigate('Profil')
                    : navigation.navigate('ShowProfile', { user: item })
                }}>
                  <Text style={{ color: 'black' }}>İlan Sahibini Görüntüle</Text>
                </MenuOption>
                <MenuOption onSelect={() => ToastAndroid.show('Favorilerine Eklendi', 2000)}>
                  <View style={{ flexDirection: 'row' }}>
                    <Icon name="star" size={20} color='black' />
                    <Text style={{ color: '#215', marginLeft: 10 }}>Favorilere Ekle</Text>
                  </View>
                </MenuOption>
              </MenuOptions>
            </Menu>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={{ uri: item.postImage ? item.postImage : "https://stugcearar.com/wp-content/uploads/2018/07/empty_baslik.png" }}
              style={{ width: width, height: 200, borderRadius: 10 }}
            >
            </Image>
          </View>
          <View style={styles.postText}>
            <Text style={styles.postTitle}>{item.postTitle}</Text>
            <Text style={styles.postSubtitle}>{item.postContent}</Text>
          </View>
          <View style={styles.footerList}>
            <Text style={styles.dateText}>Başlama Tarihi:</Text>
            <Text style={styles.date}>{item.dateStart.toDate().toLocaleDateString('tr-TR')}</Text>
            <Text style={styles.dateText}>Bitiş Tarihi:</Text>
            <Text style={styles.date}>{item.dateEnd.toDate().toLocaleDateString('tr-TR')}</Text>
            <Text>tarihleri için zamanlandı</Text>
          </View>
          <View>
            <Text style={styles.postTitle}>İlan Fiyatı : {item.postPrice} TL </Text>
          </View>

          <View style={styles.footer}>
            <Icon.Button name='send' size={30} color='black' backgroundColor='#fff'
              onPress={() => item.ownerUid === currentUser.uid ? toggleOverlayMyPost() : toggleOverlay()} />
            <Icon.Button name='share' size={30} color='black' backgroundColor='#fff' onPress={() => onShare(item && item.postTitle)} />
          </View>
          <View style={styles.postDateContainer}>
            <CalculatePostDate date={item.createdAt.toDate()} />
          </View>
          <Divider />
        </View>
      </>
    )
  }
  return (
    <>
      <Image
        source={{ uri: BG_IMAGE }}
        blurRadius={10}
        style={StyleSheet.absoluteFillObject}
      />
      <FlatList
        renderItem={renderItem}
        keyExtractor={item => item.id}
        data={posts}
      />
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center'
  },
  postContainer: {
    flex: 1,
    backgroundColor: '#fff',
    marginVertical: 1,
    borderRadius: StyleSheet.hairlineWidth,
  },
  postTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  postOwnerInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  userOwnerName: {
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    paddingLeft: 5,
    alignItems: 'center'
  },
  postSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Light',
    paddingHorizontal: 10
  },
  dateText: {
    fontSize: 15,
    fontFamily: 'Poppins-Regular',
    color: 'black',
    opacity: 0.7,
  },
  date: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'black'
  },
  postDateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  buttonContainer: {
    height: 40,
    width: 250,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgb(122,199,211)',
    marginVertical: 10,
    flexDirection: 'row'
  },
  modalContainer: {
    height: 300,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 25,
  },
  modalText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    textAlign: 'center',
    color: '#fff'
  }
})
