import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions } from 'react-native';

import Icons from 'react-native-vector-icons/Ionicons';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { GooglePlacesAutocomplete, } from 'react-native-google-places-autocomplete';
import { GeoCoordinates, TabSceneProps } from '../../type';
import { requestLocationPermission } from '../../common/RequestPermission';


const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.005; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Step1Scene = (props: TabSceneProps) => {
    const ref = useRef();
    const [position, setPosition] = useState({
        latitude: 10,
        longitude: 10,
    });
    const [positionStr, setPositionStr] = useState('');

    //get predefined positions
    const homePlace = {
        description: 'Home',
        geometry: { location: { lat: 48.8152937, lng: 2.4597668 } },
    };
    const workPlace = {
        description: 'Work',
        geometry: { location: { lat: 48.8496818, lng: 2.2940881 } },
    };

    const syncLocationData = (crd: GeoCoordinates, position: string) => {
        setPosition(crd);
        setPositionStr(position);
        ref.current?.setAddressText(position);
    }

    const getLocation = () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        const crd = position.coords;
                        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json`)
                            .then(response => response.json())
                            .then(data => {
                                syncLocationData(crd, data.display_name);
                            })
                            .catch(error => console.error('Error:', error));
                    },
                    error => {
                        console.log(error.code, error.message);
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                )
            }
        })
    }

    const handleNextButton = () => {
        props.handleNext({
            location: position,
            displayName: positionStr,
        });
    }

    useEffect(() => {
        getLocation();
    }, []);

    return (
        <View style={GlobalStyles.container}>
            <View style={{ height: 70 }}>
                <Text style={GlobalStyles.subTitleText}>Pick Sender’s Location</Text>
                <TouchableOpacity style={{ position: 'absolute', right: 30, bottom: 25 }}>
                    <Icons name="heart-outline" size={30} color={GoDeliveryColors.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.formArea}>
                <View style={{ flex: 1, }}>
                    <MapView
                        style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                        provider={PROVIDER_GOOGLE}
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        loadingEnabled
                        region={{
                            latitude: position.latitude,
                            longitude: position.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        <Marker
                            coordinate={position}
                            title={'From Location'}
                            draggable
                            onDragEnd={(e) => {
                                const crd = e.nativeEvent.coordinate;
                                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${crd.latitude}&lon=${crd.longitude}&format=json`)
                                    .then(response => response.json())
                                    .then(data => {
                                        syncLocationData(crd, data.display_name);
                                    })
                                    .catch(error => console.error('Error:', error));
                            }} />
                    </MapView>
                    <GooglePlacesAutocomplete
                        ref={ref}
                        placeholder='Search'
                        fetchDetails
                        onPress={(data, details = null) => {
                            const location = details?.geometry.location;
                            if (location) {
                                syncLocationData({
                                    latitude: location?.lat,
                                    longitude: location?.lng,
                                }, data.description);
                            }
                        }}
                        query={{
                            key: 'AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg',
                            language: 'en',
                        }}
                        predefinedPlaces={[homePlace, workPlace]}
                    />
                </View>

            </View>
            <View style={styles.buttonRow}>
                <TouchableOpacity
                    style={[styles.backButton, { backgroundColor: GoDeliveryColors.primayDisabled }]}
                    onPress={props.handleBack}
                    disabled>
                    <Text style={GlobalStyles.primaryLabel}>Back</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.nextButton]}
                    onPress={handleNextButton}
                >
                    <Text style={GlobalStyles.primaryLabel}>Next</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    formArea: {
        paddingHorizontal: 20,
        flex: 1,
    },
    buttonRow: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
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
})

export default Step1Scene;