import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    ActivityIndicator,
    Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import Icons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
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
        latitude: 10,
        longitude: 10,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const [toStr, setToStr] = useState('DropOff Location');
    const [clickedConfirm, setClickedConfirm] = useState(false);
    const [estimationTime, setEstimationTime] = useState('');
    const [distance, setDistance] = useState('');
    const [price, setPrice] = useState('');
    const [setting, setSetting] = useState({});
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [screenShotUrl, setScreenShotUrl] = useState("");

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
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    region => {
                        const crd = region.coords;
                        setRegion({
                            latitude: crd.latitude,
                            longitude: crd.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        });
                    },
                    error => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };

    const handleConfirmButton = async () => {
        setClickedConfirm(true);
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
        navigation.goBack();
    }

    const handleRegionChange = (region: any) => {
        if (!clickedConfirm) {
            setRegion(region);
            Geocoder.from(region.latitude, region.longitude)
                .then(json => {
                    const formattedAddress = json.results[0].formatted_address;
                    setToStr(formattedAddress);
                })
                .catch(error => console.warn(error));
        }
        // fetch(
        //     `https://nominatim.openstreetmap.org/reverse?lat=${region.latitude}&lon=${region.longitude}&format=json`,
        // )
        //     .then(response => response.json())
        //     .then(data => {
        //         setToStr(data.display_name);
        //     })
        //     .catch(error => console.error('Error:', error));
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

    useEffect(() => {
        getCurrentLocation();
        checkSystemSetting();
    }, []);

    useFocusEffect(
        useCallback(() => {
            if (route.params) {
                const location = route.params.location;
                if (location) {
                    setRegion({
                        latitude: location.lat,
                        longitude: location.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    })
                }
            }
        }, [])
    );

    return (
        <View style={GlobalStyles.container}>
            {/* header section start */}
            <View style={[GlobalStyles.headerSection]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>DROP OFF YOUR DELIVERY</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={toNotifications}>
                    <Icons name='notifications-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
            </View>
            {/* header section end */}
            <View style={{ flex: 1 }}>

                <ViewShot ref={ref} options={{ fileName: "Your-File-Name", format: "jpg", quality: 0.3 }} style={{ flex: 1, }}>
                    <MapView
                        style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                        provider={PROVIDER_GOOGLE}
                        loadingEnabled
                        onRegionChangeComplete={handleRegionChange}
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
                            clickedConfirm && (
                                <MapViewDirections
                                    origin={orderInfo["fromLocation"]}
                                    destination={region}
                                    apikey={GOOGLE_API_KEY} // insert your API Key here
                                    strokeWidth={4}
                                    strokeColor={GoDeliveryColors.primary}
                                    onReady={result => {
                                        setEstimationTime(`${Math.ceil(result.duration + DEFAULT_ARRIVAL_TIME).toString()}`);
                                        const distanceVal = result.distance.toFixed(2).toString();
                                        setDistance(distanceVal);
                                        const priceVal = calculatePriceByDistance(distanceVal);
                                        setPrice(priceVal);
                                    }}
                                />
                            )
                        }
                    </MapView>
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
                <View style={{ position: 'absolute', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                    <View style={[GlobalStyles.locationStrContainer, { marginBottom: 10 }]}>
                        <Icons name={"locate-outline"} size={24} color={GoDeliveryColors.green} />
                        <Text style={GlobalStyles.locationStr}>{orderInfo["fromStr"]}</Text>
                    </View>

                    <TouchableOpacity onPress={toLocationSearch} disabled={clickedConfirm}>
                        <View style={GlobalStyles.locationStrContainer}>
                            <Icons name={"location-outline"} size={24} color={GoDeliveryColors.primary} />
                            <Text style={GlobalStyles.locationStr}>{toStr}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* location string board end */}

                {/* my location button start */}
                <TouchableOpacity style={styles.mylocationBtn} onPress={getCurrentLocation}>
                    <Icons
                        name="locate-outline"
                        size={20}
                        color={GoDeliveryColors.secondary}
                    />
                </TouchableOpacity>
                {/* my location button end */}

                {
                    !clickedConfirm && <View style={styles.buttonRow}>
                        <PrimaryButton buttonText="Confirm" handler={handleConfirmButton} />
                    </View>
                }

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
    );
};

const styles = StyleSheet.create({
    buttonRow: {
        region: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    mylocationBtn: {
        position: 'absolute',
        right: 20,
        bottom: 80,
        backgroundColor: '#FFFFFF8F',
        borderRadius: 100,
        padding: 10,
    }
});

export default ToLocation;
