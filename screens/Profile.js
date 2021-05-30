import React, { useContext, useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  Avatar,
  Text,
  Badge,
  ThemeProvider,
  Overlay,
  ListItem
} from 'react-native-elements';
import { AuthContext } from '../contexts/AuthContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import Share from 'react-native-share';
import CalculatePostDate from '../components/CalculatePostDate';

// Mert Genç b161210045
// Sakarya University
const theme = {
  Text: {
    h3Style: {
      fontFamily: 'Poppins-Regular'
    },
    h4Style: {
      fontFamily: 'Poppins-Regular'
    },
    style: {
      fontFamily: 'Poppins-Regular'
    }
  },
}
export default function Profile({ navigation }) {
  const { user } = useContext(AuthContext);
  const [loadingInfo, setLoadingInfo] = useState(true);
  const [userDataFromDb, setUserDataFromDb] = useState(null);
  const [showCommentsVisible, setShowCommentsVisible] = useState(false);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    setLoadingInfo(true);
    let reference = firestore().collection('users').doc(user.uid);
    let isCancelled = false;
    if (!isCancelled) {
      try {
        let comments = [];
        reference.get()
          .then(doc => {
            setUserDataFromDb(doc.data());
            comments = doc.data().comments;
            setComments(comments);
          })
          .catch(error => console.log(error))
      } catch (error) {
        console.log('Bilgileri alırken bir sorun oluştu', error);
        Alert.alert('Bilgileri alırken bir sorun oluştu');
      }
      setLoadingInfo(false);
    }

    return () => {
      isCancelled = true;
    }

  }, [userDataFromDb]);

  // profili paylaş
  const onShare = async () => {
    try {
      Share.open({
        title: 'F SomeOne For Pet profilini paylaş',
        message: "F SomeOne For Pet'e Katıldım.İşte benim profilim!",
        url: 'https://mertgenc.ga',
        email: user.email,
      })
        .then(res => {
          Alert.alert('Profilini başarıyla paylaştın!');
        })
        .catch(err => console.log(err))
    } catch (error) {
      Alert.alert(`${error.message}`);
    }
  }
  // değerlendirme modal göster
  const showCommentsModal = () => {
    return (
      <Overlay onBackdropPress={() => setShowCommentsVisible(!showCommentsVisible)}
        overlayStyle={styles.showCommentsModalContainer} isVisible={showCommentsVisible}>
        <ScrollView>
          <Text style={styles.modalText}>Değerlendirmelerin</Text>
          {comments && comments.length > 0 && comments.slice(0).reverse().map((item, id) => {
            return (
              <ListItem bottomDivider key={id}>
                <Avatar size='medium' source={{ uri: item.writerAvatar }} rounded />
                <ListItem.Content>
                  <ListItem.Title>{item.writer}</ListItem.Title>
                  <ListItem.Subtitle>{item.content}</ListItem.Subtitle>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <CalculatePostDate date={item.createdAt.toDate()} />
                  </View>
                </ListItem.Content>
              </ListItem>
            )
          })}
        </ScrollView>
      </Overlay>
    )
  }
  if (loadingInfo) {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="tomato" />
      </View>
    );
  }
  return (
    <ThemeProvider theme={theme}>
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.userInfo}>
            <View style={{ flexDirection: 'row', marginTop: 10 }}>
              <Avatar
                rounded
                source={{
                  uri: userDataFromDb && userDataFromDb.userProfileImagePath
                }}
                size={100}
                activeOpacity={0.6}>
                <Badge
                  status="success"
                  containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                  value="Müsait"
                  textStyle={{ fontFamily: 'Poppins-Regular' }}
                />
              </Avatar>

              <View style={{ marginLeft: 20 }}>
                <Text h3 h3Style={{ fontSize: 20, fontFamily: 'Poppins-Regular' }}>
                  {userDataFromDb && userDataFromDb.username ? userDataFromDb.username : 'İsim belirtilmedi'} ({userDataFromDb ? userDataFromDb.age : 'Yaş Belirtilmedi'})
              </Text>
                <Text h4Style={styles.caption} h4>
                  Host,Surfer
                  </Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={styles.textAbout}>{userDataFromDb && userDataFromDb.about ? userDataFromDb.about : 'Hakkinda Belirtilmedi'}</Text>
                </View>
                <View>
                  <Text style={styles.textAbout}>Katılma tarihi:{userDataFromDb && userDataFromDb.createdAt.toDate().toLocaleDateString('tr')}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 2, marginLeft: 10, marginBottom: 10 }}>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={20} color="#798777" />
                <Text
                  h4
                  h4Style={{ fontWeight: '400', fontSize: 10, color: '#798777' }}>
                  {' '}
                  {userDataFromDb && userDataFromDb.location ? userDataFromDb.location : 'Konum belirtilmedi'}
                </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="male-outline" size={20} color="#798777" />
                <Text
                  h4
                  h4Style={{ fontWeight: '400', fontSize: 10, color: '#798777' }}>
                  {' '}
                  {userDataFromDb && userDataFromDb.gender ? userDataFromDb.gender : 'Cinsiyet belirtilmedi'}
                </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="location-outline" size={20} color="#798777" />
                <Text
                  h4
                  h4Style={{ fontWeight: '400', fontSize: 10, color: '#798777' }}>
                  {' '}
              1 Pet Sahibi
            </Text>
              </View>
              <View style={styles.row}>
                <Ionicons name="school-outline" size={20} color="#798777" />
                <Text
                  h4
                  h4Style={{ fontWeight: '400', fontSize: 10, color: '#798777' }}>
                  {' '}
                  {userDataFromDb && userDataFromDb.job ? userDataFromDb.job : 'Meslek belirtilmedi'}
                </Text>
              </View>

            </View>
            <View style={{ flex: 2 }}>
              <View style={{ backgroundColor: 'transparent' }}>
                <Text style={{ fontSize: 12, color: '#798777' }}>Bakabildiğin Petler</Text>
                {userDataFromDb && userDataFromDb.availablePets.length > 0 ? userDataFromDb.availablePets.map((item, id) => {
                  return (
                    <Text key={id} style={{ color: '#798777' }}>{item}</Text>
                  )
                })
                  : (
                    <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
                      <Text style={{ fontSize: 12, color: '#798777' }}>Bakabildiğin pet eklememişsin. Hemen ekle.</Text>
                    </TouchableOpacity>
                  )
                }
              </View>
            </View>
          </View>

          <View style={styles.infoBoxWrapper}>
            <View
              style={[
                styles.infoBox,
                {
                  borderRightWidth: 1,
                  borderRightColor: '#dddddd',
                },
              ]}>
              <Text h3Style={styles.infoTitle} h3>
                {' '}
              1
            </Text>
              <Text h4Style={styles.infoSubTitle} h4>
                Pet Sahibi
            </Text>
            </View>
            <TouchableOpacity style={styles.infoBox} onPress={() => setShowCommentsVisible(!showCommentsVisible)}>
              <Text h3Style={styles.infoTitle} h3>
                {comments && comments.length}
              </Text>
              <Text h4Style={styles.infoSubTitle} h4>
                Değerlendirme
            </Text>
            </TouchableOpacity>
          </View>
        </View>
        {comments && showCommentsModal()}
        <View style={styles.menuWrapper}>
          <TouchableOpacity onPress={onShare}>
            <View style={styles.menuItem}>
              <Ionicons name="share-social-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Profilini Paylaş</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Destek')}>
            <View style={styles.menuItem}>
              <Ionicons name="help-circle-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Destek</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Ayarlar')}>
            <View style={styles.menuItem}>
              <Ionicons name="settings-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Ayarlar</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('EditProfile')}>
            <View style={styles.menuItem}>
              <Ionicons name="create-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Profili Düzenle</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity>
            <View style={styles.menuItem}>
              <Ionicons name="information-circle-outline" size={20} color="tomato" />
              <Text style={styles.menuText}>Bize Ulaş</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ThemeProvider>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#bdc7c9',
  },
  caption: {
    fontWeight: '400',
    color: '#798777',
    fontSize: 17,
    marginTop: 5,
    fontStyle: 'italic',
  },
  textAbout: {
    fontStyle: 'italic',
    fontWeight: '500',
  },
  userInfo: {
    flex: 1,
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoBoxWrapper: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
    flexDirection: 'row',
    height: 50,
  },
  infoBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '50%',
  },
  infoTitle: {
    color: '#1b1717',
    fontSize: 16,
  },
  infoSubTitle: {
    fontSize: 15,
    color: 'gray',
    textTransform: 'uppercase',
  },
  menuWrapper: {
    backgroundColor: '#0e101c'
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 10,
    color: 'tomato',
    fontWeight: '300',
  },
  availablePets: {
    flexDirection: 'row'
  },
  showCommentsModalContainer: {
    flex: 1,
    height: 200,
    width: 300,
    backgroundColor: '#fff',
  }
});
