import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    Image,
    Alert,
} from 'react-native';

import Icons from 'react-native-vector-icons/Ionicons';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { useFocusEffect } from '@react-navigation/native';

import { requestLocationPermission } from '../../common/RequestPermission';
import PrimaryButton from '../../components/PrimaryButton';
import MapViewDirections from 'react-native-maps-directions';
import HeaderBar from '../../components/HeaderBar';
import commonFunctions from '../../common/CommonFunctions';
import Action from '../../service';
import { DEFAULT_ARRIVAL_TIME } from '../../common/Constant';
import { GeoCoordinates } from '../../type';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.005; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

// const LocationStr = ({ icon, text }: { icon: string; text: string }) => {
//     return (
//         <View style={styles.locationStrBack}>
//             <Icons name={icon} size={24} color={GoDeliveryColors.disabled} />
//             <Text style={styles.locationStr} numberOfLines={2}>
//                 {text}
//             </Text>
//         </View>
//     );
// };

const PriceEstimate = ({ navigation }: { navigation: any }) => {
    const [position, setPosition] = useState({
        latitude: 10,
        longitude: 10,
    });
    const [fromStr, setFromStr] = useState('From');
    const [toStr, setToStr] = useState('To');
    const [markers, setMarkers] = useState([{}, {}]);
    const [estimationTime, setEstimationTime] = useState('');
    const [distance, setDistance] = useState('');
    const [setting, setSetting] = useState({});
    const [price, setPrice] = useState('');
    const [fromSearchHeight, setFromSearchHeight] = useState(0);
    const [toSearchHeight, setToSearchHeight] = useState(0);

    const fromRef = useRef();
    const toRef = useRef();

    const handleMapPress = (event: any) => {
        setFromSearchHeight(0);
        setToSearchHeight(0);
        if (Object.keys(markers[0]).length == 0 || Object.keys(markers[1]).length == 0) {
            const { coordinate } = event.nativeEvent;
            var index = 0;
            if (Object.keys(markers[0]).length == 0) {
                index = 0;
            } else {
                index = 1;
            }
            var markersTemp = markers;
            markersTemp[index] = coordinate;
            setMarkers(markersTemp);
            fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${coordinate.latitude}&lon=${coordinate.longitude}&format=json`,
            )
                .then(response => response.json())
                .then(data => {
                    if (index == 0) {
                        setFromStr(data.display_name);
                        fromRef.current?.setAddressText(data.display_name);
                        setPosition(coordinate);
                    } else {
                        setToStr(data.display_name);
                        toRef.current?.setAddressText(data.display_name);
                    }
                })
                .catch(error => console.error('Error:', error));
        }
    };

    const getCurrentLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        const crd = position.coords;
                        setPosition(crd);
                    },
                    error => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };

    const handleRequest = () => {
        if (Number.parseFloat(distance) > 100) {
            Alert.alert("GoDelivery", "The delivery distance for an order must be less than 100 kilometers.");
        } else {
            if (Object.keys(markers[0]).length > 0 && Object.keys(markers[1]).length > 0) {
                const param = {
                    markers: markers,
                    fromStr: fromStr,
                    toStr: toStr,
                    estimationTime: estimationTime,
                    distance: distance,
                    price: price,
                };
                navigation.navigate('DetailInformation', param);
            }
        }
    };

    const handleMapRegionChange = (region: any) => {
        const { latitude, longitude } = region;
        const bounds = commonFunctions.calculateBounds(position.latitude, position.longitude, 100);

        if (
            latitude < bounds.latitude.min ||
            latitude > bounds.latitude.max ||
            longitude < bounds.longitude.min ||
            longitude > bounds.longitude.max
        ) {
            // The new region is outside the allowed bounds
            // You can show a notification, display an error, or prevent the map from scrolling further
            Alert.alert("GoDelivery", 'Out of Bounds. Please select a location within the 100-kilometer radius.');
            refreshStatus();
        } else {
            // The new region is within the allowed bounds
            // You can update the map region state or perform any other necessary actions
        }
    }

    const refreshStatus = () => {
        setMarkers([{}, {}]);
        setFromStr('');
        setToStr('');
        setDistance('');
        fromRef.current?.setAddressText('');
        toRef.current?.setAddressText('');
    }



    const calculatePriceByDistance = (distance: string) => {
        var returnVal = '';
        var dis = Number.parseFloat(distance);
        if (dis < 4) {
            returnVal = (setting ? setting.basePrice : 89).toString();
        } else {
            returnVal = (Number.parseFloat(setting.basePrice) * dis / 4).toFixed(2);
        }
        return returnVal;
    };

    const checkSystemSetting = async () => {
        Action.sysSetting.get()
            .then((res) => {
                if (res.data.data) {
                    setSetting(res.data.data);
                }
            })
    }

    const syncLocationData = (crd: GeoCoordinates, positionStr: string, index: number) => {
        var markersTemp = markers;
        markersTemp[index] = crd;
        setMarkers(markersTemp);
        if (index == 0) {
            setPosition(crd);
            setFromStr(positionStr)
        } else {
            setToStr(positionStr);
        }
    }

    useFocusEffect(
        useCallback(() => {
            refreshStatus();
        }, [])
    );

    useEffect(() => {
        getCurrentLocation();
        checkSystemSetting();
    }, []);

    return (
        <View style={GlobalStyles.container}>
            <HeaderBar navigation={navigation} title={'ESTIMATE'} />
            <View style={styles.formArea}>
                <View style={{ flex: 1 }}>
                    <MapView
                        style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={false}
                        loadingEnabled
                        onPress={handleMapPress}
                        onRegionChangeComplete={handleMapRegionChange}
                        region={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        {markers.map((marker, index) => (
                            (Object.keys(marker).length > 0) && (<Marker
                                key={index}
                                coordinate={marker}
                                title={index == 0 ? 'from' : 'to'}
                                draggable
                                onDragEnd={e => {
                                    const crd = e.nativeEvent.coordinate;
                                    if (index == 0) {
                                        setPosition(crd);
                                    }
                                    fetch(
                                        `https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json`,
                                    )
                                        .then(response => response.json())
                                        .then(data => {
                                            setMarkers(prevMarkers =>
                                                prevMarkers.map((prevMarker, currentIndex) =>
                                                    currentIndex === index ? crd : prevMarker,
                                                ),
                                            );
                                            if (index == 0) {
                                                setFromStr(data.display_name);
                                                fromRef.current?.setAddressText(data.display_name);
                                            } else {
                                                setToStr(data.display_name);
                                                toRef.current?.setAddressText(data.display_name);
                                            }
                                        })
                                        .catch(error => console.error('Error:', error));
                                }}
                                pinColor={index == 0 ? 'green' : 'red'}
                            />)

                        ))}
                        {(Object.keys(markers[0]).length > 0 && Object.keys(markers[1]).length > 0) && (
                            <MapViewDirections
                                origin={markers[0]}
                                destination={markers[1]}
                                apikey={'AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg'} // insert your API Key here
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
                        )}
                    </MapView>
                    <View style={{ position: 'absolute', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                        <View style={{ minHeight: 50, height: fromSearchHeight, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: GoDeliveryColors.white, paddingHorizontal: 15, borderRadius: 10, marginVertical: 3 }}>
                            <Icons name={"locate-outline"} size={24} color={GoDeliveryColors.green} style={{ marginTop: 10 }} />
                            <GooglePlacesAutocomplete
                                ref={fromRef}
                                placeholder='From'
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    const location = details?.geometry.location;
                                    setFromSearchHeight(0);
                                    if (location) {
                                        syncLocationData({
                                            latitude: location?.lat,
                                            longitude: location?.lng,
                                        }, data.description, 0);
                                    }
                                }}
                                listViewDisplayed={'auto'}
                                textInputProps={{
                                    onFocus(e) {
                                        setFromSearchHeight(200);
                                    },
                                    onChangeText(text) {
                                        if (!text) {
                                            setFromSearchHeight(0);
                                        } else {
                                            setFromSearchHeight(200);
                                        }
                                    },
                                }}
                                query={{
                                    key: 'AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg',
                                    language: 'en',
                                    components: 'country:mz'
                                }}
                            />
                        </View>
                        <View style={{ minHeight: 50, height: toSearchHeight, flexDirection: 'row', alignItems: 'flex-start', backgroundColor: GoDeliveryColors.white, paddingHorizontal: 15, borderRadius: 10, marginVertical: 3 }}>
                            <Icons name={"location-outline"} size={24} color={GoDeliveryColors.primary} style={{ marginTop: 10 }} />
                            <GooglePlacesAutocomplete
                                ref={toRef}
                                placeholder='To'
                                fetchDetails={true}
                                onPress={(data, details = null) => {
                                    const location = details?.geometry.location;
                                    setToSearchHeight(0);
                                    if (location) {
                                        syncLocationData({
                                            latitude: location?.lat,
                                            longitude: location?.lng,
                                        }, data.description, 1);
                                    }
                                }}
                                listViewDisplayed={'auto'}
                                textInputProps={{
                                    onFocus(e) {
                                        setToSearchHeight(200);
                                    },
                                    onChangeText(text) {
                                        if (!text) {
                                            setToSearchHeight(0);
                                        } else {
                                            setToSearchHeight(200);
                                        }
                                    },
                                }}
                                query={{
                                    key: 'AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg',
                                    language: 'en',
                                    components: 'country:mz'
                                }}
                            />
                        </View>
                    </View>
                    {distance && (
                        <View style={[styles.informationPad, GlobalStyles.shadowProp]}>
                            <View style={styles.infoArea}>
                                <Image source={require('../../../assets/images/icons/distance.png')} style={styles.iconImage} />
                                <Text style={GlobalStyles.subTitle}>Distance:</Text>
                                <Text style={GlobalStyles.textMedium}>{distance} KM</Text>
                            </View>
                            <View style={styles.infoArea}>
                                <Image source={require('../../../assets/images/icons/price.png')} style={styles.iconImage} />
                                <Text style={GlobalStyles.subTitle}>Price:</Text>
                                <Text style={GlobalStyles.textMedium}>MZN {price}</Text>
                            </View>
                            <View style={styles.infoArea}>
                                <Image source={require('../../../assets/images/icons/time.png')} style={styles.iconImage} />
                                <Text style={GlobalStyles.subTitle}>Pick-up duration:</Text>
                                <Text style={GlobalStyles.textMedium}>{estimationTime}min</Text>
                            </View>
                        </View>
                    )}
                </View>
                <View style={styles.buttonRow}>
                    <PrimaryButton buttonText="REQUEST" handler={handleRequest} />
                </View>
            </View>

        </View>
    );
};

const styles = StyleSheet.create({
    formArea: {
        flex: 1,
    },
    buttonRow: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    backButton: {
        borderTopLeftRadius: 30,
        borderBottomLeftRadius: 30,
        backgroundColor: GoDeliveryColors.primary,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    nextButton: {
        borderTopRightRadius: 30,
        borderBottomRightRadius: 30,
        backgroundColor: GoDeliveryColors.primary,
        width: 100,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    locationStrBack: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 3,
        borderWidth: 1,
        borderColor: GoDeliveryColors.disabled,
        borderRadius: 10,
        height: 52,
        marginTop: 10,
    },
    locationStr: {
        marginLeft: 10,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    informationPad: {
        position: 'absolute',
        bottom: 85,
        backgroundColor: GoDeliveryColors.white,
        width: '90%',
        borderRadius: 20,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignSelf: 'center'
    },
    informationStr: {
        color: GoDeliveryColors.secondary,
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    iconImage: {
        width: 35,
        height: 35,
        resizeMode: 'contain'
    },
    infoArea: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
});

export default PriceEstimate;
