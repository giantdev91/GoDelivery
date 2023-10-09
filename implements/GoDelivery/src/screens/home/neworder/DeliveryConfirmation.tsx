import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import Action from '../../../service';
import store from '../../../redux/store';
import { Divider } from 'react-native-paper';
import PrimaryButton from '../../../components/PrimaryButton';
import { BackIcon, CheckRectangle, FromLocationIcon, HomeIcon, PhoneIcon, ToLocationIcon, UserIcon } from '../../../common/Icons';

// Function to get the day suffix (e.g., 1st, 2nd, 3rd, etc.)
function getDaySuffix(day: number) {
  if (day === 1 || day === 21 || day === 31) {
    return 'st';
  } else if (day === 2 || day === 22) {
    return 'nd';
  } else if (day === 3 || day === 23) {
    return 'rd';
  } else {
    return 'th';
  }
}

const formatDate = () => {
  const dateObj = new Date();
  const day = dateObj.getDate();
  const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
  const year = dateObj.getFullYear();
  const formattedDate = `${day}${getDaySuffix(day)} ${month} ${year}`;
  return formattedDate;
}

const DeliveryConfirmation = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const {
    senderPhone,
    receiver,
    receiverName,
    from,
    fromX,
    fromY,
    fromLocationReferBuilding,
    to,
    toX,
    toY,
    toLocationReferBuilding,
    goodsVolumn,
    goodsWeight,
    goodsType,
    distance,
    price,
    estimationTime,
    payOption,
    description,
    screenShot
  } = route.params;
  const username = store.getState().CurrentUser.user.name;
  const [receiverPhone, setReceiverPhone] = useState(receiver.slice(3));
  const [receiverPhoneError, setReceiverPhoneError] = useState('');
  const [expectationTime, setExpectationTime] = useState(estimationTime);
  const [expectationDate, setExpectationDate] = useState(formatDate());
  const [expectDate, setExpectDate] = useState('');
  const [expectTime, setExpectTime] = useState('');
  const [activityIndicator, setActivityIndicator] = useState(false);



  const onChange = (event: any, selectedDate: any) => {
    const dateObj = selectedDate;
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    const formattedDate = `${day}${getDaySuffix(day)} ${month} ${year}`;
    setExpectationDate(formattedDate);
    setExpectDate(`${year}-${month}-${day}`);
  };

  const showMode = (currentMode: string) => {
    DateTimePickerAndroid.open({
      display: 'default',
      value: new Date(),
      onChange: onChange,
      mode: currentMode,
    });
  };

  const onTimeChange = (event: any, selectedDate: any) => {
    const formatedValue = getFormatedExpectationTime(selectedDate);
    setExpectationTime(formatedValue);
    setExpectTime(formatedValue);
  };

  const showTimeMode = (currentMode: string) => {
    DateTimePickerAndroid.open({
      display: 'default',
      value: new Date(),
      onChange: onTimeChange,
      mode: currentMode,
      is24Hour: true,
    });
  };

  const showDatePicker = () => {
    showMode('date');
  };

  const showTimePicker = () => {
    showTimeMode('time');
  };

  const getFormatedExpectationTime = (expectationTime: any) => {
    const hours = expectationTime.getHours();
    const minutes = expectationTime.getMinutes();
    const formatedTime = `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}`;
    return formatedTime;
  };

  const validateForm = () => {
    var validFlag = true;
    if (receiverPhone.length != 9) {
      setReceiverPhoneError('Please enter valid phone number.');
      validFlag = false;
    } else {
      const prefix = Number.parseInt(receiverPhone.substring(0, 2));
      if (prefix > 81 && prefix < 88) {
        setReceiverPhoneError('');
      } else {
        validFlag = false;
        setReceiverPhoneError('Please enter valid phone number.');
      }
    }
    return validFlag;
  }

  const handleBack = () => {
    navigation.goBack();
  }

  const handleNext = () => {
    if (validateForm()) {
      setActivityIndicator(true);
      var currentDate = new Date();
      var expectDateTime = new Date(currentDate.getTime() + estimationTime * 60000);
      const param = {
        sender: store.getState().CurrentUser.user.id,
        senderPhone: senderPhone,
        receiver: receiver,
        receiverName: receiverName,
        from: from,
        fromX: fromX,
        fromY: fromY,
        fromLocationReferBuilding: fromLocationReferBuilding,
        to: to,
        toX: toX,
        toY: toY,
        toLocationReferBuilding: toLocationReferBuilding,
        expectationTime: expectDateTime,
        goodsVolumn: goodsVolumn,
        goodsWeight: goodsWeight,
        goodsType: goodsType,
        price: price,
        distance: distance,
        payOption: payOption,
        description: description,
        screenShot: screenShot
      };
      Action.order
        .createOrder(param)
        .then(res => {
          const response = res.data;
          setActivityIndicator(false);
          if (response.success) {
            navigation.navigate('OrderComplete');
          } else {
            Dialog.show({
              type: ALERT_TYPE.DANGER,
              title: 'GoDelivery',
              textBody: response.message,
              button: 'OK',
            });
          }
        })
        .catch(err => {
          console.log('error: ', err);
          setActivityIndicator(false);
          Dialog.show({
            type: ALERT_TYPE.DANGER,
            title: 'GoDelivery',
            textBody: 'Operation failed. Try again.',
            button: 'OK',
          });
        });
    }

  };

  return (
    <AlertNotificationRoot>
      <View style={GlobalStyles.container}>
        <View style={GlobalStyles.headerSection}>
          <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
            <BackIcon />
          </TouchableOpacity>
          <Text style={GlobalStyles.whiteHeaderTitle}>DELIVERY CONFIRMATION</Text>
        </View>
        <ScrollView>
          <View style={styles.formArea}>
            {/* Sender info section start */}
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={GlobalStyles.subTitle}>Sender</Text>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <UserIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{username}</Text>
              </View>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <PhoneIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{senderPhone}</Text>
              </View>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <HomeIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{fromLocationReferBuilding}</Text>
              </View>
              <View style={[styles.textWithIcon, { marginTop: 5 }]}>
                <View style={GlobalStyles.iconBack}>
                  <FromLocationIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{from}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />
            {/* Sender info section end */}

            {/* Receiver info section start */}
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={GlobalStyles.subTitle}>Receiver</Text>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <UserIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{receiverName}</Text>
              </View>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <PhoneIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{receiver}</Text>
              </View>
              <View style={styles.textWithIcon}>
                <View style={GlobalStyles.iconBack}>
                  <HomeIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{toLocationReferBuilding}</Text>
              </View>
              <View style={[styles.textWithIcon, { marginTop: 5 }]}>
                <View style={GlobalStyles.iconBack}>
                  <ToLocationIcon />
                </View>
                <Text style={GlobalStyles.textDisable}>{to}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />
            {/* Receiver info section end */}

            {/* Item Details info section start */}
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={GlobalStyles.subTitle}>Item Details</Text>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between', marginTop: 10 }]}>
                <Text style={GlobalStyles.textDisable}>Weight</Text>
                <Text style={GlobalStyles.textDisable}>{goodsWeight}</Text>
              </View>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between' }]}>
                <Text style={GlobalStyles.textDisable}>Volume</Text>
                <Text style={GlobalStyles.textDisable}>{goodsVolumn}</Text>
              </View>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between' }]}>
                <Text style={GlobalStyles.textDisable}>Type of Goods</Text>
                <Text style={GlobalStyles.textDisable}>{goodsType}</Text>
              </View>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between' }]}>
                <Text style={GlobalStyles.textDisable}>Delivery Charges</Text>
                <Text style={GlobalStyles.textDisable}>{`MZN ${price}`}</Text>
              </View>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between' }]}>
                <Text style={GlobalStyles.textDisable}>Discount</Text>
                <Text style={GlobalStyles.textDisable}>{'0 %'}</Text>
              </View>
              <View style={[styles.textWithIcon, { justifyContent: 'space-between' }]}>
                <Text style={GlobalStyles.textDisable}>Total Payment</Text>
                <Text style={GlobalStyles.textDisable}>{`MZN ${price}`}</Text>
              </View>
            </View>

            <Divider style={styles.divider} />
            {/* Item Details info section end */}

            {/* Payment Option section start */}
            <View style={{ paddingHorizontal: 20 }}>
              <Text style={GlobalStyles.subTitle}>Payment Option</Text>
              <View style={[styles.textWithIcon]}>
                <View style={GlobalStyles.iconBack}>
                  <CheckRectangle />
                </View>
                <Text style={GlobalStyles.textDisable}>{payOption == 1 ? "Paid by Receiver" : "Paid by Sender"}</Text>
              </View>
            </View>
            {/* Payment Option section end */}
          </View>
          <View style={[styles.buttonRow, { marginTop: 50 }]}>
            <PrimaryButton buttonText="PROCEED" handler={handleNext} />
          </View>
        </ScrollView>
        {activityIndicator && (
          <ActivityIndicator
            size={'large'}
            style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
          />
        )}
      </View>
    </AlertNotificationRoot>
  );
};

