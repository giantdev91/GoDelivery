import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import PasswordInput from '../../components/PasswordInput';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import LargeLabelButton from '../../components/LargeLabelButton';

const SignInScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);
  const dispatch = useDispatch();

  // Function to validate phone number
  const validatePhoneNumber = () => {
    const argPhone = String(phone).replace(/[^\d]/g, '');
    if (argPhone.length != 9) {
      setPhoneError('Please insert valid phone number.');
      return '';
    } else {
      const prefix = Number.parseInt(argPhone.substring(0, 2));
      if (prefix > 81 && prefix < 88) {
        setPhoneError('');
        return `+258${argPhone}`;
      } else {
        setPhoneError('Please insert valid phone number.');
        return '';
      }
    }
  };

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('CLIENT_DATA', JSON.stringify(userData));
    } catch {
      console.log('error occured!');
    }
  };

  const signInUser = async () => {
    try {
      if (!(phone && password)) {
        return;
      }
      setActivityIndicator(true);
      const argPhone = validatePhoneNumber();
      //get the fcmToken when client login
      const token = await messaging().getToken();
      if (argPhone) {
        Action.authentication
          .login({ phone: argPhone.replace('+', ''), password: password })
          .then(response => {
            const responseData = response.data;
            if (responseData.success) {
              dispatch(allActions.UserAction.setUser(responseData.data.client));
              dispatch(allActions.UserAction.setToken(responseData.data.token));
              storeData(responseData.data.client);

              Action.client
                .updateFcmToken({
                  clientID: responseData.data.client.id,
                  fcmToken: token,
                })
                .then(res => {
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main', params: { initialIndex: 0 } }],
                  });
                })
                .catch(err => {
                  console.log('error: ', err);
                });
            } else {
              Alert.alert('GoDelivery', responseData.message);
            }
            setActivityIndicator(false);
          })
          .catch(error => {
            console.log('error ===> ', error);
            setActivityIndicator(false);
          });
      } else {
        setActivityIndicator(false);
      }
    } catch (error) {
      console.log('error ===> ', error);
      setActivityIndicator(false);
    }
  };

  const navigateToSignup = () => {
    navigation.navigate('SignUp');
  };

  const navigateToForgetPassword = () => {
    navigation.navigate('ForgetPassword');
  };

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
      <ScrollView>
        <View style={GlobalStyles.authenticationScreenLogoBack}>
          <Image
            source={require('../../../assets/images/login.png')}
            style={GlobalStyles.authenticationScreenLogo}
          />
        </View>
        <View
          style={[GlobalStyles.container, GlobalStyles.contentAreaPadding, { backgroundColor: GoDeliveryColors.white }]}>
          <View style={{ justifyContent: 'flex-start', }}>
            <Text style={GlobalStyles.authenticationHeaderTitle}>LOGIN</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{ flex: 1 }}>
                <CustomizedPhoneInput value={phone} handler={setPhone} placeholder='phone number' error={phoneError.length > 0} />
              </View>
            </View>
            <Text style={GlobalStyles.textFieldErrorMsgArea}>{phoneError}</Text>
            <PasswordInput
              handler={val => {
                setPassword(val);
              }}
            />
            <View style={{ marginTop: 20 }}>
              <TouchableOpacity
                style={styles.footerTitleBack}
                onPress={navigateToForgetPassword}>
                <Text style={GlobalStyles.primaryEmphasizeLabel}>
                  Forgot Your Password?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, marginBottom: 30, justifyContent: 'flex-end', marginTop: 110 }}>
            <LargeLabelButton buttonText="Login" handler={signInUser} />
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={styles.footerTitleBack}
                onPress={navigateToSignup}>
                <Text style={GlobalStyles.primaryEmphasizeLabel}>
                  You don’t have an account ?{' '}
                </Text>
                <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {activityIndicator && (
            <ActivityIndicator
              size={'large'}
              style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footerTitleBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SignInScreen;
