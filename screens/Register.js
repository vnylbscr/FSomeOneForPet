import React, {useContext, useEffect, useReducer, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Input, Button, Divider, CheckBox} from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import {AuthContext} from '../contexts/AuthContext';

export default function Register({navigation}) {
  const {
    signUp,
    googleSignIn,
    loading,
    errorMessages: errorContext,
    setErrorMessages: setErrorContext,
  } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [age, setAge] = useState(0);
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [openDropDownPicker, setOpenDropDownPicker] = useState(false);
  const [open, setOpen] = useState(false);
  const [cinsiyet, setCinsiyet] = useState('Belirtilmedi');
  const [items, setItems] = useState([
    {
      label: 'Erkek',
      value: 'Erkek',
      icon: () => <Icon name='man' size={20} color='red' />,
    },
    {
      label: 'Kadın',
      value: 'Kadın',
      icon: () => <Icon name='woman' size={20} color='red' />,
    },
  ]);
  const [objectState, setObjectState] = useState({
    showPassword: true,
    icon: 'eye-off-outline',
  });
  //Hatalı girişler için uyarı mesajları
  const [errorMessages, setErrorMessages] = useState({
    ePassword: '',
    eEmail: '',
    eUsername: '',
    eAge: '',
  });

  //Show password
  const onChangeIcon = () => {
    setObjectState(prevState => ({
      ...prevState,
      icon:
        prevState.icon === 'eye-outline' ? 'eye-off-outline' : 'eye-outline',
      showPassword: !prevState.showPassword,
    }));
  };
  //confirm Email
  const validateMail = text => {
    const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (mailformat.test(text) === false) {
      if (text.trim().length == 0) {
        setErrorMessages({
          eEmail: 'Bu alan gereklidir',
        });
        setEmail(text);
        return false;
      }
      setErrorMessages({
        eEmail: 'Geçersiz E-mail',
      });
      setEmail(text);
      return false;
    } else {
      setEmail(text);
      setErrorMessages({
        eEmail: '',
      });
      return true;
    }
  };
  //confirm Password
  const validatePassword = text => {
    if (text.trim().length == 0) {
      setPassword(text);
      setErrorMessages({
        ePassword: 'Bu alan gereklidir',
      });
      return false;
    } else if (text.trim().length <= 6) {
      setPassword(text);
      setErrorMessages({
        ePassword: 'Şifreniz 6 karakterden az olmamalıdır',
      });
    } else {
      setPassword(text);
      setErrorMessages({
        ePassword: '',
      });
      return true;
    }
  };
  //confirm Username
  const validateUsername = text => {
    if (text.trim().length == 0) {
      setErrorMessages({
        ...errorMessages,
        eUsername: 'Bu alan gereklidir',
      });
      setUsername(text);
      return false;
    } else {
      setUsername(text);
      setErrorMessages({
        ...errorMessages,
        eUsername: '',
      });
      return true;
    }
  };
  //confirm age
  const validateAge = text => {
    if (text.toString().trim().length == 0) {
      setErrorMessages({
        eAge: 'Bir yaş girmelisiniz',
      });
      return false;
    }
    if (text < 18 || text >= 100) {
      setErrorMessages({
        eAge: 'Geçerli bir yaş girin.',
      });
      setAge(text);
      return false;
    } else {
      setAge(text);
      setErrorMessages({
        ...errorMessages,
        eAge: '',
      });
      return true;
    }
  };
  const clean = text => {
    const cleanNumber = text.toString().replace(/[^0-9]/g, '');
    return cleanNumber;
  };
  const handleSubmit = () => {
    if (
      validateMail(email) &&
      validateUsername(username) &&
      validateAge(age) &&
      validatePassword(password)
    ) {
      signUp(email, password, username, age, cinsiyet);
    }
  };
  return (
    <>
      <KeyboardAwareScrollView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.headerText}>F SomeOne For Pet</Text>
            </View>
            <Input
              placeholder='E-mail adresinizi girin'
              returnKeyType='next'
              leftIcon={<Icon name='mail' size={25} color='black' />}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={text => setEmail(text)}
              onEndEditing={e => validateMail(e.nativeEvent.text)}
              errorMessage={errorMessages.eEmail}
              underlineColorAndroid='transparent'
              onFocus={() => setErrorContext(null)}
            />

            <Input
              placeholder='İsminiz ve Soyisminiz'
              returnKeyType='next'
              leftIcon={<Icon name='person' size={25} color='black' />}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{borderBottomWidth: 0}}
              onChangeText={text => setUsername(text)}
              onEndEditing={e => validateUsername(e.nativeEvent.text)}
              errorMessage={errorMessages.eUsername}
              underlineColorAndroid='transparent'
              onFocus={() => setErrorContext(null)}
            />

            <Input
              placeholder='Yaşınız'
              value={clean(age)}
              labelStyle={styles.inputLabelStyle}
              keyboardType='numeric'
              containerStyle={styles.inputContainer}
              inputContainerStyle={{borderBottomWidth: 0}}
              leftIcon={<Icon name='calendar' size={25} color='black' />}
              onChangeText={text => {
                const age = clean(text);
                setAge(age);
              }}
              onEndEditing={e => validateAge(parseInt(e.nativeEvent.text))}
              errorMessage={errorMessages.eAge}
              underlineColorAndroid='transparent'
              onFocus={() => setErrorContext(null)}
            />

            <Input
              placeholder='Şifreniz'
              value={password}
              containerStyle={styles.inputContainer}
              inputContainerStyle={{borderBottomWidth: 0}}
              leftIcon={<Icon name='lock-closed' size={25} color='black' />}
              rightIcon={() => {
                if (!password == '') {
                  return (
                    <Icon.Button
                      name={objectState.icon}
                      size={25}
                      color='black'
                      backgroundColor='#fff'
                      onPress={() => {
                        onChangeIcon();
                      }}
                    />
                  );
                }
              }}
              onFocus={() => setErrorContext(null)}
              underlineColorAndroid='transparent'
              onChangeText={e => setPassword(e)}
              onEndEditing={e => validatePassword(e.nativeEvent.text)}
              errorMessage={errorMessages.ePassword}
              secureTextEntry={objectState.showPassword}
            />
            <DropDownPicker
              placeholder='Cinsiyet Seçin'
              placeholderStyle={{fontFamily: 'Poppins-Regular', fontSize: 14}}
              open={open}
              value={cinsiyet}
              items={items}
              setValue={setCinsiyet}
              setItems={setItems}
              setOpen={setOpen}
              containerStyle={styles.pickerContainerStyle}
              searchable={false}
              listItemLabelStyle={{fontFamily: 'Poppins-Regular'}}
              labelStyle={{fontFamily: 'Poppins-Regular'}}
            />
            <Button
              containerStyle={{marginHorizontal: 30, marginTop: 10, width: 250}}
              buttonStyle={{height: 50, borderRadius: 30}}
              titleStyle={{fontFamily: 'Poppins-Regular'}}
              title='Kayıt Ol'
              onPress={handleSubmit}
              loading={loading}
            />
            {errorContext && (
              <View style={styles.errorMessageContainer}>
                <Text style={styles.errorMessage}>{errorContext}</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                margin: 40,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{color: 'gray', fontFamily: 'Poppins-Regular'}}>
                Zaten hesabın var mı?{' '}
              </Text>
              <Text
                onPress={() => navigation.navigate('Login')}
                style={{color: '#046582', fontFamily: 'Poppins-Regular'}}>
                Giriş Yap
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.fabookButton]}>
              <View style={styles.socialButtonContent}>
                <Icon
                  name='logo-facebook'
                  size={20}
                  color='white'
                  style={styles.socialIcon}
                />
                <Text style={styles.loginText}>Facebook ile giriş yap</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.buttonContainer, styles.googleButton]}
              onPress={() => googleSignIn()}>
              <View style={styles.socialButtonContent}>
                <Icon
                  name='logo-google'
                  size={20}
                  color='white'
                  style={styles.socialIcon}
                />
                <Text style={styles.loginText}>Google ile giriş yap</Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#a7bbc7',
  },
  header: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontFamily: 'Poppins-BoldItalic',
    color: 'black',
    fontSize: 40,
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#fff',
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
    color: 'black',
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
  socialIcon: {
    color: 'white',
    marginLeft: 10,
  },
  fabookButton: {
    backgroundColor: '#3b5998',
  },
  googleButton: {
    backgroundColor: '#de5246',
  },
  loginText: {
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  pickerContainerStyle: {
    width: 250,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  errorMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  errorMessage: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    textAlign: 'center',
    color: 'red',
  },
});
