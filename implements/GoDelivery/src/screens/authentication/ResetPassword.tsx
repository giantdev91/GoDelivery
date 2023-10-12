import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import LargeLabelButton from '../../components/LargeLabelButton';
import PasswordInput from '../../components/PasswordInput';
import Action from '../../service';
import CustomIndicator from '../../common/CustomIndicator';

const ResetPasswordScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { phone } = route.params;
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn', params: { initialIndex: 0 } }],
    });
  }

  const validateInputForm = () => {
    let valid = true;
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

  const handleSave = () => {
    if (validateInputForm()) {
      const param = {
        phone: phone,
        password: password,
      }
      setActivityIndicator(true);
      Action.authentication.resetPassword(param)
        .then(res => {
          const response = res.data;
          if (response.success) {
            setActivityIndicator(false);
            navigation.reset({
              index: 0,
              routes: [{ name: 'SignIn' }],
            });
          } else {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'GoDelivery',
              textBody: "Operation failed. Try again.",
              button: 'OK',
            });
            setActivityIndicator(false);
          }
        })
        .catch(err => {
          console.error("error: ", err);
          setActivityIndicator(false);
        })
    }
  }

  useEffect(() => {
  }, [])

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
      <AlertNotificationRoot>
        <ScrollView>
          <View style={GlobalStyles.authenticationScreenLogoBack}>
            <Image
              source={require('../../../assets/images/reset_password.png')}
              style={GlobalStyles.authenticationScreenLogo}
            />
          </View>
          <View
            style={[GlobalStyles.container, GlobalStyles.contentAreaPadding, { backgroundColor: GoDeliveryColors.white, }]}>
            <View style={{ justifyContent: 'flex-start', }}>
              <Text style={GlobalStyles.authenticationHeaderTitle}>CREATE NEW PASSWORD</Text>
              <Text style={[GlobalStyles.text, { textAlign: 'center', paddingHorizontal: 40, marginBottom: 20, }]}>
                Please enter your new password below
              </Text>
              <PasswordInput handler={val => setPassword(val)} error={passwordError.length > 0} placeholder='New Password' />
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
            <View style={{ flex: 1, marginBottom: 50, justifyContent: 'flex-end', marginTop: 110 }}>
              <LargeLabelButton buttonText="Save" handler={handleSave} />
            </View>
            {activityIndicator && (
              <CustomIndicator />
            )}
          </View>
        </ScrollView>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
});

export default ResetPasswordScreen;
