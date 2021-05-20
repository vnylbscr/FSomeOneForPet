import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import Home from '../screens/Home';
import Profile from '../screens/Profile';
import Settings from '../screens/Settings';
import EditProfile from '../screens/EditProfile'
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createStackNavigator } from '@react-navigation/stack';
import Support from '../screens/Support';
import AddPost from '../screens/AddPost';
import MyPosts from '../screens/MyPosts';
import ShowProfile from '../screens/ShowProfile';
import ShowPost from '../screens/ShowPost';
import ChatRooms from '../screens/ChatRooms';
import Message from '../screens/Message';
import { TouchableOpacity, Text } from 'react-native';
import { Avatar } from 'react-native-elements';

//////////////////////////////
const ProfileStack = createStackNavigator();
const HomeStack = createStackNavigator();
const MessageStack = createStackNavigator();
const Tab = createBottomTabNavigator();
////////////////
export default function AppRoutes() {
    return (
        <Tab.Navigator initialRouteName='Anasayfa'
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Anasayfa') {
                        iconName = focused ? 'home' : 'home-outline';
                    } else if (route.name === 'Ayarlar') {
                        iconName = focused ? 'settings' : 'settings-outline';
                    } else if (route.name === 'Profil') {
                        iconName = focused ? 'person-circle-outline' : 'person-circle';
                    } else if (route.name === 'Destek') {
                        iconName = focused ? 'information-circle-outline' : 'information-circle'
                    } else if (route.name === 'Mesajlar') {
                        iconName = focused ? 'chatbubbles' : 'chatbubbles-outline'
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name='Anasayfa'
                component={HomeStackScreen}
            />
            <Tab.Screen
                name='Profil'
                component={ProfileStackScreen} />
            <Tab.Screen name='Ayarlar' component={Settings} />
            <Tab.Screen name='Mesajlar' component={MessageStackScreen} />
            <Tab.Screen name='Destek' component={Support} />
        </Tab.Navigator>
    )
}
const HomeStackScreen = ({ navigation }) => {
    return (
        <HomeStack.Navigator>
            <HomeStack.Screen
                name='Home'
                component={Home}
                options={{
                    title: 'Anasayfa',
                    headerLeft: () => {
                        return (
                            <Feather.Button
                                name='menu'
                                size={25}
                                color='black'
                                onPress={() => navigation.openDrawer()}
                                backgroundColor='#fff'
                            />
                        )
                    },
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'

                    },
                    headerRight: () => {
                        return (
                            <Feather.Button
                                name='plus'
                                size={25}
                                color='black'
                                onPress={() => navigation.navigate('AddPost')}
                                backgroundColor='#fff'
                            />
                        )
                    },
                }}
            />
            <HomeStack.Screen
                name='AddPost'
                component={AddPost}
                options={{
                    title: 'Yeni ilan oluştur',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),

                }}

            />
            <HomeStack.Screen
                name='MyPosts'
                component={MyPosts}
                options={{
                    title: 'İlanlarım',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                }}
            />
            <HomeStack.Screen
                name='ShowPost'
                component={ShowPost}
                options={{
                    title: 'İlan Görüntüle',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                }}
            />
            <HomeStack.Screen
                name='ShowProfile'
                component={ShowProfile}
                // initialParams={{userId:}}
                options={({ route }) => ({
                    title: route.params.user.ownerUsername,
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                    headerTitleStyle: ({ fontFamily: 'Poppins-Regular', fontSize: 20, color: 'purple' })
                })}
            />
        </HomeStack.Navigator>
    )
}

const ProfileStackScreen = ({ navigation }) => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name='Profile'
                component={Profile}
                options={{
                    title: 'Profil',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerRight: () => (
                        <Ionicons.Button
                            name="create-outline"
                            size={25}
                            color='black'
                            onPress={() => navigation.navigate('EditProfile')}
                            backgroundColor='#fff'
                        />
                    ),
                    headerLeft: () => {
                        return (
                            <Feather.Button
                                name='menu'
                                size={25}
                                color='black'
                                onPress={() => navigation.openDrawer()}
                                backgroundColor='#fff'
                            />
                        )
                    },
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    title: 'Profili Düzenle',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 15
                    },
                }}
            />
        </ProfileStack.Navigator>
    )
}
const MessageStackScreen = ({ navigation }) => {
    return (
        <MessageStack.Navigator initialRouteName='ChatRooms'>
            <MessageStack.Screen
                name='ChatRooms'
                component={ChatRooms}
                options={{
                    title: 'Mesajlar',
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                }}
            />
            <MessageStack.Screen
                name='Message'
                component={Message}
                options={({ route }) => ({
                    title: route.params.username,
                    headerTitleStyle: {
                        fontFamily: 'Poppins-Regular',
                        fontSize: 20,
                        color: 'purple'
                    },
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                    headerBackImage: () => (
                        <Ionicons name='chevron-back-circle-outline'
                            size={25}
                            color='black'
                            backgroundColor='#fff'
                        />
                    ),
                    headerLeft: () => (
                        <Avatar source={{ uri: route.params.avatar }} size={'medium'} rounded
                            onPress={() => navigation.goBack()} />
                    ),
                    headerRight: () => (
                        <TouchableOpacity onPress={() => navigation.navigate('ChatRooms')} style={{ marginRight: 20 }}>
                            <Text style={{
                                fontFamily: 'Poppins-Regular',
                                fontSize: 15,
                                color: 'purple'
                            }}>Mesajlarıma Git</Text>
                        </TouchableOpacity>
                    )
                })}
            />
        </MessageStack.Navigator>
    )
}


///end
