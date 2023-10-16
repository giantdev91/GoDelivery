import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import MapView, {PROVIDER_GOOGLE, AnimatedRegion} from 'react-native-maps';
import Animated from 'react-native-reanimated';
import Geolocation from 'react-native-geolocation-service';
import {requestLocationPermission} from '../../../common/RequestPermission';
import PrimaryButton from '../../../components/PrimaryButton';
import Geocoder from 'react-native-geocoding';
import allActions from '../../../redux/actions';
import mapstyle from '../../../common/mapStyles';
import Modal from 'react-native-modal';
import {
  FromLocationIcon,
  MyLocationIcon,
  NotificationIcon,
} from '../../../common/Icons';
import CustomIndicator from '../../../common/CustomIndicator';
import {
  NOTIFICATION_TYPE_ARRIVE_TO_COLLECT,
  NOTIFICATION_TYPE_ARRIVE_TO_DELIVER,
  NOTIFICATION_TYPE_ORDER_ASSIGNED,
  NOTIFICATION_TYPE_ORDER_CANCEL,
  NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN,
  NOTIFICATION_TYPE_ORDER_CANNOT_CREATE,
  NOTIFICATION_TYPE_ORDER_COMPLETED,
  NOTIFICATION_TYPE_ORDER_CREATED,
  NOTIFICATION_TYPE_ORDER_FEEDBACK,
  NOTIFICATION_TYPE_ORDER_PROCESSING,
} from '../../../common/Constant';
import messaging from '@react-native-firebase/messaging';
import APIServer from '../../../service/APIService';
import Action from '../../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.005; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
Geocoder.init(GOOGLE_API_KEY ?? '');

let messageDialogShow = false;
let initialMessageType = '';
let initialOrderId = '';
let initialTitle = '';
let initialBody = '';

const initializeBackgroundMessage = async () => {
  const messgeStr = await AsyncStorage.getItem('NOTIFICATION');
  if (messgeStr) {
    AsyncStorage.setItem('NOTIFICATION', '');
    const message = JSON.parse(messgeStr);
    messageDialogShow = true;
    initialMessageType = message?.data?.notifType ?? '';
    initialOrderId = message?.data?.orderId ?? '';
    initialTitle = message?.notification?.title ?? '';
    initialBody = message?.notification?.body ?? '';
  }
};

initializeBackgroundMessage();

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('remote message catched from background', remoteMessage);
});

