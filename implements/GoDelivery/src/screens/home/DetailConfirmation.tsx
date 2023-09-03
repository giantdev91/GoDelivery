import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import GlobalStyles from '../../styles/style';
import CustomizedInput from '../../components/CustomizedInput';
import GoDeliveryColors from '../../styles/colors';
import Action from '../../service';
import store from '../../redux/store';
import HeaderBar from '../../components/HeaderBar';
import { Divider } from 'react-native-paper';
import PrimaryButton from '../../components/PrimaryButton';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';

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

const DetailConfirmation = ({
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
    distance,
    price,
    estimationTime
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
        price: price,
        distance: distance,
      };
      Action.order
        .createOrder(param)
        .then(res => {
          const response = res.data;
          setActivityIndicator(false);
          if (response.success) {
            navigation.navigate('OrderComplete');
          } else {
            Alert.alert("GoDelivery", 'Operation failed. Try again.');
          }
        })
        .catch(err => {
          console.log('error: ', err);
          setActivityIndicator(false);
          Alert.alert("GoDelivery", 'Operation failed. Try again.');
        });
    }

  };

  return (
    <View style={GlobalStyles.container}>
      <HeaderBar navigation={navigation} title={'DELIVERY CONFIRMATION'} />
      <ScrollView>
        <View style={styles.formArea}>
          <Text style={GlobalStyles.headerTitle}>Pick-up details</Text>
          <View style={styles.locationStrSection}>
            <Icons
              name="person-circle-outline"
              size={30}
              color={GoDeliveryColors.secondary}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>Sender details</Text>
              <Text style={GlobalStyles.text}>{username}</Text>
              <Text style={GlobalStyles.text}>{senderPhone}</Text>

              <Text style={[GlobalStyles.subTitle, { marginTop: 10 }]}>
                Receiver details
              </Text>
              {/* <Text style={GlobalStyles.text}>{username}</Text> */}
              <Text style={[GlobalStyles.text, { marginVertical: 5 }]}>{receiverName}</Text>
              <CustomizedPhoneInput value={receiverPhone} handler={setReceiverPhone} error={receiverPhoneError.length > 0} />
              <Text style={GlobalStyles.textFieldErrorMsgArea}>{receiverPhoneError}</Text>
              {/* <Text style={GlobalStyles.text}>{receiver}</Text> */}
            </View>
          </View>

          <View style={[styles.locationStrSection, { marginTop: 10 }]}>
            <Icons
              name="locate-outline"
              size={30}
              color={GoDeliveryColors.green}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>Pick-up location</Text>
              <Text style={GlobalStyles.text} numberOfLines={2}>
                {from}
              </Text>
            </View>
          </View>
          <View style={[styles.locationStrSection, { marginTop: 10 }]}>
            <Icons
              name="location-outline"
              size={30}
              color={GoDeliveryColors.primary}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={[GlobalStyles.subTitle]}>
                Delivery location
              </Text>
              <Text style={GlobalStyles.text}>{to}</Text>
            </View>
          </View>

          <View style={styles.locationStrSection}>
            <Image
              source={require('../../../assets/images/icons/date.png')}
              style={styles.iconImg}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>Pick-up date</Text>
              {/* {!expectationDate && (
                <TouchableOpacity
                  onPress={showDatePicker}
                  style={styles.dateTimePicker}>
                  <Text style={GlobalStyles.text}>Set Date</Text>
                </TouchableOpacity>
              )} */}
              {expectationDate && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                  <Text style={GlobalStyles.text} numberOfLines={2}>
                    {expectationDate}
                  </Text>
                  {/* <TouchableOpacity
                    onPress={showDatePicker}
                    style={styles.dateTimePickerReset}>
                    <Text style={GlobalStyles.text}>Reset</Text>
                  </TouchableOpacity> */}
                </View>
              )}
            </View>
          </View>

          <View style={[styles.locationStrSection, { marginTop: 10 }]}>
            <Image
              source={require('../../../assets/images/icons/time.png')}
              style={styles.iconImg}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>Pick-up time</Text>
              {/* {!expectationTime && (
                <TouchableOpacity
                  onPress={showTimePicker}
                  style={styles.dateTimePicker}>
                  <Text style={GlobalStyles.text}>Set Time</Text>
                </TouchableOpacity>
              )} */}
              {expectationTime && (
                <View
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 20 }}>
                  <Text style={GlobalStyles.text}>{expectationTime}min</Text>
                  {/* <TouchableOpacity
                    onPress={showTimePicker}
                    style={styles.dateTimePickerReset}>
                    <Text style={GlobalStyles.text}>Reset</Text>
                  </TouchableOpacity> */}
                </View>
              )}
            </View>
          </View>

          <View style={{ marginTop: 10 }}>
            <View style={styles.infoLabelBack}>
              <Image
                source={require('../../../assets/images/icons/distance.png')}
                style={styles.iconImg}
              />
              <Text style={GlobalStyles.subTitle}>Distance: {distance}Km</Text>
            </View>
            <View style={styles.infoLabelBack}>
              <Image
                source={require('../../../assets/images/icons/price.png')}
                style={styles.iconImg}
              />
              <Text style={GlobalStyles.subTitle}>Price: MZN {price}</Text>
            </View>
          </View>
        </View>
        <View style={styles.buttonRow}>
          <PrimaryButton buttonText="CONFIRM" handler={handleNext} />
        </View>
      </ScrollView>
      {activityIndicator && (
        <ActivityIndicator
          size={'large'}
          style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
        />
      )}
    </View>
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
    borderRadius: 25,
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
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
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
    borderRadius: 30,
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
    borderColor: GoDeliveryColors.disabled,
    borderWidth: 0.5,
    width: '100%',
    marginVertical: 30,
  },
  dateTimePicker: {
    backgroundColor: GoDeliveryColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: 120,
    marginVertical: 5,
    borderColor: GoDeliveryColors.secondary,
    borderWidth: 1,
  },
  dateTimePickerReset: {
    backgroundColor: GoDeliveryColors.white,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    width: 60,
    borderColor: GoDeliveryColors.secondary,
    borderWidth: 1,
  },
});

export default DetailConfirmation;
