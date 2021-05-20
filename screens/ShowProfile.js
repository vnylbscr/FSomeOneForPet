import React, { useState, useEffect, useContext } from 'react'
import {
    StyleSheet,
    Text,
    View,
    Alert,
    ImageBackground,
    TouchableOpacity,
    ScrollView
} from 'react-native';
import {
    Avatar,
    Overlay,
    Input,
    Button,
    ListItem
} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore'
import Loading from '../components/Loading';
import Icon from 'react-native-vector-icons/Ionicons';
import Share from 'react-native-share';
import { AuthContext } from '../contexts/AuthContext';
import Toast from 'react-native-toast-message';
import CalculatePostDate from '../components/CalculatePostDate';
const BG_IMAGE = "https://imgix.bustle.com/uploads/shutterstock/2020/10/15/2a026e04-dd04-445c-b73f-695db7cd1183-shutterstock-1444203920.jpg?w=1020&h=574&fit=crop&crop=faces&auto=format%2Ccompress";
const ShowProfile = ({ route, navigation }) => {
    const { user: userContext } = useContext(AuthContext);
    const { user } = route.params;
    const [userFromDb, setUserFromDb] = useState(null);
    const [loading, setLoading] = useState(false);
    const [comment, setComment] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [showCommentsVisible, setShowCommentsVisible] = useState(false);
    const [avatarOwner, setAvatarOwner] = useState();
    // Yorumların içeriği
    const [comments, setComments] = useState([]);
    useEffect(() => {
        getAvatarFromDb();
        getUserFromDb();
        getCommentsFromDb();
    }, []);
    const getUserFromDb = () => {
        setLoading(true);
        firestore().collection('users').doc(user.ownerUid)
            .get()
            .then(doc => {
                if (doc.exists) {
                    setUserFromDb(doc.data());
                    setLoading(false);
                } else {
                    Alert.alert('Veritabanı ile ilgili bir sorun oluştu');
                }
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
                Alert.alert('Veritabanı ile ilgili bir sorun yaşandı.');
            })
    }
    const onShare = () => {
        try {
            Share.open({
                title: 'Profili Paylaş',
                message: `${userFromDb.username} artık F SomeOne For Pet'te! Hemen sende katıl!`,
                url: 'https://mertgenc.ga',
            })
                .then(res => {
                    console.log(res.message);
                })
                .catch(error => console.log(error));
        } catch (error) {
            console.log(error);
        }
    }
    // Yorumları al
    const getCommentsFromDb = () => {
        try {
            firestore().collection('users').doc(user.ownerUid)
                .get()
                .then(doc => {
                    if (doc.exists) {
                        setComments(doc.data().comments);
                    }
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error);
        }
    }
    // Şuanki kullanıcının avatarını al
    const getAvatarFromDb = () => {
        try {
            firestore().collection('users').doc(userContext.uid)
                .get()
                .then(doc => {
                    setAvatarOwner(doc.data().userProfileImagePath);
                })
                .catch(error => console.log(error));
        } catch (error) {
            console.log(error);
        }
    }
    const addComment = () => {
        try {
            firestore().collection('users').doc(userFromDb.uid)
                .update({
                    comments: firestore.FieldValue.arrayUnion({
                        content: comment,
                        writer: userContext.email,
                        writerAvatar: avatarOwner,
                        createdAt: firestore.Timestamp.fromDate(new Date())
                    })
                })
                .then(() => {
                    toggleModalVisible();
                    Toast.show({
                        text1: 'Başarılı',
                        text2: 'Değerlendirme başarıyla eklendi',
                        type: 'success',
                    });
                })
                .catch(error => console.log(error))
        } catch (error) {
            console.log(error);
        }
    }
    //modalı göster
    const toggleModalVisible = () => {
        setModalVisible(!modalVisible);
    }
    const showCommentsModal = () => {
        return (
            <Overlay onBackdropPress={() => setShowCommentsVisible(!showCommentsVisible)}
                overlayStyle={styles.showCommentsModalContainer} isVisible={showCommentsVisible}>
                <ScrollView>
                    <Text style={styles.modalText}>{userFromDb && userFromDb.username} adlı kullanıcının değerlendirmeleri</Text>
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
    const AddCommentModal = () => {
        return (
            userFromDb &&
            <Overlay isVisible={modalVisible} animationType='fade' onBackdropPress={toggleModalVisible}
                overlayStyle={styles.ModalContainer}
            >
                <Text style={styles.modalText}>{userFromDb.username} adlı kullanıcıya değerlendirme ekle. </Text>
                <Input
                    placeholder='Yorum ekle...'
                    onChangeText={(text) => setComment(text)}
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={{ borderBottomWidth: 0 }}
                    autoCapitalize='sentences'
                    inputStyle={{ fontSize: 15 }}
                    autoFocus={true}
                    leftIcon={() => (
                        <Avatar size={'small'} rounded source={{
                            uri: avatarOwner && avatarOwner
                        }} />
                    )}
                />
                <Button title='Ekle' disabled={comment.length < 5} onPress={addComment} buttonStyle={styles.buttonContainer} />
            </Overlay>
        )
    }
    if (loading) {
        return (<Loading size={35} color='tomato' />)
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.header}>
                    <ImageBackground
                        source={{ uri: BG_IMAGE }}
                        blurRadius={5}
                        style={styles.ImageBackground}>
                        <View style={{ alignItems: 'center' }}>
                            <Avatar size={100} rounded source={{
                                uri: userFromDb && userFromDb.userProfileImagePath
                            }} />
                            <Text style={styles.textStyle}>{userFromDb && userFromDb.username} ( {userFromDb && userFromDb.age} )</Text>
                            <Text style={styles.textSubTitle}>Host, Surfer</Text>
                            <Text style={styles.textSubTitle}>{userFromDb && userFromDb.about}</Text>
                            {userFromDb && (<Text>{userFromDb.job}</Text>)}
                            <Text style={styles.textSubTitle}>{userFromDb && userFromDb.location}</Text>
                        </View>
                    </ImageBackground>
                </View>
                <View style={styles.profileDetail}>
                    <View style={styles.detailContent}>
                        <Text style={styles.title}>İlanlar</Text>
                        <Text style={styles.count}>10</Text>
                    </View>
                    <View style={styles.detailContent}>
                        <Text style={styles.title}>Pet Sahibi</Text>
                        <Text style={styles.count}>2</Text>
                    </View>
                    <TouchableOpacity style={styles.detailContent}
                        onPress={() => setShowCommentsVisible(!showCommentsVisible)}>
                        <Text style={styles.title}>Değerlendirme</Text>
                        <Text style={styles.count}>{comments && comments.length}</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.userInfo}>
                    <View style={{ flex: 2 }}>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Icon name='location-sharp' size={25} color='#f7a440' />
                            <Text style={styles.infoTextIcon}>{userFromDb && userFromDb.location ? userFromDb.location : 'Konum Belirtilmedi'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Icon name='transgender-sharp' size={25} color='#f7a440' />
                            <Text style={styles.infoTextIcon}>{userFromDb && userFromDb.gender ? userFromDb.gender : 'Cinsiyet Belirtilmedi'}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', marginTop: 5 }}>
                            <Icon name='person-circle-sharp' size={25} color='#f7a440' />
                            <Text style={styles.infoTextIcon}>{userFromDb && userFromDb.job ? userFromDb.job : 'Meslek Belirtilmedi'}</Text>
                        </View>
                    </View>
                    <View style={{ flex: 2 }}>
                        <Text style={styles.infoTextTitle}>Bakabildiği Petler</Text>
                        {userFromDb && userFromDb.availablePets.length > 0 && userFromDb.availablePets.map((item, index) => {
                            return (
                                <View style={{ flexDirection: 'column' }}>
                                    <View style={{ flexDirection: 'row' }}>
                                        <Icon name='paw-outline' size={25} color='#f7a440' />
                                        <Text key={index} style={styles.infoTextIcon}>{item}</Text>
                                    </View>
                                </View>
                            )
                        })}
                    </View>
                </View>
                {comments && showCommentsModal()}
                {/* Modal view */}
                {userFromDb && AddCommentModal()}
                <View style={styles.body}>
                    <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(!modalVisible)}>
                        <Icon name='checkbox-outline' size={20} color='white' style={{ marginRight: 10 }} />
                        <Text style={styles.textStyle}>Değerlendirme Ekle</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}
                        onPress={
                            () => {
                                navigation.navigate('Mesajlar', {
                                    screen: 'Message',
                                    params:
                                    {
                                        userUid: userFromDb && userFromDb.uid,
                                        username: userFromDb && userFromDb.username,
                                        avatar: userFromDb && userFromDb.userProfileImagePath
                                    }
                                })
                            }}>
                        <Icon name='chatbubble-outline' size={20} color='white' style={{ marginRight: 10 }} />
                        <Text style={styles.textStyle}>Mesaj Gönder</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer} onPress={onShare}>
                        <Icon name='share-social-outline' size={20} color='white' style={{ marginRight: 10 }} />
                        <Text style={styles.textStyle}>Profili Paylaş</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonContainer}>
                        <Icon name='alert-circle-outline' size={20} color='white' style={{ marginRight: 10 }} />
                        <Text style={styles.textStyle}>Şikayet Et</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    )
}
export default ShowProfile;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        justifyContent: 'center'
    },
    ImageBackground: {
        resizeMode: 'stretch',
    },
    userSection: {
        flexDirection: 'column',
    },
    userInfo: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    profileDetail: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: "#ffffff",
    },
    detailContent: {
        margin: 10,
        alignItems: 'center'
    },
    title: {
        fontSize: 16,
        fontFamily: 'Poppins-Bold',
    },
    count: {
        fontFamily: 'Poppins-Light',
        fontSize: 13,
    },
    textStyle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Bold',
        fontSize: 18,
        color: '#FFFFFF'
    },
    textSubTitle: {
        textAlign: 'center',
        fontFamily: 'Poppins-Light',
        fontSize: 15,
        color: '#ffffff'
    },
    infoTextIcon: {
        fontSize: 12,
        fontFamily: 'Poppins-Light',
        paddingLeft: 10
    },
    infoTextTitle: {
        fontSize: 15,
        fontFamily: 'Poppins-Bold',
    },
    body: {
        flex: 1,
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        width: 250,
        borderRadius: 30,
        backgroundColor: "#00BFFF",
    },
    inputContainer: {
        borderBottomColor: 'black',
        backgroundColor: '#d1d9d9',
        borderRadius: 30,
        borderBottomWidth: 0,
        width: 300,
        height: 45,
        marginBottom: 35,
        alignItems: 'center',

    },
    ModalContainer: {
        height: 300,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.44,
        shadowRadius: 10.32,
        elevation: 16,
        borderRadius: 30
    },
    modal: {
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalText: {
        fontFamily: 'Poppins-Medium',
        textAlign: 'center',
        marginBottom: 20
    },
    showCommentsModalContainer: {
        height: 600,
        backgroundColor: '#fff',
    }
})
