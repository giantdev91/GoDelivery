/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect } from 'react';
import {
  useColorScheme,
  Alert,
  PermissionsAndroid
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from './src/screens/authentication/Splash';
import SignInScreen from './src/screens/authentication/SignIn';
import DrawerNavigator from './src/navigators/DrawerNavigator';

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { enableLatestRenderer } from 'react-native-maps';
import messaging from '@react-native-firebase/messaging';

const Stack = createNativeStackNavigator();
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

function App(): JSX.Element {

  enableLatestRenderer();

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };




  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(remoteMessage?.notification?.title ?? "", remoteMessage?.notification?.body);
    });
    return unsubscribe;
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="Splash" component={SplashScreen} />
            <Stack.Screen name="SignIn" component={SignInScreen} />
            <Stack.Screen name="Main" component={DrawerNavigator} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
