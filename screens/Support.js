import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
  StatusBar,
} from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import * as Animatable from 'react-native-animatable';
const CONTENT = [
  {
    title: 'F SomeOne For Pet Nedir?',
    content:
      'F SomeOne For Pet en güzel petleriniz için bakıcı bulma platformudur.',
  },
  {
    title: 'F SomeOne For Pet güvenli midir?',
    content:
      'F SomeOne Pet güvenliğe önem vermektedir. Platformu kullanan insanlar doğrulanmış kişilerdir.',
  },
  {
    title: 'F SomeOne For Pet Nasıl Çalışır?',
    content:
      'Petinizi bırakmak istediğiniz surfer ile görüşüp petinizi bıraktıktan sonra F SomeOne For Pet uygulamasından ziyareti doğrulayarak ödemeyi gerçekleştirebilirsiniz.',
  },
  {
    title: 'Neden F SomeOne For Pet?',
    content: 'Çünkü petinize önem veriyoruz, kullanıcılarımıza önem veriyoruz.',
  },
];

const Support = () => {
  const [activeSections, setActiveSections] = useState([]);
  //const toggleCollapsed = () => setCollapsed(!collapsed);

  const setSections = sections => {
    // Setting up a active section state
    setActiveSections(sections.includes(undefined) ? [] : sections);
  };

  const renderHeader = (section, _, isActive) => {
    // Accordion header view
    return (
      <Animatable.View
        duration={400}
        style={[isActive ? styles.active : styles.inactive]}
        transition='backgroundColor'>
        <Text style={styles.caption}>{section.title}</Text>
      </Animatable.View>
    );
  };

  const renderContent = (section, _, isActive) => {
    // Accordion Content view
    return (
      <Animatable.View
        duration={400}
        style={[styles.content, isActive ? styles.active : styles.inactive]}
        transition='backgroundColor'>
        <Animatable.Text
          animation={isActive ? 'pulse' : undefined}
          style={styles.subTitle}>
          {section.content}
        </Animatable.Text>
      </Animatable.View>
    );
  };
  return (
    <ScrollView>
      <StatusBar barStyle='dark-content' backgroundColor='transparent' />
      <View style={styles.container}>
        <View style={styles.headerTitle}>
          <Text style={styles.pageTitle}>F SomeONE For Pet</Text>
          <Image
            style={{width: 150, height: 200, borderRadius: 200}}
            source={{
              uri: 'https://i.pinimg.com/originals/af/fb/c9/affbc96be98edecba473e0e630069b3b.png',
            }}
          />
          <Text
            style={{
              fontFamily: 'Poppins-Black',
              fontSize: 20,
              marginTop: 15,
              color: 'rgba(0,53,212,.8)',
            }}>
            Artık Petine Bakıcı Bulmak Çok Kolay!
          </Text>
        </View>
        <View style={{margin: 10, marginTop: 10}}>
          <Accordion
            sections={CONTENT}
            activeSections={activeSections}
            renderHeader={renderHeader}
            renderContent={renderContent}
            duration={500}
            onChange={setSections}
            sectionContainerStyle={{margin: 10}}
            containerStyle={{margin: 20}}
          />
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            onPress={() => Linking.openURL('https://www.mertgenc.ga')}>
            <Text style={styles.footerText}>
              Daha fazla bilgi almak için web sayfamızı ziyaret edebilirsiniz.
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Support;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6c4c0',
  },
  headerTitle: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pageTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 28,
    color: '#871F78',
    marginTop: 5,
  },
  caption: {
    fontSize: 20,
    fontFamily: 'Poppins-Regular',
    marginHorizontal: 5,
    textAlign: 'center',
  },
  content: {
    backgroundColor: '#f5cebe',
    marginVertical: 5,
  },
  subTitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 15,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  header: {
    backgroundColor: 'blue',
  },

  active: {
    backgroundColor: '#8ab6d6',
  },
  inactive: {
    backgroundColor: '#f5cebe',
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontFamily: 'Poppins-Italic',
    fontSize: 14,
    textAlign: 'center',
  },
});
