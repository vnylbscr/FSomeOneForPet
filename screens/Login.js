import React, { useState, useContext, useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  Input,
  Button

} from 'react-native-elements';
import PushNotification from "react-native-push-notification";
import Icon from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/AuthContext';
import { ImageBackground } from 'react-native';
const theme = {
  primary: {
    color: 'tomato',
  },
};
export default function Login({ navigation }) {
  const { signIn, loading, errorMessages, setErrorMessages, googleSignIn } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [objectState, setObjectState] = useState({
    showPassword: true,
    icon: 'eye-off-outline',
  });

  const testPush = () => {
    PushNotification.localNotification({
      title: "My Notification Title", // (optional)
      message: "My Notification Message", // (required)
      date: new Date(Date.now() + 5 * 1000), // in 60 secs
    })
  }
  //local hata mesajları
  const [errMessages, setErrMessages] = useState({
    errPassword: '',
    errEmail: '',
  });

  useEffect(() => {
    setErrorMessages(null);
  }, [email, password])
  const onChangeIcon = () => {
    setObjectState(prevState => ({
      ...prevState,
      icon:
        prevState.icon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline',
      showPassword: !prevState.showPassword,
    }));
  };

  const validateMail = (text) => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(text) === false) {
      if (text.trim().length == 0) {
        setErrMessages({
          errEmail: 'Bu alan gereklidir',
        });
        setEmail(text);
        return false;
      }
      setErrMessages({
        errEmail: 'Geçersiz E-mail',
      });
      setEmail(text);
      return false;
    } else {
      setEmail(text);
      setErrMessages({
        errEmail: '',
      });
      return true;
    }
  };
  const validatePassword = (text) => {
    if (text.trim().length == 0) {
      setPassword(text);
      setErrMessages({
        errPassword: 'Bu alan gereklidir',
      });
      return false;
    } else if (text.trim().length <= 6) {
      setPassword(text);
      setErrMessages({
        errPassword: 'Şifreniz 6 karakterden az olmamalıdır',
      });
    } else {
      setPassword(text);
      setErrMessages({
        errPassword: '',
      });
      return true;
    }
  };
  const handleSubmit = () => {
    if (validateMail(email) && validatePassword(password)) {
      signIn(email, password);
    }
  }
  return (
    <>
      <ImageBackground
        source={{ uri: 'https://i.pinimg.com/originals/a9/6f/81/a96f817655652944e307e82accbbe20f.jpg' }}
        style={StyleSheet.absoluteFillObject}
      //blurRadius={5}
      >
        <KeyboardAwareScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>F SomeOne For Pet</Text>
            </View>

            <Input
              placeholder='E-mail adresinizi girin'
              returnKeyType='next'
              leftIcon={<Icon name='mail' size={25} color='black' />}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              onChangeText={(text) => setEmail(text)}
              onEndEditing={(e) => validateMail(e.nativeEvent.text)}
              errorMessage={errMessages.errEmail}
              underlineColorAndroid='transparent'
              autoCapitalize='none'
              autoCompleteType='off'
            />
            <Input
              placeholder='Şifre'
              leftIcon={<Icon name='lock-closed' size={25} color='black' />}
              secureTextEntry={objectState.showPassword}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{ borderBottomWidth: 0 }}
              rightIcon={() => {
                if (password != '') {
                  return (
                    <Icon.Button name={objectState.icon} size={25} color='black' borderRadius={20} backgroundColor='#a6d6d6'
                      onPress={onChangeIcon} />
                  )
                }
              }}
              onChangeText={(text) => setPassword(text)}
              onEndEditing={(e) => validatePassword(e.nativeEvent.text)}
              errorMessage={errMessages.errPassword}
              underlineColorAndroid='transparent'
              returnKeyType='next'
            />
            <TouchableOpacity style={styles.restoreButtonContainer}>
              <Text style={styles.buttonText}>Şifremi Unuttum</Text>
            </TouchableOpacity>
            {errorMessages && (<View style={styles.errorMessageContainer}>
              <Text style={styles.errorMessage}>{errorMessages}</Text>
            </View>)
            }
            {/* <TouchableOpacity
          style={[styles.buttonContainer, styles.loginButton]}
          disabled={!email || !password}
          onPress={handleSubmit}
        >
          <Text style={styles.loginText}>Giriş Yap</Text>
          
        </TouchableOpacity> */}
            <Button title='Giriş Yap' buttonStyle={styles.buttonContainer} titleStyle={{ fontFamily: 'Poppins-Medium' }} onPress={handleSubmit} loading={loading} disabled={!email || !password} />
            <View
              style={{
                flexDirection: 'row',
                margin: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ color: 'gray', fontFamily: 'Poppins-Regular' }}>Henüz hesabın yok mu? </Text>
              <Text
                onPress={() => navigation.navigate('Register')}
                style={{ color: '#046582', fontFamily: 'Poppins-Regular' }}>
                Kayıt Ol
          </Text>
            </View>


            <TouchableOpacity style={[styles.buttonContainer, styles.fabookButton]}>
              <View style={styles.socialButtonContent}>
                <Icon name='logo-facebook' size={20} color='white' style={styles.socialIcon} />
                <Text style={styles.loginText}>Facebook ile giriş yap</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.buttonContainer, styles.googleButton]} onPress={() => googleSignIn()}>
              <View style={styles.socialButtonContent}>
                <Icon name='logo-google' size={20} color='white' style={styles.socialIcon} onPress={testPush} />
                <Text style={styles.loginText}>Google ile giriş yap</Text>
              </View>
            </TouchableOpacity>
          </View>
        </KeyboardAwareScrollView>
      </ImageBackground>
    </>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    //backgroundColor: '#B0E0E6',
    backgroundColor: 'transparent'
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,

  },
  headerText: {
    fontFamily: 'Poppins-BoldItalic',
    color: 'black',
    fontSize: 36,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: -1, height: 5 },
    textShadowRadius: 10
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#a6d6d6',
    borderRadius: 30,
    borderBottomWidth: 0,
    width: 300,
    height: 45,
    marginBottom: 35,
    alignItems: 'center',
  },
  restoreButtonContainer: {
    width: 250,
    marginBottom: 15,
    alignItems: 'flex-end',
  },
  buttonText: {
    fontFamily: 'Poppins-SemiBold',
    color: 'black'
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  socialButtonContent: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#3498db'
  },
  fabookButton: {
    backgroundColor: '#3b5998'
  },
  googleButton: {
    backgroundColor: '#de5246'
  },
  loginText: {
    color: 'white',
    fontFamily: 'Poppins-Regular'
  },
  socialIcon: {
    color: 'white',
    marginRight: 5
  },
  errorMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20
  },
  errorMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    textAlign: 'center',
    color: 'red'
  }
});
