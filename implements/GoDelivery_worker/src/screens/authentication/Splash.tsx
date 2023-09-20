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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native';
import Action from '../../service';
import allActions from '../../redux/actions';
import { startBackgroundServiceScheduler } from '../../common/SchedulerService';

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
      routes: [{ name: 'SignIn' }],
    });
  };

  const checkUserLoginStatus = async () => {
    const userDataStr = await AsyncStorage.getItem('USER_DATA');
    if (userDataStr) {
      const userData = JSON.parse(userDataStr);
      Action.deliveryman
        .getById(userData.id)
        .then(response => {
          const responseData = response.data;
          dispatch(allActions.UserAction.setUser(responseData.data));
          storeData(responseData.data);
          setActivityIndicator(false);
          startBackgroundServiceScheduler();
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
          });
        })
        .catch(err => {
          setActivityIndicator(false);
        });
    } else {
      setActivityIndicator(false);
      setLoginFlag(true);
    }
  };

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
    } catch {
      console.error('error occured!');
    }
  };

  useEffect(() => {
    checkUserLoginStatus();
  }, []);

  return (
    <ImageBackground
      source={require('../../../assets/images/splash.png')}
      style={GlobalStyles.container}>
      <View style={styles.logoSection}>
        <View style={styles.logoBack}>
          <Image
            source={require('../../../assets/images/company-logo-white.png')}
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
          <TouchableOpacity
            style={[
              GlobalStyles.primaryButton,
              styles.buttonStyle,
              GlobalStyles.shadowProp,
            ]}
            onPress={navigateToSignin}>
            <Text
              style={[
                GlobalStyles.primaryLabel,
                { color: GoDeliveryColors.primary },
              ]}>
              START
            </Text>
          </TouchableOpacity>
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
});
