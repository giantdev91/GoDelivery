import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, TouchableOpacity, View, Text, TextInput } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from "react-native-modal";

import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import { BackIcon, ClockIcon, ConfirmCheckIcon, FavIcon, FromLocationIcon, SearchIcon, ToLocationIcon } from '../../../common/Icons';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider } from 'react-native-paper';

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
    const [recentLocations, setRecentLocations] = useState([]);

    const handleBack = () => {
        navigation.goBack();
    }

    const handleClickSavedLocation = (savedLocation: any, locationString: string) => {
        const param = {
            location: savedLocation,
            locationString: locationString
        }
        if (type == 0) {
            navigation.navigate("FromLocation", param);
        } else {
            navigation.navigate("ToLocation", param);
        }
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
        locationData.push({ description: "Recent Location", geometry: { location: location, locationString: locationString } });
        await AsyncStorage.setItem(RECENT_LOCATION_DATA_KEY, JSON.stringify(locationData));
        const param = {
            location: location,
            locationString: locationString
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
                locationArray[existingObjectIndex].geometry = { location: location, locationString: locationString };
            } else {
                locationArray.push({ description: locationName, geometry: { location: location, locationString: locationString } });
            }
            await AsyncStorage.setItem(LOCATION_DATA_KEY, JSON.stringify(locationArray));
            initializePredefinedLocations();
        }
        toggleModal();
    }

    const initializePredefinedLocations = async () => {
        const locationDataStr = await AsyncStorage.getItem(LOCATION_DATA_KEY);
        const recentLocationDataStr = await AsyncStorage.getItem(RECENT_LOCATION_DATA_KEY);

        if (recentLocationDataStr) {
            const recentLocationData = JSON.parse(recentLocationDataStr);
            setRecentLocations(recentLocationData);
        }

        if (locationDataStr) {
            const locationData = JSON.parse(locationDataStr);
            setPredefinedPlaces(locationData);
        }
    }

    useFocusEffect(
        useCallback(() => {
            initializePredefinedLocations();
        }, [])
    )

    return (
        <View style={GlobalStyles.container}>
            <View style={[GlobalStyles.headerSection]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>{type == 0 ? 'Pick Up Location' : 'Drop Off Location'}</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                    <ConfirmCheckIcon />
                </TouchableOpacity>
            </View>

            <View>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', backgroundColor: GoDeliveryColors.white, paddingHorizontal: 25, borderRadius: 10, marginVertical: 3 }}>
                    <View style={{ marginTop: 10 }}>
                        {
                            type == 0 ? <FromLocationIcon /> : <ToLocationIcon />
                        }
                    </View>
                    <GooglePlacesAutocomplete
                        placeholder={type == 0 ? "Enter Pick up location" : "Enter Drop off location"}
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
                        // predefinedPlaces={predefinedPlaces}
                        query={{
                            key: GOOGLE_API_KEY,
                            language: 'en',
                            components: 'country:mz'
                        }}
                    />
                    {
                        showSaveLocationButton && (<TouchableOpacity onPress={toggleModal}>
                            <View style={{ marginTop: 10 }}>
                                <FavIcon />
                            </View>
                        </TouchableOpacity>)
                    }
                    {
                        !showSaveLocationButton && (
                            <View style={{ marginTop: 10 }}>
                                <SearchIcon />
                            </View>
                        )
                    }
                </View>
                <ScrollView>
                    <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.disabled, marginLeft: 25, marginVertical: 10 }]}>SAVED LOCATION</Text>
                    {
                        predefinedPlaces.map((item, key) => (
                            <View key={key}>
                                <TouchableOpacity onPress={() => { handleClickSavedLocation(item.geometry.location, item.geometry.locationString) }}>
                                    <View style={{ marginHorizontal: 25, marginVertical: 10 }}>
                                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.primary }]}>{item.description}</Text>
                                        <Text style={[GlobalStyles.textDisable]}>{item.geometry.locationString}</Text>
                                    </View>
                                </TouchableOpacity>
                                <Divider style={GlobalStyles.dividerStyle} />
                            </View>
                        ))
                    }
                </ScrollView>
            </View>

            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                <View style={styles.saveLocationNameDialog}>
                    <Text style={GlobalStyles.subTitle}>Title</Text>
                    <TextInput
                        value={locationName}
                        onChangeText={value => setLocationName(value)}
                        placeholderTextColor={GoDeliveryColors.placeHolder}
                        style={[styles.locationNameInput, { borderColor: locationNameError ? GoDeliveryColors.primary : GoDeliveryColors.disabled }]} />
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