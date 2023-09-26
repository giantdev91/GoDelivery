import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Image,
  ImageBackground,
} from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import Action from '../../service';
import allActions from '../../redux/actions';

const SplashScreen = ({ navigation }: { navigation: any }): JSX.Element => {
  const [loginFlag, setLoginFlag] = useState(false);
  const [activityIndicator, setActivityIndicator] = useState(true);
  const dispatch = useDispatch();

  const navigateToSignin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn' }],
    });
  };

  const navigateToSignup = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignUp' }],
    });
  };

  const checkUserLoginStatus = async () => {
    const userDataStr = await AsyncStorage.getItem('CLIENT_DATA');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      Action.client
        .getById({ id: userData.id })
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
          console.log('error: ', err);
          setActivityIndicator(false);
        });
    } else {
      setActivityIndicator(false);
      setLoginFlag(true);
    }
  };

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('CLIENT_DATA', JSON.stringify(userData));
    } catch {
      console.log('error occured!');
    }
  };

  useEffect(() => {
    checkUserLoginStatus();
  });

  return (
    <ImageBackground
      source={require('../../../assets/images/splash.png')}
      style={GlobalStyles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoBack}>
          <Text style={styles.headerTitle}>Let's Go</Text>
          <Image
            source={require('../../../assets/images/new-logo-white.png')}
            style={styles.logo}
          />
        </View>
      </View>
      {activityIndicator && (
        <ActivityIndicator
          size={'large'}
          style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
        />
      )}
      <View style={styles.footerButton}>
        {loginFlag && (
          <View style={{ gap: 30 }}>
            <TouchableOpacity
              style={[
                GlobalStyles.primaryButton,
                styles.buttonStyle,
                GlobalStyles.shadowProp,
              ]}
              onPress={navigateToSignin}>
              <Text
                style={[
                  styles.buttonText,
                  { color: GoDeliveryColors.primary },
                ]}>
                Login
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                GlobalStyles.primaryButton,
                styles.signupButton,
                GlobalStyles.shadowProp,
              ]}
              onPress={navigateToSignup}>
              <Text
                style={[
                  styles.buttonText,
                  { color: GoDeliveryColors.white },
                ]}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ImageBackground>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({

  logoSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBack: {
    marginBottom: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 46,
    fontWeight: '700',
    color: GoDeliveryColors.white
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',

  },
  logo: {
    width: 270,
    resizeMode: 'contain',
  },
  footerButton: {
    marginBottom: 40,
    margin: 20,
  },
  buttonStyle: {
    backgroundColor: GoDeliveryColors.white,
  },
  signupButton: {
    backgroundColor: GoDeliveryColors.primary,
    borderWidth: 2,
    borderColor: GoDeliveryColors.white
  }
});
