import React from 'react';
import GlobalStyles from '../../styles/style';
import { StyleSheet, TouchableOpacity, View, Text, Image, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../../styles/colors';
import MenuButton from '../../components/MenuButton';
import LinearGradient from 'react-native-linear-gradient';

interface ScreenProps {
    navigation: any;
}

const HomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const handleNewOrder = () => {
        navigation.navigate('NewOrderCreate');
    }
    return (
        <View style={[GlobalStyles.container]}>
            <View style={styles.headerSection}>
                <Image source={require('../../../assets/images/delivery-man.png')} />
                <Text style={styles.headerTitle}>Welcome to our service</Text>
            </View>
            <View style={styles.orderButtonSection}>
                <TouchableOpacity onPress={handleNewOrder}>
                    <LinearGradient colors={[GoDeliveryColors.primary, GoDeliveryColors.primary, GoDeliveryColors.primary, GoDeliveryColors.white]} style={styles.orderButtonBack}>
                        <Image source={require('../../../assets/images/company_logo_white.png')} style={styles.pickupLogo} />
                        <Text style={styles.pickupTitle}>Pick Up</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
            <View style={{ marginTop: 10, }}>
                <Text style={styles.comment}>Need more help?</Text>
                <TouchableOpacity
                    style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
                >
                    <Icons name="call-outline" size={20} color={GoDeliveryColors.white} />
                    <Text style={[GlobalStyles.primaryLabel, { marginLeft: 10, fontSize: 14, fontWeight: '400' }]}>CONTACT US</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        marginHorizontal: 90,
        marginTop: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 36,
        fontWeight: "600",
        color: GoDeliveryColors.primary,
        textAlign: 'center',
    },
    orderButtonSection: {
        paddingHorizontal: 50,
        paddingVertical: 15,
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