import React, { useEffect, useState } from 'react';
import { View, useWindowDimensions, Image, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Keyboard, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';
import Icons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import CustomizedInput from '../../components/CustomizedInput';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';

interface SignInScreenProps {
    route: any,
    navigation: any;
}

interface HideKeyboardProps {
    children: JSX.Element
}

interface SceneProps {
    jumpTo: (key: string) => void;
}

const HideKeyboard = ({ children }: HideKeyboardProps) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

const SignInRoute = (props: SceneProps) => {
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);
    const dispatch = useDispatch();
    const navigation = useNavigation();

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
                Action.authentication.login({ phone: phone.replace('+', ''), password: password })
                    .then(response => {
                        console.log('response body ===> ', response.data);
                        const responseData = response.data;
                        if (responseData.status == "success") {
                            console.log('responseData ===> ', responseData);
                            dispatch(allActions.UserAction.setUser(responseData.data));
                            storeData(responseData.data);
                            navigation.navigate('Main');
                        }
                        else if (responseData.status == "error") {
                            Alert.alert(responseData.message);
                        }
                        setActivityIndicator(false);
                    }).catch(error => {
                        console.log('error ===> ', error);
                        setActivityIndicator(false);
                    })
            } else {
                setActivityIndicator(false);
            }
        } catch (error) {
            console.log('error ===> ', error);
            setActivityIndicator(false);
        }
    };

    const navigateToSignup = () => {
        props.jumpTo('signUp');
    }

    return (
        <ScrollView style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]} >

            <View style={{ height: 300, justifyContent: 'center' }}>
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
            <View>
                <PrimaryButton buttonText='Login' handler={signInUser} />
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity style={styles.footerTitleBack} onPress={navigateToSignup}>
                        <Text style={GlobalStyles.primaryEmphasizeLabel}>You  don’t have an account ? </Text>
                        <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>Sign Up </Text>
                    </TouchableOpacity>
                </View>
            </View>
            {activityIndicator && <ActivityIndicator size={'large'} style={{ position: 'absolute', alignSelf: 'center', bottom: 150, }} />}
        </ScrollView>
    );
};

const SignUpRoute = (props: SceneProps) => {
    const navigation = useNavigation();

    const navigateToSignin = () => {
        props.jumpTo('signIn');
    }
    const navigateToOTP = () => {
        navigation.navigate('OTP');
    }
    return (
        <ScrollView style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]} >
            <View style={{ height: 300, justifyContent: 'center' }}>
                <CustomizedInput icon='call-outline' placeHolder='Phone number' keyboardType='number' />
                <View style={styles.textFieldErrorMsgArea}>
                </View>
                <PasswordInput />
                <View style={styles.textFieldErrorMsgArea}>
                </View>
                <PasswordInput />
                <View style={styles.textFieldErrorMsgArea}>
                </View>
            </View>
            <View>
                <PrimaryButton buttonText='Register' handler={navigateToOTP} />
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity style={styles.footerTitleBack} onPress={navigateToSignin}>
                        <Text style={GlobalStyles.primaryEmphasizeLabel}>You  have an account ? </Text>
                        <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>Login</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const SignInScreen = ({ route, navigation }: SignInScreenProps): JSX.Element => {
    const { initialIndex } = route.params ?? 0;
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(initialIndex);
    const [routes] = React.useState([
        { key: 'signIn', title: 'SignIn' },
        { key: 'signUp', title: 'SignUp' },
    ]);
    const renderScene = SceneMap({
        signIn: SignInRoute,
        signUp: SignUpRoute,
    });

    const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> }) => (
        <TabBar
            {...props}
            activeColor={GoDeliveryColors.primary}
            inactiveColor={GoDeliveryColors.disabled}
            indicatorStyle={{ backgroundColor: GoDeliveryColors.primary, height: 5, width: 120, borderRadius: 10, marginLeft: (Dimensions.get('screen').width - 240) / 4 }}
            style={{ backgroundColor: 'white', borderBottomRightRadius: 20, borderBottomLeftRadius: 20, }}
            labelStyle={styles.tabLabelStyle}
        />
    );

    return (

        <SafeAreaView style={[GlobalStyles.container]}>
            <View style={styles.headerSection}>
                <Image source={require('../../../assets/images/company_logo.png')}
                    style={styles.logo}
                />
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: layout.width }}
            />

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    headerSection: {
        backgroundColor: GoDeliveryColors.white,
        alignItems: 'center',
        height: 200,
        justifyContent: 'center'
    },
    logo: {
        width: 380,
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