import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, Image } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import CustomizedInput from '../../components/CustomizedInput';
import GoDeliveryColors from '../../styles/colors';
import store from '../../redux/store';
import HeaderBar from '../../components/HeaderBar';
import { Divider } from 'react-native-paper';
import PrimaryButton from '../../components/PrimaryButton';
import CommonFunctions from '../../common/CommonFunctions';
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';

const DetailInformation = ({
  route,
  navigation,
}: {
  route: any;
  navigation: any;
}) => {
  const { markers, fromStr, toStr, estimationTime, distance, price } = route.params;

  const [senderPhone, setSenderPhone] = useState(
    store.getState().CurrentUser.user.phone,
  );
  const [senderPhoneError, setSenderPhoneError] = useState('');
  const [fromLocationReferBuilding, setFromLocationReferBuilding] =
    useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [receiverPhoneError, setReceiverPhoneError] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [receiverNameError, setReceiverNameError] = useState('');
  const [toLocationReferBuilding, setToLocationReferBuilding] = useState('');
  const [weight, setWeight] = useState('');
  const [weightError, setWeightError] = useState('');
  const [volume, setVolume] = useState('');
  const [volumeError, setVolumeError] = useState('');

  const formValidate = () => {
    var returnVal = true;
    // if (senderPhone.length != 9) {
    //   setSenderPhoneError('Please insert valid phone number');
    //   returnVal = false;
    // } else {
    //   setSenderPhoneError('');
    // }
    if (receiverPhone.length != 9) {
      setReceiverPhoneError('Please insert valid phone number');
      returnVal = false;
    } else {
      setReceiverPhoneError('');
    }
    if (!receiverName) {
      setReceiverNameError('Please insert receiver name.');
      returnVal = false;
    } else {
      setReceiverNameError('');
    }
    if (!weight) {
      setWeightError('Please enter a valid weight for the goods.');
      returnVal = false;
    } else {
      if (Number.parseFloat(weight) > 50) {
        setWeightError('It should be less than 50.');
        returnVal = false;
      } else {
        setWeightError('');
      }
    }
    if (!volume) {
      setVolumeError('Please enter a valid volume for the goods.');
      returnVal = false;
    } else {
      if (Number.parseFloat(volume) > 50) {
        setVolumeError('It should be less than 50.');
        returnVal = false;
      } else {
        setVolumeError('');
      }
    }
    return returnVal;
  };

  const handleNext = () => {
    if (formValidate()) {
      const param = {
        sender: store.getState().CurrentUser.user.id,
        senderPhone: senderPhone,
        receiver: `258${receiverPhone}`,
        receiverName: receiverName,
        from: fromStr,
        fromX: markers[0].latitude,
        fromY: markers[0].longitude,
        fromLocationReferBuilding: fromLocationReferBuilding,
        to: toStr,
        toX: markers[1].latitude,
        toY: markers[1].longitude,
        toLocationReferBuilding: toLocationReferBuilding,
        estimationTime: estimationTime,
        goodsVolumn: volume,
        goodsWeight: weight,
        distance: distance,
        price: price,
      };
      navigation.navigate('DetailConfirmation', param);
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <HeaderBar navigation={navigation} title={'PERSONAL DELIVERY'} />
      <ScrollView>
        <View style={styles.formArea}>
          <View style={styles.locationStrSection}>
            <Icons
              name="locate-outline"
              size={30}
              color={GoDeliveryColors.secondary}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>From</Text>
              <Text numberOfLines={2} style={GlobalStyles.text}>
                {fromStr}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedPhoneInput value={senderPhone.slice(3)} handler={() => { }} disabled={true} placeholder='Phone to contact' />
            <Text style={styles.textFieldErrorMsgArea}>{senderPhoneError}</Text>
            {/* <CustomizedInput
              icon="call-outline"
              placeHolder="Person to contact"
              keyboardType="number"
              val={senderPhone}
              handler={setSenderPhone}
              showCheck={true}
              error={senderPhoneError}
            /> */}
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedInput
              icon="home-outline"
              placeHolder="Build No / Flat / Floor - Optional"
              keyboardType="number"
              val={fromLocationReferBuilding}
              handler={setFromLocationReferBuilding}
              showCheck={true}
            />
          </View>
          <View style={styles.locationStrSection}>
            <Icons
              name="location-outline"
              size={30}
              color={GoDeliveryColors.secondary}
            />
            <View style={{ flex: 1, marginLeft: 5 }}>
              <Text style={GlobalStyles.subTitle}>To</Text>
              <Text numberOfLines={2} style={GlobalStyles.text}>
                {toStr}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedPhoneInput value={receiverPhone} handler={setReceiverPhone} placeholder='Phone to contact' />
            <Text style={styles.textFieldErrorMsgArea}>{receiverPhoneError}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedInput
              icon="person-outline"
              placeHolder="User name to contact"
              val={receiverName}
              handler={setReceiverName}
              showCheck={true}
            />
            <Text style={styles.textFieldErrorMsgArea}>{receiverNameError}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedInput
              icon="home-outline"
              placeHolder="Build No / Flat / Floor - Optional"
              keyboardType="number"
              val={toLocationReferBuilding}
              handler={setToLocationReferBuilding}
              showCheck={true}
            />
          </View>
          <Divider style={styles.divider} />
          <View>
            <CustomizedInput
              icon=""
              iconElement={
                <Image
                  source={require('../../../assets/images/icons/weight.png')}
                  style={styles.iconElement}
                />
              }
              placeHolder="weight"
              keyboardType="number"
              val={weight}
              handler={setWeight}
              showCheck={true}
            />
            <Text style={styles.textFieldErrorMsgArea}>{weightError}</Text>
          </View>
          <View style={{ marginTop: 10 }}>
            <CustomizedInput
              icon=""
              iconElement={
                <Image
                  source={require('../../../assets/images/icons/volume.png')}
                  style={styles.iconElement}
                />
              }
              placeHolder="volume"
              keyboardType="number"
              val={volume}
              handler={setVolume}
              showCheck={true}
            />
            <Text style={styles.textFieldErrorMsgArea}>{volumeError}</Text>
          </View>

          <View style={{ marginTop: 20 }}>
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
          <PrimaryButton buttonText="NEXT" handler={handleNext} />
        </View>
      </ScrollView>
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
  checkIconArea: {
    width: 35,
    alignItems: 'flex-end',
  },
  formArea: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    flex: 1,
  },
  textFieldErrorMsgArea: {
    height: 15,
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
    width: 35,
    height: 35,
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
});

export default DetailInformation;