const styles = StyleSheet.create({
  background: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputBack: {
    backgroundColor: GoDeliveryColors.white,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 0,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputText: {
    marginLeft: 10,
    flex: 1,
    paddingHorizontal: 10,
    color: GoDeliveryColors.secondary,
  },
  formArea: {
    paddingVertical: 10,
    flex: 1,
  },
  textWithIcon: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    marginVertical: 5
  },
  textFieldErrorMsgArea: {
    height: 20,
    paddingLeft: 20,
    color: GoDeliveryColors.primary,
  },
  buttonRow: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    borderRadius: 5,
    backgroundColor: GoDeliveryColors.primary,
    width: 150,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  locationStrSection: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginTop: 20,
  },
  infoLabelBack: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    gap: 10,
    marginTop: 10,
  },
  iconImg: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  iconElement: {
    width: 25,
    height: 25,
    resizeMode: 'contain',
  },
  divider: {
    borderColor: GoDeliveryColors.dividerColor,
    borderWidth: 0.25,
    width: '100%',
    marginVertical: 20,
  },
  dateTimePicker: {
    backgroundColor: GoDeliveryColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 120,
    marginVertical: 5,
    borderColor: GoDeliveryColors.secondary,
    borderWidth: 1,
  },
  dateTimePickerReset: {
    backgroundColor: GoDeliveryColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    width: 60,
    borderColor: GoDeliveryColors.secondary,
    borderWidth: 1,
  },
});

export default DeliveryConfirmation;
