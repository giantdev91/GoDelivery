import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from 'react-native-alert-notification';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch} from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';
import messaging from '@react-native-firebase/messaging';
import {requestLocationPermission} from '../../common/RequestPermission';
import {startBackgroundServiceScheduler} from '../../common/SchedulerService';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import CustomIndicator from '../../common/CustomIndicator';

interface SignInScreenProps {
  route: any;
  navigation: any;
}

const SignInScreen = ({route, navigation}: SignInScreenProps): JSX.Element => {
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
      setPhoneError('');
      return `+258${argPhone}`;
    }
  };

  const storeData = async (userData: any) => {
    try {
      await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
    } catch {
      console.error('error occured!');
    }
  };

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

        Action.authentication
          .login({phone: argPhone.replace('+', ''), password: password})
          .then(response => {
            const responseData = response.data;
            if (responseData.success) {
              dispatch(
                allActions.UserAction.setUser(responseData.data.delivery_man),
              );
              dispatch(allActions.UserAction.setToken(responseData.data.token));
              storeData(responseData.data.delivery_man);

              Action.deliveryman
                .updateFcmToken({
                  deliverymanID: responseData.data.delivery_man.id,
                  fcmToken: token,
                })
                .then(res => {
                  const response = res.data;
                  const result = requestLocationPermission();
                  result.then(res => {
                    startBackgroundServiceScheduler();
                    if (res) {
                      navigation.reset({
                        index: 0,
                        routes: [{name: 'Main', params: {initialIndex: 0}}],
                      });
                    }
                  });
                })
                .catch(err => {
                  console.error('error: ', err);
                });
            } else {
              Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'GoDelivery',
                textBody: responseData.message,
                button: 'OK',
              });
            }
            setActivityIndicator(false);
          })
          .catch(error => {
            console.error('error: ', error);
            setActivityIndicator(false);
          });
      } else {
        setActivityIndicator(false);
      }
    } catch (error) {
      console.error('error: ', error);
      setActivityIndicator(false);
    }
  };

  return (
    <SafeAreaView style={[GlobalStyles.container]}>
      <AlertNotificationRoot>
        <View style={GlobalStyles.authenticationScreenLogoBack}>
          <Image
            source={require('../../../assets/images/company-logo.png')}
            style={GlobalStyles.authenticationScreenLogo}
          />
        </View>
        <ScrollView
          style={[GlobalStyles.container, GlobalStyles.contentAreaPadding]}>
          <View style={{height: 350, justifyContent: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <View style={{flex: 1}}>
                <CustomizedPhoneInput
                  value={phone}
                  handler={setPhone}
                  placeholder="phone number"
                  error={phoneError.length > 0}
                />
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
          <View style={{marginBottom: 80}}>
            <PrimaryButton buttonText="SignIn" handler={signInUser} />
          </View>
          {activityIndicator && <CustomIndicator />}
        </ScrollView>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headerSection: {
    backgroundColor: GoDeliveryColors.white,
    alignItems: 'center',
    height: 150,
    justifyContent: 'center',
  },
  logo: {
    width: 320,
    resizeMode: 'contain',
  },
  tabLabelStyle: {
    fontSize: 14,
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
