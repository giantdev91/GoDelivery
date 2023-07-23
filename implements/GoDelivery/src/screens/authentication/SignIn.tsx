import React, { useEffect } from 'react';
import { View, useWindowDimensions, Image, StyleSheet, Dimensions, Text, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { TabView, SceneMap, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import CustomizedInput from '../../components/CustomizedInput';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

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
    const navigation = useNavigation();

    const navigateToSignup = () => {
        props.jumpTo('signUp');
    }

    const navigateToMain = () => {
        navigation.navigate('Main');
    }

    return (
        <View style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]} >
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <CustomizedInput icon='call-outline' placeHolder='Phone number' keyboardType='number' />
                <View style={styles.textFieldErrorMsgArea}>
                </View>
                <PasswordInput />
                <View style={styles.textFieldErrorMsgArea}>
                </View>
            </View>
            <View>
                <PrimaryButton buttonText='Login' handler={navigateToMain} />
                <View style={{ marginTop: 30 }}>
                    <TouchableOpacity style={styles.footerTitleBack} onPress={navigateToSignup}>
                        <Text style={GlobalStyles.primaryEmphasizeLabel}>You  don’t have an account ? </Text>
                        <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>Sign Up </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
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
        <View style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]} >
            <View style={{ flex: 1, justifyContent: 'center' }}>
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
        </View>
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
        <View style={[GlobalStyles.container]}>
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
        </View>
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
    },
    footerTitleBack: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
})

export default SignInScreen;