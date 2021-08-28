import React, {useEffect, useState} from 'react';
import {Alert} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
export const AuthContext = React.createContext();
export default function AuthProvider({children}) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '461297408556-qlsag3ramhudaugsj1si8m3d852aukg4.apps.googleusercontent.com', // your web client id
    });
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        //giriş Yap
        signIn: async (email, password) => {
          setLoading(true);
          try {
            await auth().signInWithEmailAndPassword(email, password);
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if (error.code === 'auth/user-not-found') {
              setErrorMessages("Bu e-mail'e karşılık bir hesap bulunamadı.");
              // Alert.alert('Üzgünüz..🤔 bir hata ile karşılaştık ',
              //     "Bu e-mail'e karşılık bir hesap bulunamadı.",
              //     [{
              //         text: 'Tamam',
              //         onPress: () => { }
              //     }]);
            } else if (error.code === 'auth/wrong-password') {
              setLoading(false);
              setErrorMessages(
                'E-mail ya da şifre hatalı. Lütfen bilgileri yeniden deneyerek tekrar deneyin',
              );
              // Alert.alert('Üzgünüz..🤔 bir hata ile karşılaştık',
              //     "E-mail ya da şifre hatalı. Lütfen bilgileri yeniden deneyerek tekrar deneyin");
            } else {
              Alert.alert(
                'Üzgünüz..🤔 bir hata ile karşılaştık',
                `${error.code}`,
              );
            }
          }
        },
        //Kayıt ol
        signUp: async (email, password, username, age, cinsiyet) => {
          try {
            setLoading(true);
            await auth().createUserWithEmailAndPassword(email, password);
            //  kullanıcının uid'sine gore veritabanında döküman oluşturuluyor.
            await firestore()
              .collection('users')
              .doc(auth().currentUser.uid)
              .set({
                uid: auth().currentUser.uid,
                email: email,
                username: username,
                phoneNumber: '',
                createdAt: firestore.FieldValue.serverTimestamp(),
                userProfileImagePath:
                  'https://i4.hurimg.com/i/hurriyet/75/0x0/5d78ea1d45d2a023a0d4b139.jpg', //default profil resmi
                userPetImgPath: null,
                location: '',
                job: '',
                age: age,
                gender: cinsiyet,
                availablePets: [],
                posts: [],
              });
            setLoading(false);
          } catch (error) {
            setLoading(false);
            if (error.code === 'auth/email-already-in-use') {
              setErrorMessages('Bu e-mail ile bir hesap zaten var!');
            } else {
              setErrorMessages('Üzgünüm. Bir hata ile karşılaştık!');
              console.log('Kayıt olurken hata!', error);
            }
          }
        },
        // google sign in
        googleSignIn: async () => {
          try {
            const {idToken} = await GoogleSignin.signIn();
            const googleCredential =
              auth.GoogleAuthProvider.credential(idToken);
            auth()
              .signInWithCredential(googleCredential)
              .then(res => {
                firestore().collection('users').doc(res.user.uid).set({
                  uid: res.user.uid,
                  email: res.user.email,
                  username: res.user.displayName,
                  phoneNumber: '',
                  location: '',
                  job: '',
                  createdAt: firestore.FieldValue.serverTimestamp(),
                  userProfileImagePath:
                    'https://i4.hurimg.com/i/hurriyet/75/0x0/5d78ea1d45d2a023a0d4b139.jpg',
                  userPetImgPath: '',
                  age: null,
                  gender: 'Belirtilmedi',
                  availablePets: [],
                  posts: [],
                });
              })
              .catch(error => {
                console.log('Giriş yapılırken hata.', error);
                Alert.alert('Giriş yaparken bir hata ile karşılaştık');
              });
          } catch (error) {
            console.log(error);
            Alert.alert('Bir sorunla karşılaştık!');
          }
        },

        //cıkıs yap
        signOut: async () => {
          try {
            await auth().signOut();
            console.log('Çıkış yapıldı');
          } catch (error) {
            Alert.alert(
              'Üzgünüz..🤔 bir hata ile karşılaştık',
              `${error.code}`,
            );
            console.log('Çıkış yapılırken hata', error);
          }
        },

        //Anonim olarak giriş yap
        anonim: async () => {
          try {
            await auth().signInAnonymously();
          } catch (error) {
            Alert.alert(
              'Üzgünüz..🤔 bir hata ile karşılaştık',
              `${error.code}`,
            );
            console.log('Çıkış yapılırken hata', error);
          }
        },
        errorMessages,
        setErrorMessages,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
