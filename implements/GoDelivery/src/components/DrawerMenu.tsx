import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import store from '../redux/store';
import { useDrawerStatus } from '@react-navigation/drawer';

interface DrawerMenuProps {
    navigation: any;
}

const DrawerMenu = ({ navigation }: DrawerMenuProps): JSX.Element => {
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);
    const isDrawerOpen = useDrawerStatus() === 'open';

    const logout = async () => {
        await AsyncStorage.removeItem('CLIENT_DATA');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Splash', params: { initialIndex: 0 } }],
        });
    }

    useEffect(() => {
        if (isDrawerOpen) {
            setUserData(store.getState().CurrentUser.user);
        }
    }, [isDrawerOpen]);

    return (
        <SafeAreaView style={styles.drawerMenuContainer}>
            <View style={styles.imageSection}>
                {
                    !userData["avatar"] && (
                        <Image style={styles.userAvatar} source={require('../../assets/images/user_default_avatar.png')} />
                    )
                }
                {
                    userData["avatar"] && (
                        <Image style={styles.userAvatar} source={{ uri: userData["avatar"] }} />
                    )
                }
                <Text style={styles.usernameLabel}>{userData["name"]}</Text>
            </View>
            <View style={styles.menuArea}>
                <TouchableOpacity style={styles.menuButton} onPress={() => { navigation.navigate('Home') }}>
                    <Icons name="home-outline" size={25} color={GoDeliveryColors.white} />
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuButton} onPress={() => { navigation.navigate('Profile') }}>
                    <Icons name="person-outline" size={25} color={GoDeliveryColors.white} />
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                {/* <TouchableOpacity style={styles.menuButton} onPress={() => { navigation.navigate('Locations') }}>
                    <Icons name="location-outline" size={25} color={GoDeliveryColors.white} />
                    <Text style={styles.menuText}>Locations</Text>
                </TouchableOpacity> */}
                <TouchableOpacity style={styles.menuButton} onPress={() => { navigation.navigate('Tracks') }}>
                    <Icons name="map" size={25} color={GoDeliveryColors.white} />
                    <Text style={styles.menuText}>Estimate</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomButtonArea}>
                <TouchableOpacity style={styles.menuButton} onPress={logout}>
                    <Icons name="power" size={25} color={GoDeliveryColors.white} />
                    <Text style={styles.menuText}>Sign out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    drawerMenuContainer: {
        padding: 25,
        flex: 1,
    },
    imageSection: {
        marginHorizontal: 20,
        alignItems: 'center',
        marginVertical: 30,
    },
    usernameLabel: {
        fontSize: 18,
        fontWeight: "600",
        color: GoDeliveryColors.white,
        marginTop: 15,
    },
    menuArea: {
        flex: 1,
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18
    },
    menuText: {
        color: GoDeliveryColors.white,
        fontSize: 20,
        fontWeight: "600",
        marginLeft: 20
    },
    userAvatar: {
        width: 115,
        height: 115,
        borderRadius: 200,
    },
    bottomButtonArea: {
        marginBottom: 50,
    }
})

export default DrawerMenu;