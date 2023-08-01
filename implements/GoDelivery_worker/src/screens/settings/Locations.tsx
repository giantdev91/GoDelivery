import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import GoDeliveryColors from '../../styles/colors';

interface ScreenProps {
    navigation: any;
}

const LocationsScreen = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'Locations'} />
            <ScrollView style={styles.locationDataScrollArea}>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
                <View style={styles.locationCard}>
                    <View>
                        <Text style={GlobalStyles.text}>Favourite Location info</Text>
                        <Text style={GlobalStyles.text}>Reference building name or location</Text>
                    </View>
                    <TouchableOpacity style={styles.deleteLocationButton}>
                        <Icons name="trash-outline" size={30} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    locationDataScrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    locationCard: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.white,
        height: 80,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: GoDeliveryColors.secondary,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 8,
                shadowColor: GoDeliveryColors.secondary
            },
        }),
    },
    
    deleteLocationButton: {
        padding: 10,
    }
});

export default LocationsScreen;