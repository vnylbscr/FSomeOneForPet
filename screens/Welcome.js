import React, { useContext, useEffect, useState } from 'react'
import { TouchableOpacity } from 'react-native'
import { Animated } from 'react-native'
import { Dimensions } from 'react-native'
import { StyleSheet, Text, View } from 'react-native'
import { AuthContext } from '../contexts/AuthContext'
import SplashScreen from 'react-native-splash-screen';
const { width, height } = Dimensions.get('window');

const AnimatedImageBackground = ({ ...props }) => {
    const opacity = useState(new Animated.Value(0))[0];
    const onLoad = () => {
        Animated.timing(opacity, {
            toValue: 1,
            duration: 4000,
            useNativeDriver: true
        }).start()
    }

    return (
        <Animated.Image
            onLoad={onLoad}
            style={[
                {
                    opacity: opacity,
                },
                props.style,
            ]}
            {...props}
        />
    )
}
const Welcome = ({ navigation }) => {
    const { anonim } = useContext(AuthContext);
    useEffect(() => {
        SplashScreen.hide();
    }, [])
    return (
        <View style={styles.container}>
            <View style={styles.backgroundImg}>
                <AnimatedImageBackground
                    source={require('../src/images/bg.jpg')}
                />
            </View>
            <View style={styles.logoTitle}>
                <Text style={styles.textTitle}>F SomeOne For Pet</Text>
                <Text style={styles.subtitle}>Evcil hayvanın için bakıcı bul!</Text>
            </View>
            <View style={{ height: height / 3, justifyContent: 'center' }}>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.btnText}>GİRİŞ YAP</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Register')}>
                    <Text style={styles.btnText}>KAYIT OL</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.textAnonim} onPress={() => anonim()}>
                    <Text style={[styles.btnText], {
                        fontFamily: 'Poppins-Italic',
                        color: 'white',
                        textShadowColor: 'rgba(0, 144, 242, 0.75)',
                        textShadowOffset: { width: -1, height: 1 },
                        textShadowRadius: 10
                    }}>Yada Ananim Olarak Giriş Yap</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Welcome;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'pink',
        justifyContent: 'flex-end'
    },
    backgroundImg: {
        ...StyleSheet.absoluteFill,
        width: width,
        height: height,
    },
    btn: {
        backgroundColor: 'white',
        height: 60,
        margin: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        fontSize: 18,
        fontFamily: 'Poppins-Bold',
    },
    logoTitle: {
        height: height,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textTitle: {
        fontSize: 36,
        textAlign: 'justify',
        fontFamily: 'Poppins-SemiBoldItalic',
        color: '#1cc5dc',
        textShadowColor: '#aa2ee6',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    },
    subtitle: {
        fontSize: 18,
        fontFamily: 'Poppins-Light',
        textAlign: 'auto',
        color: 'black'
    },
    textAnonim: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
        height: 30,
        backgroundColor: 'transparent'
    },
})
