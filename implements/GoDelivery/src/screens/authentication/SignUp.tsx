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
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import CustomizedInput from '../../components/CustomizedInput';
import PasswordInput from '../../components/PasswordInput';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Action from '../../service';
import TwillioService from '../../service/TwillioService';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import LargeLabelButton from '../../components/LargeLabelButton';

const SignUpScreen = ({ navigation }: { navigation: any }) => {
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

  const navigateToOTP = async () => {
    setActivityIndicator(true);
    const argPhone = validatePhoneNumber();
    if (validateInputForm()) {
      if (argPhone) {
        Action.authentication
          .phoneCheck({ phone: argPhone.replace('+', '') })
          .then(async res => {
            const responseData = res.data;
            if (responseData.success) {
              const param = {
                phone: argPhone,
                password: password,
                name: username,
              };
              if (await TwillioService.sendSMSVerfication(argPhone)) {
                setActivityIndicator(false);
                navigation.navigate('OTP', param);
              } else {
                Alert.alert("GoDelivery", 'Phone number valid failed');
                setActivityIndicator(false);
              }
            } else {
              Alert.alert("GoDelivery", responseData.message);
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
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
      <ScrollView>
        <View style={GlobalStyles.authenticationScreenLogoBack}>
          <Image
            source={require('../../../assets/images/sign_up.png')}
            style={GlobalStyles.authenticationScreenLogo}
          />
        </View>
        <View
          style={[GlobalStyles.container, GlobalStyles.contentAreaPadding, { backgroundColor: GoDeliveryColors.white }]}>
          <View style={{ justifyContent: 'center' }}>
            <Text style={GlobalStyles.authenticationHeaderTitle}>SIGN UP</Text>
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
            <CustomizedInput
              icon="person-outline"
              placeHolder="User Name"
              val={username}
              handler={val => {
                setUsername(val);
              }}
              error={usernameError.length > 0}
            />
            <Text style={GlobalStyles.textFieldErrorMsgArea}>{usernameError}</Text>
            <PasswordInput handler={val => setPassword(val)} error={passwordError.length > 0} placeholder="Password" />
            <Text style={GlobalStyles.textFieldErrorMsgArea}>{passwordError}</Text>
            <PasswordInput
              placeholder="Confirm Password"
              handler={val => setConfirmPassword(val)}
              error={confirmPasswordError.length > 0}
            />
            <Text style={GlobalStyles.textFieldErrorMsgArea}>
              {confirmPasswordError}
            </Text>
          </View>
          {activityIndicator && (
            <ActivityIndicator
              size="large"
              style={{ position: 'absolute', alignSelf: 'center', bottom: 300 }}
            />
          )}
          <View style={{ marginBottom: 50, }}>
            <LargeLabelButton buttonText="Sign Up" handler={navigateToOTP} />
            <View style={{ marginTop: 10 }}>
              <TouchableOpacity
                style={styles.footerTitleBack}
                onPress={navigateToSignin}>
                <Text style={GlobalStyles.primaryEmphasizeLabel}>
                  You have an account ?{' '}
                </Text>
                <Text style={GlobalStyles.primaryEmphasizeLabelHigher}>
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
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

export default SignUpScreen;
