import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    BackHandler
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, Circle } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import MapViewDirections from 'react-native-maps-directions';
import ViewShot from "react-native-view-shot";
import { requestLocationPermission } from '../../../common/RequestPermission';
import PrimaryButton from '../../../components/PrimaryButton';
import Geocoder from 'react-native-geocoding';
import store from '../../../redux/store';
import { DEFAULT_ARRIVAL_TIME } from '../../../common/Constant';
import Action from '../../../service';
import allActions from '../../../redux/actions';
import mapstyle from "../../../common/mapStyles";
import { Divider } from 'react-native-paper';
import { BackIcon, FromLocationIcon, MyLocationIcon, ToLocationIcon } from '../../../common/Icons';
import CommonFunctions from '../../../common/CommonFunctions';
import AnimatingPolylineComponent from '../../../common/AnimatedPolylineComponent';

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.005; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
Geocoder.init(GOOGLE_API_KEY ?? "");

const ToLocation = ({ route, navigation }: { route: any, navigation: any }) => {
    const orderInfo = store.getState().NewOrder.orderInfo;
    const dispatch = useDispatch();
    const [region, setRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });
    const mapViewRef = useRef<MapView>(null);

    const [toStr, setToStr] = useState('DropOff Location');
    const [clickedConfirm, setClickedConfirm] = useState(false);
    const [estimationTime, setEstimationTime] = useState('');
    const [distance, setDistance] = useState('');
    const [price, setPrice] = useState('');
    const [setting, setSetting] = useState({});
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [screenShotUrl, setScreenShotUrl] = useState("");
    const [directions, setDirections] = useState([]);

    const ref = useRef();

    const toNotifications = () => {
        navigation.navigate("Notifications");
    }

    const toLocationSearch = () => {
        navigation.navigate("LocationSearch", { type: 1 });
    }

    const checkSystemSetting = async () => {
        Action.sysSetting.get()
            .then((res) => {
                if (res.data.data) {
                    setSetting(res.data.data);
                }
            })
    }

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
                            })
                            setlocationStringFromGeoLocationInfo(crd.latitude, crd.longitude);
                        },
                        error => {
                            console.log(error.code, error.message);
                        },
                        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                    );
                }
            });
        }
    };

    const setlocationStringFromGeoLocationInfo = (latitude: number, longitude: number) => {
        Geocoder.from(latitude, longitude)
            .then(json => {
                const formattedAddress = json.results[0].formatted_address;
                setToStr(formattedAddress);
            })
            .catch(error => console.warn(error));
        // fetch(
        //     `https://nominatim.openstreetmap.org/reverse?lat=${region.latitude}&lon=${region.longitude}&format=json`,
        // )
        //     .then(response => response.json())
        //     .then(data => {
        //         setFromStr(data.display_name);
        //     })
        //     .catch(error => console.error('Error:', error));
    }

    const handleConfirmButton = async () => {
        if (orderInfo["fromStr"] == toStr) {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'GoDelivery',
                textBody: "Pick up and drop off locations cannot be the same. Please choose different locations.",
                button: 'OK',
            })
        } else {
            setClickedConfirm(true);
        }
    };

    const handleNextButton = async () => {
        setActivityIndicator(true);
        const uri = await ref.current.capture();
        const storageRef = storage().ref();
        const imageRef = storageRef.child('images/' + Date.now());
        const res = await fetch(uri);
        const blob = await res.blob();
        //upload image to firebase storage
        await imageRef.put(blob);
        // Get the public download URL
        const downloadURL = await imageRef.getDownloadURL();
        console.log('Image uploaded successfully');
        console.log('Download URL:', downloadURL);
        setScreenShotUrl(downloadURL.toString());
        dispatch(allActions.OrderAction.setNewOrder({
            ...orderInfo,
            toStr: toStr,
            toLocation: region,
            estimationTime: estimationTime,
            distance: distance,
            price: price,
            screenShot: downloadURL
        }));
        setActivityIndicator(false);
        navigation.navigate("DeliveryDetail");
    }

    const handleBack = () => {
        if (!clickedConfirm) {
            navigation.goBack();
        } else {
            setClickedConfirm(false);
        }
    }

    const handleRegionChange = (region: any) => {
        if (!clickedConfirm) {
            setRegion(region);
            mapViewRef.current?.animateToRegion(region);
            setlocationStringFromGeoLocationInfo(region.latitude, region.longitude);
        }
    }

    const calculatePriceByDistance = (distance: string) => {
        var returnVal = '';
        var dis = Number.parseFloat(distance);
        if (dis < 4) {
            returnVal = (setting && setting?.basePrice ? setting?.basePrice : 89).toString();
        } else {
            returnVal = (Number.parseFloat(setting?.basePrice ? setting?.basePrice : 0) * dis / 4).toFixed(2);
        }
        return returnVal;
    };

    const backAction = () => {
        if (navigation.isFocused()) {
            if (!clickedConfirm) {
                return false;
            } else {
                setClickedConfirm(false);
                return true;
            }
        } else {
            return false;
        }
    }

    useEffect(() => {
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, [clickedConfirm]);

    useEffect(() => {
        getCurrentLocation();
        checkSystemSetting();


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
                    }))
                    mapViewRef.current?.animateToRegion({
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    })
                }
                if (locationString) {
                    setToStr(locationString);
                }
            }
        }, [])
    );
    const DirectionRoutes = [...directions].reverse();
    return (
        <AlertNotificationRoot>
            <View style={GlobalStyles.container}>
                {/* header section start */}
                <View style={[GlobalStyles.headerSection]}>
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Drop Off Location</Text>
                </View>
                {/* header section end */}
                <View style={{ flex: 1 }}>

                    <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.3 }} style={{ flex: 1, }}>
                        {
                            region.latitude != null && (
                                <MapView
                                    ref={mapViewRef}
                                    style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                                    provider={PROVIDER_GOOGLE}
                                    loadingEnabled
                                    onRegionChangeComplete={handleRegionChange}
                                    customMapStyle={mapstyle}
                                    region={region}>
                                    <Marker
                                        coordinate={orderInfo["fromLocation"]}
                                    >
                                        <View style={{ width: 50, height: 60, }}>
                                            <Image source={require("../../../../assets/images/map-marker.png")} style={GlobalStyles.mapMarker} resizeMode='contain' />
                                            <Text style={GlobalStyles.markerLabel}>Pick</Text>
                                        </View>

                                    </Marker>
                                    {
                                        clickedConfirm && (
                                            <Marker
                                                coordinate={region}
                                            >
                                                <View style={{ width: 50, height: 60, }}>
                                                    <Image source={require("../../../../assets/images/map-marker.png")} style={GlobalStyles.mapMarker} resizeMode='contain' />
                                                    <Text style={GlobalStyles.markerLabel}>Drop</Text>
                                                </View>

                                            </Marker>
                                        )
                                    }

                                    {
                                        (clickedConfirm) && (
                                            <MapViewDirections
                                                origin={orderInfo["fromLocation"]}
                                                destination={region}
                                                apikey={GOOGLE_API_KEY} // insert your API Key here
                                                strokeWidth={5}
                                                strokeColor={GoDeliveryColors.primary}
                                                onReady={result => {
                                                    setDirections(result.coordinates);
                                                    setEstimationTime(`${Math.ceil(result.duration + DEFAULT_ARRIVAL_TIME).toString()}`);
                                                    const distanceVal = result.distance.toFixed(2).toString();
                                                    setDistance(distanceVal);
                                                    const priceVal = calculatePriceByDistance(distanceVal);
                                                    setPrice(priceVal);
                                                }}
                                            />
                                        )
                                    }
                                    {
                                        (directions.length > 0 && clickedConfirm) && (<Polyline
                                            coordinates={directions}
                                            strokeColor={GoDeliveryColors.primary}
                                            strokeWidth={5}

                                        />)
                                    }
                                    {/* Animating polyline */}
                                    {
                                        (directions.length > 0 && clickedConfirm) && (
                                            <AnimatingPolylineComponent Direction={DirectionRoutes} />
                                        )
                                    }
                                    {/* <Circle
                                    center={orderInfo["fromLocation"]}
                                    radius={5}
                                    strokeColor={"#484848"}
                                    strokeWidth={5}
                                    fillColor={"#fff"}
                                    zIndex={1}
                                /> */}

                                    {/* Destination Circle */}
                                    {/* <Circle
                                    center={region}
                                    radius={5}
                                    strokeColor={"#484848"}
                                    strokeWidth={5}
                                    fillColor={"#fff"}
                                    zIndex={1}
                                /> */}
                                </MapView>
                            )
                        }

                    </ViewShot>
                    {/* map marker start */}
                    {
                        !clickedConfirm && (
                            <View style={GlobalStyles.markerContainer}>
                                <Image source={require("../../../../assets/images/map-marker.png")} style={GlobalStyles.mapMarker} resizeMode='contain' />
                                <Text style={GlobalStyles.markerLabel}>Drop</Text>
                            </View>
                        )
                    }
                    {/* map marker end */}

                    {/* location string board start */}
                    <View style={{ position: 'absolute', width: '100%', paddingHorizontal: 20, marginTop: 10, }}>
                        <View style={[{ backgroundColor: GoDeliveryColors.white, borderRadius: 5, }, GlobalStyles.shadowProp]}>
                            <View style={[GlobalStyles.locationStrContainer]}>
                                <View style={{ width: 25, alignItems: 'center' }}>
                                    <FromLocationIcon />
                                </View>
                                <Text style={GlobalStyles.locationStr}>{orderInfo["fromStr"]}</Text>
                            </View>
                            <Divider style={styles.divider} />
                            <TouchableOpacity onPress={toLocationSearch} disabled={clickedConfirm}>
                                <View style={GlobalStyles.locationStrContainer}>
                                    <View style={{ width: 25, alignItems: 'center' }}>
                                        <ToLocationIcon />
                                    </View>
                                    <Text style={GlobalStyles.locationStr}>{toStr}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* location string board end */}

                    {/* my location button start */}
                    <TouchableOpacity style={styles.mylocationBtn} onPress={() => {
                        route.params = undefined;
                        getCurrentLocation();
                    }}>
                        <MyLocationIcon />
                    </TouchableOpacity>
                    {/* my location button end */}

                    {
                        !clickedConfirm && <View style={styles.buttonRow}>
                            <PrimaryButton buttonText="Confirm" handler={handleConfirmButton} />
                        </View>
                    }

                    {clickedConfirm && (
                        <View style={styles.informationPad}>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Text style={GlobalStyles.textBold}>Distance:</Text>
                                <Text style={GlobalStyles.text}>{distance}Km</Text>
                            </View>
                            <View style={{ flexDirection: 'row', gap: 5 }}>
                                <Text style={GlobalStyles.textBold}>Price:</Text>
                                <Text style={GlobalStyles.text}>{CommonFunctions.getLocalNumberValue(price)}</Text>
                            </View>
                        </View>
                    )}

                    {
                        clickedConfirm && <View style={styles.buttonRow}>
                            <PrimaryButton buttonText="Next" handler={handleNextButton} />
                        </View>
                    }



                    {activityIndicator && (
                        <ActivityIndicator
                            size={'large'}
                            style={{ position: 'absolute', alignSelf: 'center', bottom: 200 }}
                        />
                    )}
                </View>
            </View>
        </AlertNotificationRoot>
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
    divider: {
        borderColor: GoDeliveryColors.disabled,
        borderWidth: 0.3,
        alignSelf: 'center',
        marginLeft: 25,
        width: '80%',
    },
    informationPad: {
        position: 'absolute',
        left: 0,
        bottom: 80,
        backgroundColor: GoDeliveryColors.white,
        width: 150,
        height: 35,
        borderRadius: 5,
        opacity: 0.7,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 10,

    },
    informationStr: {
        color: GoDeliveryColors.secondary,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
});

export default ToLocation;
