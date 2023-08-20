import React, { useState, useEffect } from 'react';
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
    };

    useEffect(() => {
        if (isDrawerOpen) {
            setUserData(store.getState().CurrentUser.user);
        }
    }, [isDrawerOpen]);

    return (
        <SafeAreaView style={styles.drawerMenuContainer}>
            <View style={styles.imageSection}>
                {!userData['avatar'] && (
                    <Image
                        style={styles.userAvatar}
                        source={require('../../assets/images/user_default_avatar.png')}
                    />
                )}
                {userData['avatar'] && (
                    <Image style={styles.userAvatar} source={{ uri: userData['avatar'] }} />
                )}
                <Text style={styles.usernameLabel}>{userData['name']}</Text>
            </View>
            <View style={styles.menuArea}>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Icons
                        name="home-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('Home');
                    }}>
                    <Icons
                        name="share-social-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Share the App</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('ProfileHome');
                    }}>
                    <Icons
                        name="person-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('Tracks');
                    }}>
                    <Icons
                        name="calculator-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Price Estimate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('Tracks');
                    }}>
                    <Icons
                        name="wallet-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Wallet</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuButton}
                    onPress={() => {
                        navigation.navigate('Tracks');
                    }}>
                    <Icons
                        name="map-outline"
                        size={25}
                        color={GoDeliveryColors.disabled}
                    />
                    <Text style={styles.menuText}>Track</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.bottomButtonArea}>
                <TouchableOpacity style={styles.menuButton} onPress={logout}>
                    <Icons
                        name="log-out-outline"
                        size={34}
                        color={GoDeliveryColors.primary}
                    />
                    <Text
                        style={[
                            styles.menuText,
                            { color: GoDeliveryColors.primary, fontSize: 22 },
                        ]}>
                        Sign out
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    drawerMenuContainer: {
        flex: 1,
        backgroundColor: GoDeliveryColors.white,
    },
    imageSection: {
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.primary,
        paddingVertical: 20,
    },
    usernameLabel: {
        fontSize: 20,
        fontWeight: 'bold',
        color: GoDeliveryColors.white,
        marginTop: 15,
    },
    menuArea: {
        flex: 1,
        padding: 20,
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 18,
    },
    menuText: {
        color: GoDeliveryColors.disabled,
        fontSize: 20,
        fontWeight: '600',
        marginLeft: 20,
    },
    userAvatar: {
        width: 115,
        height: 115,
        borderRadius: 200,
    },
    bottomButtonArea: {
        padding: 20,
    },
});

export default DrawerMenu;
