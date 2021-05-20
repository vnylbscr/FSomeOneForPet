import React, { useContext, useEffect, useState } from 'react'
import firestore from '@react-native-firebase/firestore';
import {
    StyleSheet,
    Text,
    View,
    Alert,
    Dimensions,
    Image,
    ActivityIndicator,
    ScrollView,
    TouchableOpacity
} from 'react-native';
import { AuthContext } from '../contexts/AuthContext';
import Share from 'react-native-share';
import Toast from 'react-native-toast-message';
import CalculatePostDate from '../components/CalculatePostDate';
const { width, height } = Dimensions.get('window');
const ShowPost = ({ route, navigation }) => {
    const { itemid } = route.params; //array destructing
    const { user } = useContext(AuthContext);
    const [post, setPost] = useState();
    const [documentId, setDocumentId] = useState();
    const [loading, setLoading] = useState(false);
    useEffect(async () => {
        await getCurrentPost();
        return () => {
            setPost(null);
        }
    }, []);
    const getCurrentPost = async () => {
        setLoading(true);
        firestore().collection('posts')
            .where("postId", "==", itemid)
            .get()
            .then(post => {
                post.forEach(doc => {
                    setPost(doc.data());
                    setDocumentId(doc.id);
                })

            })
            .catch(err => {
                console.log("Veritabanı ile ilgili bir sorun oluştu!", err);
                Alert.alert("Veritabanı ile ilgili bir sorun oluştu!");

            });
        setLoading(false);
    }
    function deletePost() {
        try {
            firestore().collection('posts').doc(documentId)
                .delete()
                .then(() => {
                    setPost(null);
                    Alert.alert("Gönderi başarıyla silindi!");
                    navigation.navigate('MyPosts');
                })
                .catch(error => {
                    Alert.alert("Gönderi silinirken bir hata oluştu", `${error}`);
                    console.log(error);
                })
        } catch (error) {
            console.log(error);
            Alert.alert("Gönderi silinirken bir hata oluştu", `${error.message}`);
        }
    }
    const onShare = async () => {
        try {
            Share.open({
                message: 'F SomeOne For Pet ile bakıcı bulmak artık çok kolay. Hemen sende katıl!',
                url: 'https://mertgenc.ga',
                email: user.email,
            })
                .then(res => {
                    console.log(res);
                })
                .catch(err => console.log(err))
        } catch (error) {
            Alert.alert(`${error.message}`);
        }
    }
    if (post === undefined) {
        return (<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="tomato">
            </ActivityIndicator>
            <Text>Yükleniyor</Text>
        </View>)
    }
    return (
        post && (
            <ScrollView>
                <View style={styles.container}>
                    <Image
                        source={{ uri: post.postImage }}
                        style={styles.image}
                    />
                    <View style={styles.infoContainer}>
                        <Text style={styles.title}>{post.postName}</Text>
                        <Text style={styles.subTitle}>{post.postContent}</Text>
                        <Text style={styles.subTitle}>Başlangıç Tarihi:</Text>
                        <Text style={styles.date}>{post.dateStart.toDate().toLocaleString("tr-TR")}</Text>
                        <Text style={styles.subTitle}>Bitiş Tarihi</Text>
                        <Text style={styles.date}>{post.dateEnd.toDate().toLocaleString("tr-TR")}</Text>
                        <Text style={styles.subTitle}>İlan durumu: Aktif</Text>
                    </View>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <CalculatePostDate date={post.createdAt.toDate()} />
                    </View>

                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <TouchableOpacity
                            style={styles.buttonContainer}
                            onPress={() => {
                                Alert.alert("Onayla", "Bu ilanı silmek istediğine emin misin? Bu işlem geri alınamaz!", [
                                    {
                                        text: "Onayla",
                                        onPress: () => deletePost(),
                                    },
                                    {
                                        text: "İptal",
                                        onPress: () => { },
                                    }
                                ])
                            }}>
                            <Text style={[styles.textBtn]}>Sil</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer} onPress={() => {
                            Toast.show({
                                text1: 'İlan Güncellendi',
                                text2: 'İlan güncelleme başarılı!',
                                visibilityTime: 3000,
                                position: 'bottom',
                                type: 'success'
                            })
                        }}>
                            <Text style={styles.textBtn}>Güncelle</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonContainer} onPress={onShare}>
                            <Text style={styles.textBtn}>İlanı Arkadaşlarınla Paylaş</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </ScrollView>
        )
    )
}

export default ShowPost;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: width,
        height: height / 3,
        borderRadius: 4,
        marginTop: 1,
        shadowColor: 'black',
    },
    infoContainer: {
        marginTop: 10,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontFamily: 'Poppins-Regular',
        color: 'black'
    },
    subTitle: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: 'gray'
    },
    date: {
        fontSize: 12,
        fontFamily: 'Poppins-Regular',
        color: '#330',
    },
    buttonContainer: {
        width: 250,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        borderRadius: 20,
        backgroundColor: 'rgba(121,100,215,0.7)'
    },
    textBtn: {
        fontFamily: 'Poppins-Regular',
        fontSize: 18,
        textAlign: 'center',
        color: '#fff'
    },
    dateText: {
        fontSize: 15,
        fontFamily: 'Poppins-Regular',
        color: 'black',
        opacity: 0.7,
    },
})
