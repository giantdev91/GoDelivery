import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Icons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";

import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const RECENT_LOCATIONS_MAX_LENGTH = 3;
const LOCATION_DATA_KEY = "LOCATION_DATA";
const RECENT_LOCATION_DATA_KEY = "RECENT_LOCATION_DATA";

const LocationSearch = ({ route, navigation }: {
    navigation: any;
    route: any;
}): JSX.Element => {
    const { type } = route.params;
    const [isModalVisible, setModalVisible] = useState(false);
    const [locationName, setLocationName] = useState("");
    const [locationNameError, setLocationNameError] = useState(false);
    const [locationString, setLocationString] = useState("");
    const [showSaveLocationButton, setShowSaveLocationButton] = useState(false);
    const [location, setLocation] = useState({});
    const [predefinedPlaces, setPredefinedPlaces] = useState([]);

    const handleBack = () => {
        navigation.goBack();
    }

    const handleConfirm = async () => {
        const locationDataStr = await AsyncStorage.getItem(RECENT_LOCATION_DATA_KEY);
        let locationData = [];
        if (locationDataStr) {
            locationData = JSON.parse(locationDataStr);
        }
        if (locationData.length >= RECENT_LOCATIONS_MAX_LENGTH) {
            locationData.shift();
        }
        locationData.push({ description: "Recent Location", geometry: { location: location } });
        await AsyncStorage.setItem(RECENT_LOCATION_DATA_KEY, JSON.stringify(locationData));
        const param = {
            location: location,
        }
        if (type == 0) {
            navigation.navigate("FromLocation", param);
        } else {
            navigation.navigate("ToLocation", param);
        }
    }

    const toggleModal = () => {
        setLocationName("");
        setLocationNameError(false);
        setModalVisible(!isModalVisible);
    }

    const handleSaveLocation = async () => {
        if (!locationName) {
            setLocationNameError(true);
            return;
        } else {
            setLocationNameError(false);
            const locationDataStr = await AsyncStorage.getItem(LOCATION_DATA_KEY);
            let locationArray = [];
            if (locationDataStr) {
                const locationData = JSON.parse(locationDataStr);
                locationArray = locationData;
            }
            const existingObjectIndex = locationArray.findIndex((obj: { description: string; }) => obj.description === locationName);
            if (existingObjectIndex !== -1) {
                locationArray[existingObjectIndex].geometry = { location: location };
            } else {
                locationArray.push({ description: locationName, geometry: { location: location } });
            }
            await AsyncStorage.setItem(LOCATION_DATA_KEY, JSON.stringify(locationArray));
            initializePredefinedLocations();
        }
        toggleModal();
    }

    const initializePredefinedLocations = async () => {
        const locationDataStr = await AsyncStorage.getItem(LOCATION_DATA_KEY);
        const recentLocationDataStr = await AsyncStorage.getItem(RECENT_LOCATION_DATA_KEY);
        let locationDataArray: any[] = [];

        if (recentLocationDataStr) {
            const recentLocationData = JSON.parse(recentLocationDataStr);
            locationDataArray = [
                ...locationDataArray,
                ...recentLocationData
            ]
        }

        if (locationDataStr) {
            const locationData = JSON.parse(locationDataStr);
            locationDataArray = [
                ...locationDataArray,
                ...locationData
            ];
            setPredefinedPlaces(locationDataArray);
        }
    }

    useEffect(() => {
        initializePredefinedLocations();
    }, [])

    return (
        <View style={GlobalStyles.container}>
            <View style={[GlobalStyles.headerSection]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>{type == 0 ? 'PICK UP LOCATION' : 'DROP OFF LOCATION'}</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                    <Icons name='checkmark-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
            </View>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: GoDeliveryColors.white, paddingHorizontal: 15, borderRadius: 10, marginVertical: 3 }}>
                    <Icons
                        name={type == 0 ? "locate-outline" : "location-outline"}
                        size={24}
                        color={type == 0 ? GoDeliveryColors.green : GoDeliveryColors.primary}
                        style={{ marginTop: 10 }} />
                    <GooglePlacesAutocomplete
                        placeholder={type == 0 ? "Pick up location" : "Drop off location"}
                        fetchDetails={true}
                        onPress={(data, details = null) => {
                            const location = details?.geometry.location;
                            if (location) {
                                setShowSaveLocationButton(true);
                                setLocationString(data.description);
                                setLocation(location)
                            }
                        }}
                        listViewDisplayed={'auto'}
                        predefinedPlaces={predefinedPlaces}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                            // components: 'country:mz'
                        }}
                    />
                    {
                        showSaveLocationButton && (<TouchableOpacity onPress={toggleModal}>
                            <Icons name={"heart-outline"} size={24} color={GoDeliveryColors.primary} style={{ marginTop: 10 }} />
                        </TouchableOpacity>)
                    }
                </View>
            </View>

            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                <View style={styles.saveLocationNameDialog}>
                    <Text style={GlobalStyles.subTitle}>Title</Text>
                    <TextInput value={locationName} onChangeText={value => setLocationName(value)} style={[styles.locationNameInput, { borderColor: locationNameError ? GoDeliveryColors.primary : GoDeliveryColors.disabled }]} />
                    <View style={{ height: 100, marginTop: 10, }}>
                        <Text style={GlobalStyles.textDisable}>{locationString}</Text>
                    </View>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSaveLocation}><Text style={styles.btnText}>Save</Text></TouchableOpacity>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    saveLocationNameDialog: {
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    locationNameInput: {
        borderWidth: 1,
        borderColor: GoDeliveryColors.disabled,
        borderRadius: 5,
        width: '100%'
    },
    saveBtn: {
        width: '50%',
        padding: 10,
        backgroundColor: GoDeliveryColors.primary,
        alignItems: 'center',
        borderRadius: 5,
        alignSelf: 'center'
    },
    btnText: {
        color: GoDeliveryColors.white,
        fontSize: 14,
        fontWeight: '600'
    }
})

export default LocationSearch;