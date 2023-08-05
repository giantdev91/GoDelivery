import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import Action from '../../service';
import allActions from '../../redux/actions';

interface SplashScreenProps {
    navigation: any;
}

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
    const [loginFlag, setLoginFlag] = useState(false);
    const [activityIndicator, setActivityIndicator] = useState(true);
    const dispatch = useDispatch();

    const navigateToSignin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn', params: { initialIndex: 0 } }],
        });
    }

    const checkUserLoginStatus = async () => {
        const userDataStr = await AsyncStorage.getItem('USER_DATA');
        if (userDataStr) {
            const userData = JSON.parse(userDataStr);
            Action.deliveryman.getById(userData.id)
                .then(response => {
                    const responseData = response.data;
                    dispatch(allActions.UserAction.setUser(responseData.data));
                    storeData(responseData.data);
                    setActivityIndicator(false);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Main' }],
                    });
                })
                .catch(err => {
                    setActivityIndicator(false);
                })
        } else {
            setActivityIndicator(false);
            setLoginFlag(true);
        }

    }

    const storeData = async (userData: any) => {
        try {
            await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
        } catch {
            console.log('error occured!');
        }
    }

    useEffect(() => {
        checkUserLoginStatus();
    })

    return (
        <SafeAreaView style={[GlobalStyles.container, styles.background]}>
            <View style={styles.logoSection}>
                <View style={styles.logoBack}>
                    <Image source={require('../../../assets/images/company_logo.png')} style={styles.logo} />
                </View>
            </View>
            {activityIndicator && <ActivityIndicator size={'large'} style={{ position: 'absolute', alignSelf: 'center', bottom: 150, }} />}
            <View style={styles.footerButton}>
                {loginFlag && (
                    <TouchableOpacity
                        style={[GlobalStyles.primaryButton, styles.buttonStyle, GlobalStyles.shadowProp]}
                        onPress={navigateToSignin}
                    >
                        <Text style={[GlobalStyles.primaryLabel, { color: GoDeliveryColors.primary }]}>Get Started</Text>
                    </TouchableOpacity>
                )}
            </View>
        </SafeAreaView>
    );
}

export default SplashScreen;

const styles = StyleSheet.create({
    background: {
        backgroundColor: GoDeliveryColors.primary,
    },
    logoSection: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoBack: {
        width: 250,
        height: 250,
        borderRadius: 300,
        backgroundColor: GoDeliveryColors.white,
        marginBottom: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 270,
        resizeMode: 'contain'
    },
    footerButton: {
        marginBottom: 40,
    },
    buttonStyle: {
        backgroundColor: GoDeliveryColors.white,
    }
})