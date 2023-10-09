import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { requestLocationPermission } from '../../../common/RequestPermission';
import PrimaryButton from '../../../components/PrimaryButton';
import Geocoder from 'react-native-geocoding';
import allActions from '../../../redux/actions';
import mapstyle from "../../../common/mapStyles";
import { FromLocationIcon, MyLocationIcon, NotificationIcon } from '../../../common/Icons';

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.005; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
Geocoder.init(GOOGLE_API_KEY ?? "");

const FromLocation = ({ route, navigation }: { route: any, navigation: any }) => {
    const dispatch = useDispatch();
    const [region, setRegion] = useState({
        latitude: null,
        longitude: null,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
    });

    const [fromStr, setFromStr] = useState('Pickup Location');

    const toNotifications = () => {
        navigation.navigate("Notifications");
    }

    const toLocationSearch = () => {
        navigation.navigate("LocationSearch", { type: 0 });
    }

    const getCurrentLocation = () => {
        if (route.params == undefined) {
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

    const handleNextButton = async () => {
        dispatch(allActions.OrderAction.setNewOrder({ fromLocation: region, fromStr: fromStr }));
        navigation.navigate("ToLocation");
    };

    const setlocationStringFromGeoLocationInfo = (latitude: number, longitude: number) => {
        Geocoder.from(latitude, longitude)
            .then(json => {
                const formattedAddress = json.results[0].formatted_address;
                setFromStr(formattedAddress);
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

    const handleRegionChange = (region: any) => {
        setRegion(region);
        setlocationStringFromGeoLocationInfo(region.latitude, region.longitude);

    }

    useEffect(() => {
        getCurrentLocation();
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
                }
                if (locationString) {
                    setFromStr(locationString);
                }
            }
        }, [])
    );

    return (
        <View style={GlobalStyles.container}>
            {/* header section start */}
            <View style={[GlobalStyles.headerSection]}>
                <Text style={GlobalStyles.whiteHeaderTitle}>PICK UP YOUR DELIVERY</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={toNotifications}>
                    <NotificationIcon />
                </TouchableOpacity>
            </View>
            {/* header section end */}
            <View style={{ flex: 1 }}>
                {
                    region.latitude != null && (
                        <MapView
                            style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                            provider={PROVIDER_GOOGLE}
                            loadingEnabled
                            onRegionChangeComplete={handleRegionChange}
                            customMapStyle={mapstyle}
                            region={region}>
                            {/* <Marker
                            coordinate={region}
                        /> */}
                        </MapView>
                    )
                }

                {/* map marker start */}
                <View style={GlobalStyles.markerContainer}>
                    <Image source={require("../../../../assets/images/map-marker.png")} style={GlobalStyles.mapMarker} resizeMode='contain' />
                    <Text style={GlobalStyles.markerLabel}>Pick</Text>
                </View>
                {/* map marker end */}

                {/* location string board start */}
                <View style={{ position: 'absolute', width: '100%', paddingHorizontal: 20, marginTop: 10 }}>
                    <TouchableOpacity onPress={toLocationSearch}>
                        <View style={[GlobalStyles.locationStrContainer, GlobalStyles.shadowProp]}>
                            <FromLocationIcon />
                            <Text style={GlobalStyles.locationStr}>{fromStr}</Text>
                        </View>
                    </TouchableOpacity>
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

                <View style={styles.buttonRow}>
                    <PrimaryButton buttonText="Confirm" handler={handleNextButton} />
                </View>
            </View>
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
    }
});

export default FromLocation;
