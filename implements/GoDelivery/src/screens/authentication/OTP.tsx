import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';

interface ScreenProps {
    navigation: any;
}

const OTPScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const navigateToLogin = () => {
        navigation.pop();
        navigation.pop();
        navigation.navigate('SignIn', { initialIndex: 0 });
        // navigation.goBack();
    }

    const handleSubmit = () => {
        console.log("this is called!!!");
        navigation.navigate('Main');
    }

    return (
        <View style={[GlobalStyles.container]}>
            <View style={styles.headerSection}>
                <BackButton navigation={navigation} />
                <Image source={require('../../../assets/images/company_logo.png')}
                    style={styles.logo}
                />
            </View>
            <View style={[{ flex: 1, padding: 30, flexDirection: 'column', alignItems: 'center' }]}>
                <View style={{ paddingHorizontal: 40, alignItems: 'center', paddingBottom: 20 }}>
                    <Text style={styles.titleLabelStyle}> OTP Verification</Text>
                    <Text style={[styles.labelStyle, { marginVertical: 10 }]}>We will send you a one time password on this <Text style={{ fontWeight: "700" }}>Mobile Number</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight: '700' }}>+1 - 5039287830</Text>
                </View>
                <View style={{ width: 400, height: 70, paddingHorizontal: 80, }}>
                    <OTPInputView
                        pinCount={4}
                        style={{ borderColor: 'black', }}
                        codeInputFieldStyle={{
                            borderColor: GoDeliveryColors.primary,
                            borderRadius: 100,
                            color: GoDeliveryColors.secondary,
                        }} />
                </View>
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Text style={styles.smallLabelStyle}>00.30</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <Text style={[styles.smallLabelStyle, { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }]}>Do not send OTP?

                        </Text>
                        <TouchableOpacity style={{ marginLeft: 10, }}>
                            <Text style={[styles.smallLabelStyle, { color: GoDeliveryColors.primary }]}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View>
                    <PrimaryButton buttonText='Submit' handler={handleSubmit} />
                    <View style={{ marginTop: 30 }}>
                        <TouchableOpacity style={styles.footerTitleBack} onPress={navigateToLogin}>
                            <Text style={GlobalStyles.primaryEmphasizeLabel}>You  have an account ? </Text>
                            <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        backgroundColor: GoDeliveryColors.white,
        alignItems: 'center',
        height: 250,
        justifyContent: 'center',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    logo: {
        width: 380,
        resizeMode: 'contain',
    },
    titleLabelStyle: {
        fontSize: 22,
        fontWeight: "700",
    },
    labelStyle: {
        fontSize: 15,
        fontWeight: "500",
        textAlign: 'center'
    },
    smallLabelStyle: {
        fontSize: 12,
        fontWeight: "400",
        color: GoDeliveryColors.disabled
    },
    footerTitleBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default OTPScreen;