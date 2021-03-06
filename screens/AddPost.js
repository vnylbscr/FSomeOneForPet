import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  Alert,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  ToastAndroid,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {Button} from 'react-native-elements';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import Icon from 'react-native-vector-icons/Ionicons';
import firestore from '@react-native-firebase/firestore';
import {useFormik} from 'formik';
import {AuthContext} from '../contexts/AuthContext';
import {postSchema} from '../validation/PostValidation';
import FormInput from '../components/FormInput';
import PushNotification from 'react-native-push-notification';
import DatePicker from 'react-native-date-picker';
import storage from '@react-native-firebase/storage';
const {width, height} = Dimensions.get('screen');
import Toast from 'react-native-toast-message';
import BottomSheet from 'reanimated-bottom-sheet';
//////////////////////////////////////
const AddPost = () => {
  const {
    handleChange,
    handleSubmit,
    handleReset,
    handleBlur,
    values,
    errors,
    resetForm,
    touched,
  } = useFormik({
    validationSchema: postSchema,
    initialValues: {postTitle: '', postContent: '', postPrice: null},
    onSubmit: async () => {
      if (await savePost()) {
        createPostNotification();
        setState({
          dateEnd: new Date(),
          dateStart: new Date(),
        });
        handleReset();
      }
    },
  });
  const sheetRef = useRef(null);
  const {user} = useContext(AuthContext);
  const [state, setState] = useState({
    postName: '',
    postContent: '',
    price: '',
    dateStart: undefined,
    dateEnd: undefined,
    postImage: null,
    ownerAvatar: '',
    ownerUsername: '',
  });
  const [image, setImage] = useState(null);
  useEffect(async () => {
    await firestore()
      .collection('users')
      .doc(user.uid)
      .get()
      .then(doc => {
        setState({
          ...state,
          ownerAvatar: doc.data().userProfileImagePath,
          ownerUsername: doc.data().username,
        });
      });
  }, []);

  const savePost = async () => {
    console.log('AGAAAA');
    const uriImage = await uploadImage();
    if (uriImage === null) {
      Toast.show({
        text1: 'HATA!',
        text2: '??lan olu??turmak i??in resim se??melisiniz!',
        visibilityTime: 3000,
        position: 'top',
        type: 'error',
      });
      return null;
    } else {
      firestore()
        .collection('posts')
        .add({
          dateStart: firestore.Timestamp.fromDate(state.dateStart),
          dateEnd: firestore.Timestamp.fromDate(state.dateEnd),
          postImage: uriImage,
          owner: user.email,
          ownerUsername: state.ownerUsername,
          ownerUid: user.uid,
          ownerAvatar: state.ownerAvatar,
          postId: uuidv4(), //postlara eri??mek i??in unique id at??yoruz
          createdAt: firestore.Timestamp.now(), //olu??turulan tarih
          ...values,
        })
        .then(() => {
          Toast.show({
            text1: 'Ba??ar??l??',
            text2: `${values.postTitle} adl?? ilan??n ba??ar??yla yay??nland??!`,
            visibilityTime: 3000,
            position: 'top',
            type: 'success',
          });
        })
        .catch(e => console.log('Bir sorunla kar????la??t??k', e));

      return true;
    }
  };
  const createPostNotification = () => {
    PushNotification.localNotification({
      title: `${values.postTitle} ilan??n yay??nda!`,
      message: 'Yeni ilan??n yay??nland??. ??lan??na yeni gelen istekler var.',
      largeIconUrl:
        'https://i.pinimg.com/originals/a0/5f/9b/a05f9b6cb315590f936f548a498fb233.jpg',
      channelId: 'app',
    });
  };
  ///////////////////////
  const takePhotoWithCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        includeBase64: false,
      },
      res => {
        const src = res.uri;
        console.log(src);
        setImage(src);
        sheetRef.current.snapTo(2);
      },
    );
  };
  //////////////////////////
  const chooseImageFromLibrary = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        maxWidth: 500,
        maxHeight: 500,
        includeBase64: false,
      },
      res => {
        const src = res.uri;
        console.log('File name res :' + res.fileName);
        setImage(src);
        sheetRef.current.snapTo(2);
      },
    );
  };
  /////// upload image to firebase storage
  const uploadImage = async () => {
    if (image === null) return null;
    const uploadUri = image;
    let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1); //resmin dosya yolundan dosya ismi al??n??yor
    const storageRef = storage().ref(`photos/${filename}`);
    const task = storageRef.putFile(uploadUri);
    try {
      await task;
      const url = await storageRef.getDownloadURL();
      setImage(null);
      return url;
    } catch (error) {
      console.log('Foto??raf?? y??klerken bir hata!', error);
      Alert.alert('Foto??raf y??klenemedi. Hata:' + error.code);
    }
  };
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
          Foto??raf Y??kle
        </Text>
        <Text
          style={{
            fontSize: 15,
            textAlign: 'center',
            color: 'gray',
            fontFamily: 'Poppins-Regular',
          }}>
          Ya da Galeriden Bir Foto??raf Se??
        </Text>
      </View>

      <Button
        buttonStyle={{backgroundColor: 'tomato', borderRadius: 10}}
        title='Foto??raf ??ek'
        onPress={takePhotoWithCamera}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
      <Button
        buttonStyle={{
          backgroundColor: 'tomato',
          borderRadius: 10,
        }}
        title='Galeriden Se??'
        onPress={chooseImageFromLibrary}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
      <Button
        buttonStyle={{backgroundColor: 'tomato', borderRadius: 10}}
        title='??ptal'
        onPress={() => sheetRef.current.snapTo(2)}
        containerStyle={styles.sheetBtn}
        titleStyle={{fontFamily: 'Poppins-Regular'}}
      />
    </View>
  );
  const bottomRenderHeader = () => (
    <View style={styles.header}>
      <View style={styles.panelHeader}>
        <View style={styles.panelHandle} />
      </View>
    </View>
  );
  return (
    <>
      <ScrollView>
        <View style={styles.Container}>
          <View style={{alignItems: 'center'}}>
            <View style={{marginVertical: 16, width: '90%'}}>
              <FormInput
                icon='add-circle'
                placeholder='??lan ba??l??????n?? gir.'
                autoCapitalize='sentences'
                onChangeText={handleChange('postTitle')}
                onBlur={handleBlur('postTitle')}
                error={errors.postTitle}
                touched={touched.postTitle}
                value={values.postTitle}
              />
            </View>
            <View style={{marginVertical: 16, width: '90%'}}>
              <FormInput
                icon='bookmark'
                placeholder='??lan i??eri??ini gir'
                autoCapitalize='none'
                onChangeText={handleChange('postContent')}
                onBlur={handleBlur('postContent')}
                error={errors.postContent}
                touched={touched.postContent}
                value={values.postContent}
              />
            </View>
            <View style={{marginVertical: 16, width: '90%'}}>
              <FormInput
                value={values.postPrice}
                icon='logo-usd'
                placeholder='??lan fiyat??n?? gir.'
                autoCapitalize='none'
                keyboardType='number-pad'
                onChangeText={handleChange('postPrice')}
                onBlur={handleBlur('postPrice')}
                error={errors.postPrice}
                touched={touched.postPrice}
              />
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.buttonContainer}
                onPress={() => sheetRef.current.snapTo(0)}>
                <Text style={styles.title}>??lan i??in resim se??</Text>
              </TouchableOpacity>
            </View>
            {image && (
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flexDirection: 'row',
                }}>
                <Icon name='checkmark' size={25} color='green' />
                <Text style={[styles.title, {color: 'black'}]}>
                  Resim Se??ildi
                </Text>
              </View>
            )}
            <Text style={[styles.title, {color: 'black'}]}>
              ??lan??n Ba??lang???? Tarihi:
            </Text>
            <View style={{flex: 1}}>
              <DatePicker
                date={state.dateStart ? state.dateStart : new Date()}
                onDateChange={date => setState({...state, dateStart: date})}
                minimumDate={new Date()}
                mode={'datetime'}
                locale={'tr'}
                timeZoneOffsetInMinutes={4}
                is24hourSource={'locale'}
                dividerHeight={5}
                textColor='purple'
                minuteInterval={30}
                androidVariant='nativeAndroid'
              />
            </View>
            <Text style={[styles.title, {color: 'black'}]}>
              ??lan??n Biti?? Tarihi:
            </Text>
            <View>
              <DatePicker
                date={state.dateEnd ? state.dateEnd : new Date()}
                onDateChange={date => setState({...state, dateEnd: date})}
                minimumDate={state.dateStart ? state.dateStart : new Date()}
                mode={'datetime'}
                locale={'tr'}
                is24hourSource={'locale'}
                dividerHeight={5}
                textColor='purple'
                minuteInterval={30}
                androidVariant='nativeAndroid'
              />
            </View>
            <Button
              title='??lan Olu??tur'
              onPress={() => {
                handleSubmit();
              }}
              titleStyle={{fontFamily: 'Poppins-Medium'}}
              containerStyle={{
                margin: 10,
                marginHorizontal: 20,
                paddingHorizontal: 20,
              }}
              buttonStyle={{
                borderRadius: 20,
                width: 200,
                backgroundColor: 'tomato',
              }}
              disabled={
                errors.postTitle ||
                errors.postContent ||
                errors.postPrice ||
                !values.postTitle ||
                !values.postContent ||
                !values.postPrice
              }
            />
          </View>
        </View>
      </ScrollView>
      <BottomSheet
        snapPoints={[308, 200, 0]}
        ref={sheetRef}
        initialSnap={2}
        renderHeader={bottomRenderHeader}
        renderContent={bottomRenderItem}
        enabledHeaderGestureInteraction={true}
      />
    </>
  );
};
export default AddPost;
const styles = StyleSheet.create({
  Container: {
    flex: 1,
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
    width: 60,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00000040',
    marginBottom: 10,
  },
  sheetBtn: {
    marginHorizontal: 30,
    margin: 10,
  },
  dateTitle: {
    textAlign: 'center',
    fontFamily: 'Poppins-Light',
    color: '#666',
    fontSize: 20,
  },
  datePicker: {
    width: 300,
    height: 100,
    margin: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderRadius: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 250,
    borderRadius: 14,
    backgroundColor: 'rgba(65,144,200,1)',
    padding: 10,
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: 'white',
  },
  headerBottomSheet: {
    backgroundColor: 'transparent',
  },
});
