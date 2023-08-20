import React, { useState, useCallback } from 'react';
import GlobalStyles from '../../styles/style';
import { StyleSheet, TouchableOpacity, View, Text, Image, Platform, Alert, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../../styles/colors';
import MenuButton from '../../components/MenuButton';
import LinearGradient from 'react-native-linear-gradient';
import store from '../../redux/store';
import DeliveryType from '../../components/DeliveryType';

interface ScreenProps {
    navigation: any;
}

const HomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);

    const handleNewOrder = () => {
        navigation.navigate('LocationSet');
    }

    const handleComingSoon = () => {
        Alert.alert("GoDelivery", "Coming Soon!");
    }

    // Use useFocusEffect to fetch orders whenever the screen gains focus
    useFocusEffect(
        useCallback(() => {
            setUserData(store.getState().CurrentUser.user);
        }, [])
    );


    return (
        <ScrollView style={[GlobalStyles.container]}>
            <View style={[styles.headerSection]}>
                <MenuButton navigation={navigation} />
                <View style={{ width: '100%', paddingHorizontal: 40 }}>
                    <View style={{ flexDirection: 'row', width: '100%', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                        <Text style={styles.headerTitle}>Welcome,</Text>
                        {
                            !userData["avatar"] && (
                                <Image style={styles.userAvatar} source={require('../../../assets/images/user_default_avatar.png')} />
                            )
                        }
                        {
                            userData["avatar"] && (
                                <Image style={styles.userAvatar} source={{ uri: userData["avatar"] }} />
                            )
                        }
                    </View>
                    <Text style={styles.headerTitle}>{userData.name} !</Text>
                </View>
            </View>
            <View style={styles.orderButtonSection}>
                <DeliveryType
                    title='Personal Delivery'
                    content='A to B delivery of your personal Documents, Passport, Wallet and more'
                    handler={handleNewOrder}
                />
                <DeliveryType
                    title='Restaurant Delivery'
                    content='Choose a food from your favorite restaurant'
                    handler={handleComingSoon}
                />
                <DeliveryType
                    title='Business Delivery'
                    content='A to B delivery with Multi-Drop options'
                    handler={handleComingSoon}
                />
            </View>
            <View style={{ marginTop: 10, marginBottom: 30 }}>
                <Text style={styles.comment}>Need more help?</Text>
                <TouchableOpacity
                    style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
                >
                    <Icons name="call-outline" size={20} color={GoDeliveryColors.white} />
                    <Text style={[GlobalStyles.primaryLabel, { marginLeft: 10, fontSize: 14, fontWeight: '400' }]}>CONTACT US</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        marginHorizontal: 90,
        alignItems: 'center',
        paddingTop: 20,
        justifyContent: 'flex-start',
        width: '100%',
        height: 230,
        backgroundColor: GoDeliveryColors.place,
        alignSelf: 'center'
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: "bold",
        color: GoDeliveryColors.labelColor,
        textAlign: 'left',
    },
    userAvatar: {
        width: 100,
        height: 100,
        borderRadius: 200,
    },
    orderButtonSection: {
        paddingHorizontal: 50,
        marginTop: -60,
        alignSelf: 'center',
    },
    orderButtonBack: {
        borderRadius: 50,
        width: 240,
        height: 240,
        backgroundColor: GoDeliveryColors.primary,
        borderColor: 'black',
        alignItems: 'center',
        justifyContent: 'center',
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
    pickupLogo: {
        width: 220,
        height: 100,
        resizeMode: 'contain',
    },
    pickupTitle: {
        fontSize: 48,
        fontWeight: '600',
        color: GoDeliveryColors.white,
    },
    comment: {
        fontSize: 14,
        color: GoDeliveryColors.disabled,
        fontWeight: "600",
        alignSelf: 'center',
    },
    callButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 170,
        height: 40,
    }
});

export default HomeScreen;