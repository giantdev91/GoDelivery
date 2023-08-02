import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Text, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator, Alert } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';
import messaging from '@react-native-firebase/messaging';
import { requestLocationPermission } from '../../common/RequestPermission';
import { startBackgroundServiceScheduler } from '../../common/SchedulerService';


interface SignInScreenProps {
    route: any,
    navigation: any;
}

interface HideKeyboardProps {
    children: JSX.Element
}

const HideKeyboard = ({ children }: HideKeyboardProps) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

const SignInScreen = ({ route, navigation }: SignInScreenProps): JSX.Element => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);
    const dispatch = useDispatch();

    // Function to validate phone number
    const validatePhoneNumber = () => {
        const argPhone = String(phone).replace(/[^\d]/g, '');
        if (argPhone.length > 10) {
            setPhoneError('');
            return String('+' + argPhone);
        } else if (argPhone.length == 10) {
            setPhoneError('');
            return String('+91' + argPhone);
        } else {
            setPhoneError('Please insert valid phone number.');
            console.log('Please insert valid phone number.');
            return '';
        }
        return argPhone;
    };

    const storeData = async (userData: any) => {
        try {
            await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
        } catch {
            console.log('error occured!');
        }
    }

    const signInUser = async () => {
        try {
            if (!(phone && password)) {
                return;
            }
            setActivityIndicator(true);
            const argPhone = validatePhoneNumber();

            if (argPhone) {
                //get the fcmToken when client login
                const token = await messaging().getToken();

                Action.authentication.login({ phone: phone.replace('+', ''), password: password })
                    .then(response => {
                        const responseData = response.data;
                        console.log('responseData ==> ', responseData);
                        if (responseData.success) {
                            dispatch(allActions.UserAction.setUser(responseData.data.delivery_man));
                            dispatch(allActions.UserAction.setToken(responseData.data.token))
                            storeData(responseData.data.client);
                            Action.deliveryman.updateFcmToken({ deliverymanID: responseData.data.delivery_man.id, fcmToken: token })
                                .then((res) => {
                                    const response = res.data;
                                    console.log('response ===> ', response);
                                    const result = requestLocationPermission();
                                    result.then(res => {
                                        startBackgroundServiceScheduler();
                                        console.log('res ===> ', res);
                                        if (res) {
                                            navigation.reset({
                                                index: 0,
                                                routes: [{ name: 'Main', params: { initialIndex: 0 } }],
                                            });
                                        }
                                    });
                                }).catch((err) => {
                                    console.log('error: ', err);
                                })

                        }
                        else if (responseData.status == "error") {
                            Alert.alert(responseData.message);
                        }
                        setActivityIndicator(false);
                    }).catch(error => {
                        console.log('error: ', error);
                        setActivityIndicator(false);
                    })
            } else {
                setActivityIndicator(false);
            }
        } catch (error) {
            console.log('error: ', error);
            setActivityIndicator(false);
        }
    };

    return (
        <SafeAreaView style={[GlobalStyles.container]}>
            <View style={styles.headerSection}>
                <Image source={require('../../../assets/images/company_logo.png')}
                    style={styles.logo}
                />
            </View>
            <ScrollView style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]} >
                <View style={{ height: 350, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ flex: 1, }}>
                            <PhoneInput
                                containerStyle={{ padding: 0, height: 55, borderRadius: 30, width: '100%' }}
                                textContainerStyle={{ borderTopRightRadius: 30, borderBottomRightRadius: 30 }}
                                textInputStyle={{ padding: 0 }}
                                defaultValue={phone}
                                defaultCode='MZ'
                                onChangeFormattedText={text => setPhone(text)}
                                withShadow
                            />
                        </View>
                        <View style={styles.checkIconArea}>
                            <Icons
                                name="checkmark-outline"
                                size={25}
                                color={GoDeliveryColors.green}
                            />
                        </View>
                    </View>
                    <Text style={styles.textFieldErrorMsgArea}>
                        {phoneError}
                    </Text>
                    <PasswordInput handler={(val) => { setPassword(val) }} />
                    <View style={styles.textFieldErrorMsgArea}>
                    </View>
                </View>
                <View style={{ marginBottom: 80 }}>
                    <PrimaryButton buttonText='Login' handler={signInUser} />
                </View>
                {activityIndicator && <ActivityIndicator size={'large'} style={{ position: 'absolute', alignSelf: 'center', bottom: 150, }} />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        backgroundColor: GoDeliveryColors.white,
        alignItems: 'center',
        height: 150,
        justifyContent: 'center'
    },
    logo: {
        width: 320,
        resizeMode: 'contain',
    },
    tabLabelStyle: {
        fontSize: 16,
        fontWeight: "600",
    },
    textFieldErrorMsgArea: {
        height: 35,
        paddingLeft: 20,
        color: 'red'
    },
    footerTitleBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    checkIconArea: {
        width: 35,
        alignItems: 'flex-end'
    }
})

export default SignInScreen;