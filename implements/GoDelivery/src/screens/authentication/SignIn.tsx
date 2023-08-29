import React, { useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { useDispatch } from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';

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

  return (
    <SafeAreaView style={[GlobalStyles.container]}>
      <View style={GlobalStyles.authenticationScreenLogoBack}>
        <Image
          source={require('../../../assets/images/company-logo-white.png')}
          style={GlobalStyles.authenticationScreenLogo}
        />
      </View>
      <ScrollView
        style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]}>
        <View style={{ height: 350, justifyContent: 'center' }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{ flex: 1 }}>
              <CustomizedPhoneInput value={phone} handler={setPhone} placeholder='phone number' error={phoneError.length > 0} />
            </View>
            <View style={styles.checkIconArea}>
              {
                phone && <Icons
                  name="checkmark-outline"
                  size={25}
                  color={GoDeliveryColors.green}
                />
              }
            </View>
          </View>
          <Text style={GlobalStyles.textFieldErrorMsgArea}>{phoneError}</Text>
          <PasswordInput
            handler={val => {
              setPassword(val);
            }}
          />
          <View style={GlobalStyles.textFieldErrorMsgArea}></View>
        </View>
        <View style={{ marginBottom: 80 }}>
          <PrimaryButton buttonText="SignIn" handler={signInUser} />
          <View style={{ marginTop: 30 }}>
            <TouchableOpacity
              style={styles.footerTitleBack}
              onPress={navigateToSignup}>
              <Text style={GlobalStyles.primaryEmphasizeLabel}>
                You don’t have an account ?{' '}
              </Text>
              <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>
                Sign Up{' '}
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
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  tabLabelStyle: {
    fontSize: 16,
    fontWeight: '600',
  },
  textFieldErrorMsgArea: {
    height: 35,
    paddingLeft: 20,
    color: 'red',
  },
  footerTitleBack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIconArea: {
    width: 35,
    alignItems: 'flex-end',
  },
});

export default SignInScreen;