const FromLocation = ({route, navigation}: {route: any; navigation: any}) => {
  const dispatch = useDispatch();
  const [region, setRegion] = useState({
    latitude: null,
    longitude: null,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });
  const [isMapLoading, setIsMapLoading] = useState(true);
  const [activityIndicator, setActivityIndicator] = useState(false);
  const mapViewRef = useRef<MapView>(null);

  const [fromStr, setFromStr] = useState('Pickup Location');
  const [messageTitle, setMessageTitle] = useState(initialTitle);
  const [messageContent, setMessageContent] = useState(initialBody);
  const [notifType, setNotifType] = useState(initialMessageType);
  const [notifOrderId, setNotifOrderId] = useState(initialOrderId);
  const [isMessageModalVisible, setIsMessageModalVisible] =
    useState(messageDialogShow);
  const toNotifications = () => {
    navigation.navigate('Notifications');
  };

  const toLocationSearch = () => {
    navigation.navigate('LocationSearch', {type: 0});
  };

  const getCurrentLocation = () => {
    if (route.params == undefined) {
      const result = requestLocationPermission();
      result.then(res => {
        if (res) {
          Geolocation.getCurrentPosition(
            regionInfo => {
              const crd = regionInfo.coords;
              if (region.latitude == null) {
                setRegion({
                  latitude: crd.latitude,
                  longitude: crd.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                });
              }

              mapViewRef.current?.animateToRegion({
                latitude: crd.latitude,
                longitude: crd.longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              });
              setlocationStringFromGeoLocationInfo(crd.latitude, crd.longitude);
            },
            error => {
              console.log(error.code, error.message);
            },
            {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
          );
        }
      });
    }
  };

  const handleNextButton = async () => {
    dispatch(
      allActions.OrderAction.setNewOrder({
        fromLocation: region,
        fromStr: fromStr,
      }),
    );
    navigation.navigate('ToLocation');
  };

  const setlocationStringFromGeoLocationInfo = (
    latitude: number,
    longitude: number,
  ) => {
    Geocoder.from(latitude, longitude)
      .then(json => {
        const formattedAddress = json.results[0].formatted_address;
        setFromStr(formattedAddress);
      })
      .catch(error => console.warn(error));
  };

  const handleRegionChange = (region: any) => {
    setRegion(region);
    mapViewRef.current?.animateToRegion(region);
    setlocationStringFromGeoLocationInfo(region.latitude, region.longitude);
  };

  const handleRemoteMessage = (remoteMessage: any) => {
    AsyncStorage.removeItem('NOTIFICATION');
    const messageType = remoteMessage?.data?.notifType;
    const orderId = remoteMessage?.data?.orderId;
    const title = remoteMessage?.notification?.title;
    const body = remoteMessage?.notification?.body;
    setMessageTitle(title ?? '');
    setMessageContent(body ?? '');
    setIsMessageModalVisible(true);
    setNotifType(messageType ?? '');
    setNotifOrderId(orderId ?? '');
  };

  useEffect(() => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      handleRemoteMessage(remoteMessage);
    });

    getCurrentLocation();

    return () => {
      unsubscribe;
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (route.params) {
        const location = route.params.location;
        const locationString = route.params.locationString;

        if (location) {
          setRegion(prevState => ({
            ...prevState,
            latitude: location.lat,
            longitude: location.lng,
          }));
          mapViewRef.current?.animateToRegion({
            latitude: location.lat,
            longitude: location.lng,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          });
        }
        if (locationString) {
          setFromStr(locationString);
        }
      }
    }, []),
  );

  const navigateToSpecificScreen = async () => {
    setActivityIndicator(true);
    const orderResponse = await Action.order.getByID({orderID: notifOrderId});
    const order = orderResponse.data.data;
    setActivityIndicator(false);

    switch (notifType) {
      case NOTIFICATION_TYPE_ORDER_CREATED:
        break;
      case NOTIFICATION_TYPE_ORDER_ASSIGNED:
        break;
      case NOTIFICATION_TYPE_ORDER_CANCEL:
        break;
      case NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN:
        break;
      case NOTIFICATION_TYPE_ORDER_PROCESSING:
        break;
      case NOTIFICATION_TYPE_ORDER_COMPLETED:
        break;
      case NOTIFICATION_TYPE_ORDER_FEEDBACK:
        break;
      case NOTIFICATION_TYPE_ORDER_CANNOT_CREATE:
        break;
      case NOTIFICATION_TYPE_ARRIVE_TO_COLLECT:
        if (order.status == 1 && order.payOption == 2) {
          const param = {
            from: order.price,
            to: order.to,
            price: order.price,
            id: notifOrderId,
          };
          setIsMessageModalVisible(false);
          navigation.navigate('Payment', param);
        }
        break;
      case NOTIFICATION_TYPE_ARRIVE_TO_DELIVER:
        if (order.status == 2 && order.payOption == 1) {
          const param = {
            from: order.price,
            to: order.to,
            price: order.price,
            id: notifOrderId,
          };
          setIsMessageModalVisible(false);
          navigation.navigate('Payment', param);
        }
        break;
        break;
    }
  };

  return (
    <View style={GlobalStyles.container}>
      {/* header section start */}
      <View style={[GlobalStyles.headerSection]}>
        <Text style={GlobalStyles.whiteHeaderTitle}>Home</Text>
        <TouchableOpacity
          style={GlobalStyles.headerCheckButton}
          onPress={toNotifications}>
          <NotificationIcon />
        </TouchableOpacity>
      </View>
      {/* header section end */}
      <View style={{flex: 1}}>
        {region.latitude != null && (
          <MapView
            ref={mapViewRef}
            onMapReady={() => setIsMapLoading(false)}
            style={{flex: 1.5, borderColor: 'red', borderWidth: 1}}
            provider={PROVIDER_GOOGLE}
            loadingEnabled={false}
            onRegionChangeComplete={handleRegionChange}
            customMapStyle={mapstyle}
            region={region}>
            {/* <Marker
                            coordinate={region}
                        /> */}
          </MapView>
        )}

        {/* map marker start */}
        <View style={GlobalStyles.markerContainer}>
          <Image
            source={require('../../../../assets/images/map-marker.png')}
            style={GlobalStyles.mapMarker}
            resizeMode="contain"
          />
          <Text style={GlobalStyles.markerLabel}>Pick</Text>
        </View>
        {/* map marker end */}

        {/* location string board start */}
        <View
          style={{
            position: 'absolute',
            width: '100%',
            paddingHorizontal: 20,
            marginTop: 10,
          }}>
          <TouchableOpacity onPress={toLocationSearch}>
            <View
              style={[
                GlobalStyles.locationStrContainer,
                GlobalStyles.shadowProp,
              ]}>
              <FromLocationIcon />
              <Text style={GlobalStyles.locationStr}>{fromStr}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* location string board end */}

        {/* my location button start */}
        <TouchableOpacity
          style={styles.mylocationBtn}
          onPress={() => {
            route.params = undefined;
            getCurrentLocation();
          }}>
          <MyLocationIcon />
        </TouchableOpacity>
        {/* my location button end */}

        <View style={styles.buttonRow}>
          <PrimaryButton buttonText="Confirm" handler={handleNextButton} />
        </View>
      </View>
      {isMapLoading && <CustomIndicator />}

      <Modal isVisible={isMessageModalVisible}>
        <View style={styles.alertDialog}>
          <Text style={GlobalStyles.subTitle}>{messageTitle}</Text>
          <Text style={[GlobalStyles.textMedium, {marginTop: 10}]}>
            {messageContent}
          </Text>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 40,
              marginTop: 30,
            }}>
            <TouchableOpacity onPress={() => setIsMessageModalVisible(false)}>
              <Text
                style={[
                  GlobalStyles.textMedium,
                  {color: GoDeliveryColors.primary},
                ]}>
                No
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigateToSpecificScreen();
              }}>
              <Text
                style={[
                  GlobalStyles.textMedium,
                  {color: GoDeliveryColors.primary},
                ]}>
                Yes
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {activityIndicator && <CustomIndicator />}
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonRow: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  mylocationBtn: {
    position: 'absolute',
    right: 20,
    bottom: 80,
    backgroundColor: '#FFFFFFAF',
    borderRadius: 100,
    padding: 10,
  },
  alertDialog: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: GoDeliveryColors.white,
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default FromLocation;
