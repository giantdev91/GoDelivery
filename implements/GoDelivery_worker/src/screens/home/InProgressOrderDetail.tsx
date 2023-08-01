import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import CustomizedInput from '../../components/CustomizedInput';
import PrimaryButton from '../../components/PrimaryButton';
import GoDeliveryColors from '../../styles/colors';

interface ScreenProps {
    navigation: any;
}

interface ControlButtonProps {
    handler: any,
    children: any,
}

const DistanceComponent = () => (
    <View style={[styles.distanceComponent, GlobalStyles.shadowProp]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <Icons name='locate-outline' size={24} color={GoDeliveryColors.disabled} />
            <Text style={[GlobalStyles.text, { marginLeft: 10 }]}>745 Lincoln Pl, New York</Text>
        </View>
        <Text style={[GlobalStyles.text, { justifyContent: 'flex-end' }]}>10 min</Text>
    </View>
)

const ControlButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.orderControlButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const DeliveryManDetailDialog = () => {
    const handleCall = () => {

    }

    const handleSMS = () => {

    }

    return (
        <View style={[styles.deliveryManDetailDialog, GlobalStyles.shadowProp]}>
            <View style={[{ height: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }]}>
                <Image source={require('../../../assets/images/user_default_avatar.png')} style={{ width: 45, height: 45, }} />
                <View style={{ flexDirection: 'column', height: '100%', marginLeft: 10, alignItems: 'flex-start', justifyContent: 'space-evenly' }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <Icons name='star' size={20} color={'gold'} />
                        <Text style={[GlobalStyles.text, { marginLeft: 10, }]}>4.7</Text>
                    </View>
                    <Text style={GlobalStyles.text}>Jorn Martin</Text>
                </View>
            </View>
            <View style={[{ height: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }]}>
                <ControlButton handler={handleCall}>
                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },]}>
                        <Icons name='call-outline' size={15} color={GoDeliveryColors.white} />
                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white, marginLeft: 10 }]}>call</Text>
                    </View>
                </ControlButton>
                <ControlButton handler={handleCall}>
                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },]}>
                        <Icons name='paper-plane-outline' size={15} color={GoDeliveryColors.white} />
                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white, marginLeft: 10 }]}>message</Text>
                    </View>
                </ControlButton>
            </View>
        </View>
    )
}


const OrderDetailScreen = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} />
            <Image source={require('../../../assets/images/track_map.png')} style={{ height: '100%', resizeMode: 'stretch' }} />
            <DistanceComponent />
            <DeliveryManDetailDialog />
        </View>
    )
}

const styles = StyleSheet.create({
    avatarArea: {
        marginTop: 30,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 160,
        height: 160,
        borderRadius: 200,
    },
    profileFormArea: {
        padding: 20,
        flex: 1,
    },
    textFieldErrorMsgArea: {
        height: 35,
        paddingLeft: 20,
    },
    distanceComponent: {
        position: 'absolute',
        top: 70,
        alignSelf: 'center',
        width: '85%',
        borderRadius: 40,
        backgroundColor: GoDeliveryColors.white,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    deliveryManDetailDialog: {
        width: '80%',
        backgroundColor: 'white',
        borderRadius: 20,
        height: 85,
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderControlButton: {
        width: 100,
        height: 30,
    },
});

export default OrderDetailScreen;