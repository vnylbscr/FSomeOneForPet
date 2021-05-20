import React, { useContext, useEffect, useState, useCallback } from 'react'
import { ScrollView, FlatList, Image, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { AuthContext } from '../contexts/AuthContext';
import {
    ListItem,
    Avatar
} from 'react-native-elements';
import CalculatePostDate from '../components/CalculatePostDate';
const MyPosts = ({ navigation }) => {
    const [userPosts, setUserPosts] = useState([]);
    const { user } = useContext(AuthContext);
    const [emptyArray, setEmptyArray] = useState(false);
    useEffect(() => {
        getPostsFromDb();
    }, []);
    const getPostsFromDb = async () => {
        const posts = [];
        await firestore().collection('posts')
            .where("owner", "==", user.email)
            .orderBy('createdAt', "desc")
            .get()
            .then(docs => {
                docs.forEach(doc => {
                    const data = {
                        id: doc.id,
                        ...doc.data()
                    }
                    console.log(doc.data());
                    posts.push(data);
                })
            })
        if (posts.length === 0) {
            setEmptyArray(true);
        } else {
            setUserPosts(posts);
        }
    }
    // İlanlarım boş 
    if (emptyArray) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ backgroundColor: 'transparent', borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => navigation.navigate('AddPost')}>
                        <Text style={{ fontSize: 40, textAlign: 'center' }}>🧐</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', color: 'pink', fontSize: 20, textAlign: 'center' }}>Henüz ilan eklememişsin.</Text>
                        <Text style={{ fontFamily: 'Poppins-Regular', fontSize: 15 }}>Buraya tıklayarak hemen ilan ekle!</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    return (
        <ScrollView>
            <View style={styles.container}>
                {userPosts && userPosts.length > 0 && userPosts.map((post, id) => {
                    return (
                        <ListItem
                            key={id}
                            bottomDivider topDivider
                            containerStyle={styles.renderItemContainer}
                            onPress={() => navigation.navigate('ShowPost', { itemid: post.postId })}>
                            <ListItem.Content>
                                <Avatar source={{ uri: post.postImage }}
                                    size='xlarge' iconStyle={styles.postAvatar} />
                                <ListItem.Title style={styles.title}>{post.postName}</ListItem.Title>
                                <ListItem.Subtitle style={styles.subtitle}>{post.postContent}</ListItem.Subtitle>
                                <ListItem.Subtitle style={styles.subtitle}>İlan sahibi: {post.owner}</ListItem.Subtitle>
                                <ListItem.Subtitle style={styles.subtitle}>{post.price}</ListItem.Subtitle>
                                <ListItem.Subtitle style={styles.subtitle}>
                                    <CalculatePostDate date={post.createdAt.toDate()} />
                                </ListItem.Subtitle>
                            </ListItem.Content>
                        </ListItem>
                    )
                })
                }
            </View>
        </ScrollView>
    )
}

export default MyPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    renderItemContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginVertical: 10
    },
    postAvatar: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 20
    },
    title: {
        fontFamily: 'Poppins-Medium',
        color: 'black',
        fontSize: 18
    },
    subtitle: {
        fontFamily: 'Poppins-Regular',
        fontSize: 15,
        color: 'gray'
    }
})
