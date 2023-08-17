import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Alert, Text } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import GoDeliveryColors from '../../styles/colors';
import store from '../../redux/store';
import { Divider } from 'react-native-paper';

interface ScreenProps {
    navigation: any;
}

const ProfileHomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);

    const navigateToProfile = () => {
        navigation.navigate('MyProfile');
    }

    const navigateToSelectLanguage = () => {
        navigation.navigate('SelectLanguage');
    }

    useFocusEffect(
        useCallback(() => {
            setUserData(store.getState().CurrentUser.user);
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'PROFILE'} />
            <View style={[GlobalStyles.container, { padding: 30, }]}>
                <TouchableOpacity style={styles.cardBack} onPress={navigateToProfile}>
                    <View>
                        {
                            !userData["avatar"] && (
                                <Image style={styles.userAvatar} source={require('../../../assets/images/user_default_avatar.png')} />
                            )
                        }
                        {
                            userData["avatar"] && (
                                <Image style={styles.userAvatar} source={{ uri: userData["avatar"] }} />
                            )
                        }
                    </View>
                    <View style={{ flex: 1, marginLeft: 10, }}>
                        <Text style={styles.title}>{userData.name}</Text>
                        <Text style={styles.content}>{userData.phone}</Text>
                    </View>
                    <FontAwesomeIcon name='chevron-right' size={20} color={GoDeliveryColors.labelColor} />
                </TouchableOpacity>
                <View style={[styles.cardBack, { flexDirection: 'column', justifyContent: 'space-around', alignItems: 'flex-start' }]}>
                    <TouchableOpacity onPress={navigateToSelectLanguage}>
                        <Text style={[styles.content, { fontSize: 18, }]}>Change Language</Text>
                    </TouchableOpacity>
                    <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
                    <TouchableOpacity>
                        <Text style={[styles.content, { fontSize: 18, }]}>My Saved Locations</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    userAvatar: {
        width: 85,
        height: 85,
        borderRadius: 200,
    },
    cardBack: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        padding: 20,
        height: 140,
        marginVertical: 15,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GoDeliveryColors.labelColor,
    },
    content: {
        fontSize: 16,
        fontWeight: '400',
        color: GoDeliveryColors.labelColor,
    }
});

export default ProfileHomeScreen;