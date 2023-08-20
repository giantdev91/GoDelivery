import React, {useEffect, useState} from 'react';
import {
  View,
  useWindowDimensions,
  Image,
  StyleSheet,
  Dimensions,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  TabView,
  SceneMap,
  TabBar,
  SceneRendererProps,
  NavigationState,
} from 'react-native-tab-view';
import Icons from 'react-native-vector-icons/Ionicons';
import PhoneInput from 'react-native-phone-number-input';
import AsyncStorage from '@react-native-async-storage/async-storage';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import CustomizedInput from '../../components/CustomizedInput';
import PasswordInput from '../../components/PasswordInput';
import PrimaryButton from '../../components/PrimaryButton';
import {TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import {useSelector, useDispatch} from 'react-redux';
import Action from '../../service';
import allActions from '../../redux/actions';
import TwillioService from '../../service/TwillioService';

const SignUpScreen = ({route, navigation}: {route: any; navigation: any}) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);

  const validateInputForm = () => {
    let valid = true;
    if (!username) {
      setUsernameError('Please insert username.');
      valid = false;
    } else {
      setUsernameError('');
    }
    if (!password) {
      setPasswordError('Please set password');
      valid = false;
    } else {
      setPasswordError('');
    }
    if (!confirmPassword) {
      setConfirmPasswordError('Please confirm password.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
    if (password != confirmPassword) {
      setConfirmPasswordError('password mismatch.');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
    return valid;
  };

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

  const navigateToOTP = async () => {
    setActivityIndicator(true);
    if (validateInputForm()) {
      const argPhone = validatePhoneNumber();
      if (argPhone) {
        Action.authentication
          .phoneCheck({phone: phone.replace('+', '')})
          .then(async res => {
            const responseData = res.data;
            if (responseData.success) {
              const param = {
                phone: phone,
                password: password,
                name: username,
              };
              if (await TwillioService.sendSMSVerfication(argPhone)) {
                setActivityIndicator(false);
                navigation.navigate('OTP', param);
              } else {
                Alert.alert('Phone number valid failed');
                setActivityIndicator(false);
              }
            } else {
              Alert.alert(responseData.message);
              setActivityIndicator(false);
            }
          })
          .catch(err => {
            setActivityIndicator(false);
          });
      } else {
        setActivityIndicator(false);
      }
    } else {
      setActivityIndicator(false);
      return;
    }
  };

  const navigateToSignin = () => {
    navigation.navigate('SignIn');
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
        <View style={{height: 350, justifyContent: 'center'}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View style={{flex: 1}}>
              <PhoneInput
                containerStyle={{
                  padding: 0,
                  height: 55,
                  borderRadius: 30,
                  width: '100%',
                  borderWidth: 1,
                  borderColor: GoDeliveryColors.disabled,
                }}
                textContainerStyle={{
                  borderTopRightRadius: 30,
                  borderBottomRightRadius: 30,
                }}
                textInputStyle={{padding: 0}}
                defaultValue={phone}
                defaultCode="MZ"
                onChangeFormattedText={text => setPhone(text)}
                withShadow
              />
            </View>
            <View style={styles.checkIconArea}>
              {phone && (
                <Icons
                  name="checkmark-outline"
                  size={25}
                  color={GoDeliveryColors.green}
                />
              )}
            </View>
          </View>
          <Text style={styles.textFieldErrorMsgArea}>{phoneError}</Text>
          <CustomizedInput
            icon="person-outline"
            placeHolder="User Name"
            val={username}
            handler={val => {
              setUsername(val);
            }}
          />
          <Text style={styles.textFieldErrorMsgArea}>{usernameError}</Text>
          <PasswordInput handler={val => setPassword(val)} />
          <Text style={styles.textFieldErrorMsgArea}>{passwordError}</Text>
          <PasswordInput
            placeholder="Confirm Password"
            handler={val => setConfirmPassword(val)}
          />
          <Text style={styles.textFieldErrorMsgArea}>
            {confirmPasswordError}
          </Text>
        </View>
        {activityIndicator && (
          <ActivityIndicator
            size="large"
            style={{position: 'absolute', alignSelf: 'center', bottom: 300}}
          />
        )}
        <View style={{marginBottom: 80}}>
          <PrimaryButton buttonText="SignUp" handler={navigateToOTP} />
          <View style={{marginTop: 30}}>
            <TouchableOpacity
              style={styles.footerTitleBack}
              onPress={navigateToSignin}>
              <Text style={GlobalStyles.primaryEmphasizeLabel}>
                You have an account ?{' '}
              </Text>
              <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>
                SignIn
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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

export default SignUpScreen;
