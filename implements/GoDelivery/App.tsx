import React, {useEffect, useState, useCallback} from 'react';
import {
  PermissionsAndroid,
  useColorScheme,
  Alert,
  BackHandler,
  StatusBar,
  StyleSheet,
  StatusBarStyle,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SplashScreen from './src/screens/authentication/Splash';
import SignInScreen from './src/screens/authentication/SignIn';
import SignUpScreen from './src/screens/authentication/SignUp';
import OTPScreen from './src/screens/authentication/OTP';
import TabNavigator from './src/navigators/TabNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider} from 'react-redux';
import store from './src/redux/store';
import Modal from 'react-native-modal';
import {enableLatestRenderer} from 'react-native-maps';
import messaging from '@react-native-firebase/messaging';
import ForgetPasswordScreen from './src/screens/authentication/ForgetPassword';
import ForgotOTPCheckScreen from './src/screens/authentication/ForgotOTPCheck';
import ResetPasswordScreen from './src/screens/authentication/ResetPassword';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import HomeStackNavigator from './src/navigators/HomeStackNavigator';
import GoDeliveryColors from './src/styles/colors';
import GlobalStyles from './src/styles/style';
import AsyncStorage from '@react-native-async-storage/async-storage';

PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

// Register background handler
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Message handled in the background!', remoteMessage);
// });

const Stack = createNativeStackNavigator();

const STYLES = ['default', 'dark-content', 'light-content'] as const;
const TRANSITIONS = ['fade', 'slide', 'none'] as const;

function App(): JSX.Element {
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>(
    STYLES[1],
  );
  const [statusBarTransition, setStatusBarTransition] = useState<
    'fade' | 'slide' | 'none'
  >(TRANSITIONS[0]);
  const [isModalVisible, setModalVisible] = useState(false);

  enableLatestRenderer();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const backAction = () => {
    setModalVisible(true);
    return true;
  };

  const handleRemoteMessage = (remoteMessage: any) => {
    const messageType = remoteMessage?.data?.notifType;
    const orderId = remoteMessage?.data?.orderId;
    const title = remoteMessage?.notification?.title;
    const body = remoteMessage?.notification?.body;
    AsyncStorage.setItem('NOTIFICATION', JSON.stringify(remoteMessage));
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          handleRemoteMessage(remoteMessage);
        }
      });

    return () => {
      backHandler.remove();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Provider store={store}>
        <SafeAreaProvider>
          <StatusBar
            animated={true}
            backgroundColor={GoDeliveryColors.white}
            barStyle={statusBarStyle}
            showHideTransition={statusBarTransition}
          />
          <NavigationContainer>
            <Stack.Navigator
              screenOptions={{
                headerShown: false,
              }}>
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Main" component={HomeStackNavigator} />
              <Stack.Screen name="SignIn" component={SignInScreen} />
              <Stack.Screen name="SignUp" component={SignUpScreen} />
              <Stack.Screen
                name="ForgetPassword"
                component={ForgetPasswordScreen}
              />
              <Stack.Screen
                name="ForgotOTPCheck"
                component={ForgotOTPCheckScreen}
              />
              <Stack.Screen
                name="ResetPassword"
                component={ResetPasswordScreen}
              />
              <Stack.Screen name="OTP" component={OTPScreen} />
              {/* <Stack.Screen name="HomeStackNavigator" component={HomeStackNavigator} /> */}
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>

      <Modal isVisible={isModalVisible}>
        <View style={styles.alertDialog}>
          <Text style={GlobalStyles.subTitle}>Hold on!</Text>
          <Text style={[GlobalStyles.textMedium, {marginTop: 10}]}>
            Are you sure you want to exit?
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 40,
              marginTop: 30,
            }}>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text
                style={[
                  GlobalStyles.textMedium,
                  {color: GoDeliveryColors.primary},
                ]}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                BackHandler.exitApp();
              }}>
              <Text
                style={[
                  GlobalStyles.textMedium,
                  {color: GoDeliveryColors.primary},
                ]}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ECF0F1',
  },
  buttonsContainer: {
    padding: 10,
  },
  textStyle: {
    textAlign: 'center',
    marginBottom: 8,
  },
  alertDialog: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: GoDeliveryColors.white,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default App;
