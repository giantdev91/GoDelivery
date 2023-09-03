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
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Action from '../../service';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import LargeLabelButton from '../../components/LargeLabelButton';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import TwillioService from '../../service/TwillioService';

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

const ForgetPasswordScreen = ({ navigation }: { navigation: any }) => {
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);

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

  const checkPhone = async () => {
    try {
      if (!phone) {
        return;
      }
      setActivityIndicator(true);
      const argPhone = validatePhoneNumber();
      if (argPhone) {
        Action.authentication
          .phoneCheck({ phone: argPhone.replace('+', '') })
          .then(async response => {
            const responseData = response.data;
            if (responseData.success) {
              Alert.alert('GoDelivery', "This phone number is not registered.");
              setActivityIndicator(false);
            } else {
              if (await TwillioService.sendSMSVerfication(argPhone)) {
                setActivityIndicator(false);
                const param = {
                  phone: argPhone,
                }
                navigation.navigate('ForgotOTPCheck', param);
              } else {
                Alert.alert('GoDelivery', 'Phone number valid failed');
                setActivityIndicator(false);
              }
            }
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

  return (
    <SafeAreaView style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
      <ScrollView>
        <View style={GlobalStyles.authenticationScreenLogoBack}>
          <Image
            source={require('../../../assets/images/forgot_password.png')}
            style={GlobalStyles.authenticationScreenLogo}
          />
          <BackButton navigation={navigation} />
        </View>
        <View
          style={[GlobalStyles.container, GlobalStyles.contentAreaPadding, { backgroundColor: GoDeliveryColors.white }]}>
          <View style={{ justifyContent: 'flex-start', }}>
            <Text style={GlobalStyles.authenticationHeaderTitle}>FORGOT PASSWORD</Text>
            <Text style={[GlobalStyles.text, { textAlign: 'center', paddingHorizontal: 40, marginBottom: 20, }]}>Please enter your phone number to receive a verification code</Text>
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
          </View>
          <View style={{ flex: 1, marginBottom: 50, justifyContent: 'flex-end', marginTop: 160 }}>
            <LargeLabelButton buttonText="Send" handler={checkPhone} />
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
});

export default ForgetPasswordScreen;
