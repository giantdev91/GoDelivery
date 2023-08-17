import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Alert } from 'react-native';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import OTPInputView from '@twotalltotems/react-native-otp-input'
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import BackButton from '../../components/BackButton';
import PrimaryButton from '../../components/PrimaryButton';
import TwillioService from '../../service/TwillioService';
import { ActivityIndicator } from 'react-native';
import Action from '../../service';

interface ScreenProps {
    route: any,
    navigation: any;
}

const OTPScreen = ({ route, navigation }: ScreenProps): JSX.Element => {

    const { phone, name, password } = route.params;
    const initialCount = 30;
    const [count, setCount] = useState(initialCount);
    const [value, setValue] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

    const navigateToLogin = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'SignIn', params: { initialIndex: 0 } }],
        });
    }

    const confirmCode = async () => {
        setActivityIndicator(true);
        if (await TwillioService.checkVerification(phone, value)) {
            const param = {
                phone: phone.replace('+', ''),
                name: name,
                password: password,
            }
            Action.authentication.signup(param)
                .then(response => {
                    const responseData = response.data;
                    if (responseData.success) {
                        setActivityIndicator(false);
                        navigateToLogin();
                    } else {
                        Alert.alert(responseData.message);
                        setActivityIndicator(false);
                    }
                }).catch(error => {
                    setActivityIndicator(false);
                })
        } else {
            setActivityIndicator(false);
            Alert.alert("Validation failed. Try again.");
        }
    }

    const resendCode = async () => {
        setActivityIndicator(true);
        await TwillioService.sendSMSVerfication(phone);
        setCount(initialCount);
        downCounter();
        setActivityIndicator(false);
    };

    const downCounter = () => {
        const intervalId = setInterval(() => {
            setCount(prev => {
                if (prev === 1) {
                    clearInterval(intervalId);
                }
                return prev - 1;
            });
        }, 1000);
    }

    useEffect(() => {
        downCounter();
    }, [])

    // setDownTimeCounter();

    const prependZero = (value: number) => {
        return value < 10 ? `0${value}` : value;
    };

    return (
        <View style={[GlobalStyles.container]}>
            <View style={GlobalStyles.authenticationScreenLogoBack}>
                <BackButton navigation={navigation} />
                <Image source={require('../../../assets/images/company-logo-white.png')}
                    style={GlobalStyles.authenticationScreenLogo}
                />
            </View>
            <View style={[{ flex: 1, paddingHorizontal: 20, paddingVertical: 30, flexDirection: 'column', alignItems: 'center' }]}>
                <View style={{ paddingHorizontal: 40, alignItems: 'center', paddingBottom: 20 }}>
                    <Text style={styles.titleLabelStyle}> OTP Verification</Text>
                    <Text style={[styles.labelStyle, { marginVertical: 10 }]}>We will send you a one time password on this <Text style={{ fontWeight: "700" }}>Mobile Number</Text></Text>
                    <Text style={{ fontSize: 15, fontWeight: '700' }}>{phone}</Text>
                </View>
                <View style={{ width: 450, height: 70, paddingHorizontal: 80, }}>
                    <OTPInputView
                        autoFocusOnLoad={false}
                        pinCount={6}
                        style={{ borderColor: 'black', }}
                        code={value}
                        onCodeChanged={code => setValue(code)}
                        onCodeFilled={code => setValue(code)}
                        codeInputFieldStyle={{
                            borderColor: GoDeliveryColors.primary,
                            borderRadius: 100,
                            color: GoDeliveryColors.secondary,
                        }} />
                </View>
                {activityIndicator && (
                    <ActivityIndicator
                        size="large"
                        style={{ position: 'absolute' }}
                    />
                )}
                <View style={{ alignItems: 'center', marginVertical: 20 }}>
                    <Text style={styles.smallLabelStyle}>00.{prependZero(count)}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                        <Text style={[styles.smallLabelStyle,
                        { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
                        { color: count === 0 ? GoDeliveryColors.secondary : GoDeliveryColors.disabled }
                        ]}>Do not send OTP?

                        </Text>
                        <TouchableOpacity style={{ marginLeft: 10, }} disabled={count > 0} onPress={resendCode}>
                            <Text style={[styles.smallLabelStyle, { color: count == 0 ? GoDeliveryColors.primary : GoDeliveryColors.primayDisabled }]}>Send OTP</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ width: '100%', margin: 20 }}>
                    <PrimaryButton buttonText='Submit' handler={confirmCode} />
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