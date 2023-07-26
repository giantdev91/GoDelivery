import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SplashScreenProps {
    navigation: any;
}

const SplashScreen = ({ navigation }: SplashScreenProps): JSX.Element => {
    const [loginFlag, setLoginFlag] = useState(true);
    const [activityIndicator, setActivityIndicator] = useState(true);
    const dispatch = useDispatch();

    const navigateToSignin = () => {
        navigation.navigate('SignIn', { initialIndex: 0 });
    }

    const checkUserLoginStatus = async () => {
        setActivityIndicator(true);
        const userData = await AsyncStorage.getItem('USER_DATA');
        console.log('userData ===> ', userData);
        if (userData) {

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
            <View style={styles.footerButton}>
                <TouchableOpacity
                    style={[GlobalStyles.primaryButton, styles.buttonStyle, GlobalStyles.shadowProp]}
                    onPress={navigateToSignin}
                >
                    <Text style={[GlobalStyles.primaryLabel, { color: GoDeliveryColors.primary }]}>Get Started</Text>
                </TouchableOpacity>
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