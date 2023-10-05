import React, { useEffect, useState } from 'react';
import {
  View,
  Image,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LargeLabelButton from '../../components/LargeLabelButton';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import TwillioService from '../../service/TwillioService';
import OTPInputView from '@twotalltotems/react-native-otp-input';

const BackButton = ({ navigation }: {
  navigation: any
}): JSX.Element => {

  const backButtonHandler = () => {
    navigation.goBack();
  }
  return (
    <TouchableOpacity
      style={styles.backButtonBack}
      onPress={backButtonHandler}
    >
      <FontAwesomeIcon
        name="chevron-left"
        size={30}
        color={GoDeliveryColors.primary}
      />
    </TouchableOpacity>
  )
}

const ForgotOTPCheckScreen = ({ route, navigation }: { route: any; navigation: any }) => {
  const { phone } = route.params;
  const initialCount = 30;
  const [count, setCount] = useState(initialCount);
  const [value, setValue] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);

  const navigateToLogin = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'SignIn', params: { initialIndex: 0 } }],
    });
  }

  const confirmCode = async () => {
    setActivityIndicator(true);
    if (await TwillioService.checkVerification(phone, value)) {
      const param = {
        phone: phone.replace('+', ''),
      }
      navigation.navigate("ResetPassword", param);
      setActivityIndicator(false);
    } else {
      setActivityIndicator(false);
      Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'GoDelivery',
        textBody: "Validation failed. Try again.",
        button: 'OK',
      })
    }
  }

  const resendCode = async () => {
    setActivityIndicator(true);
    await TwillioService.sendSMSVerfication(phone);
    setCount(initialCount);
    downCounter();
    setActivityIndicator(false);
  };

  const downCounter = () => {
    const intervalId = setInterval(() => {
      setCount(prev => {
        if (prev === 1) {
          clearInterval(intervalId);
        }
        return prev - 1;
      });
    }, 1000);
  }

  useEffect(() => {
    downCounter();
  }, [])

  const prependZero = (value: number) => {
    return value < 10 ? `0${value}` : value;
  };

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
      <AlertNotificationRoot>
        <View style={GlobalStyles.authenticationScreenLogoBack}>
          <Image
            source={require('../../../assets/images/otpcode.png')}
            style={GlobalStyles.authenticationScreenLogo}
          />
          <BackButton navigation={navigation} />
        </View>
        <View
          style={[GlobalStyles.container, GlobalStyles.contentAreaPadding, { backgroundColor: GoDeliveryColors.white, }]}>
          <View style={{ justifyContent: 'flex-start', }}>
            <Text style={GlobalStyles.authenticationHeaderTitle}>INSERT OTP CODE</Text>
            <Text style={[GlobalStyles.text, { textAlign: 'center', paddingHorizontal: 40, marginBottom: 20, }]}>
              Please enter the 6 digit code sent to your phone number
            </Text>
            <View style={{ width: 450, height: 70, paddingHorizontal: 80, alignSelf: 'center' }}>
              <OTPInputView
                autoFocusOnLoad={false}
                pinCount={6}
                style={{ borderColor: 'black', }}
                code={value}
                onCodeChanged={code => setValue(code)}
                onCodeFilled={code => setValue(code)}
                codeInputFieldStyle={{
                  borderColor: GoDeliveryColors.primary,
                  borderRadius: 100,
                  color: GoDeliveryColors.secondary,
                }} />
            </View>
            <View style={{ alignItems: 'center', marginVertical: 20 }}>
              <Text style={styles.smallLabelStyle}>00.{prependZero(count)}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 10 }}>
                <Text style={[styles.smallLabelStyle,
                { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', },
                { color: count === 0 ? GoDeliveryColors.secondary : GoDeliveryColors.disabled }
                ]}>Do not send OTP?

                </Text>
                <TouchableOpacity style={{ marginLeft: 10, }} disabled={count > 0} onPress={resendCode}>
                  <Text style={[styles.smallLabelStyle, { color: count == 0 ? GoDeliveryColors.primary : GoDeliveryColors.primayDisabled }]}>Send OTP</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ flex: 1, marginBottom: 60, justifyContent: 'flex-end' }}>
            <LargeLabelButton buttonText="Confirm" handler={confirmCode} />
          </View>
          {activityIndicator && (
            <ActivityIndicator
              size={'large'}
              style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
            />
          )}
        </View>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backButtonBack: {
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
    position: 'absolute',
    top: -10,
    left: 20,
  },
  smallLabelStyle: {
    fontSize: 11,
    fontWeight: "400",
    color: GoDeliveryColors.disabled
  },
});

export default ForgotOTPCheckScreen;
