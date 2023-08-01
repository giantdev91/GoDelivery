import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import PrimaryButton from '../../components/PrimaryButton';

interface ScreenProps {
    navigation: any;
}

interface ControlButtonProps {
    handler: any,
    children: any,
}

const ControlButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.orderControlButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const CallButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const InProgressScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const handleSend = () => {

    }

    const handleReceive = () => {

    }

    const handleCall = () => {

    }

    const handleGoToDetail = () => {
        navigation.navigate('InProgressDetail');
    }

    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>In Progress</Text>
            </View>
            <ScrollView style={styles.scrollArea}>
                <TouchableOpacity onPress={handleGoToDetail}>
                    <View style={styles.dataCard}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                            <Text style={GlobalStyles.textBold}>Order 1234</Text>
                            <Text style={GlobalStyles.text}>spent time 50min</Text>
                            <Text style={GlobalStyles.text}>delivery man 15039287830</Text>
                            <Text style={GlobalStyles.text}>status <Text style={[GlobalStyles.textDisable, GlobalStyles.diabledColor]}>created</Text></Text>
                        </View>
                        <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                {/* <ControlButton handler={handleSend}>SEND</ControlButton> */}
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <CallButton handler={handleCall} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                            </View>
                            <Text style={GlobalStyles.textDisable}>2023-07-14 10:15</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToDetail}>
                    <View style={styles.dataCard}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                            <Text style={GlobalStyles.textBold}>Order 1234</Text>
                            <Text style={GlobalStyles.text}>spent time 50min</Text>
                            <Text style={GlobalStyles.text}>delivery man 15039287830</Text>
                            <Text style={GlobalStyles.text}>status <Text style={[GlobalStyles.textDisable, GlobalStyles.assignedColor]}>assigned</Text></Text>
                        </View>
                        <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <ControlButton handler={handleSend}>SEND</ControlButton>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <CallButton handler={handleCall} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                            </View>
                            <Text style={GlobalStyles.textDisable}>2023-07-14 10:15</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToDetail}>
                    <View style={styles.dataCard}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                            <Text style={GlobalStyles.textBold}>Order 1234</Text>
                            <Text style={GlobalStyles.text}>spent time 50min</Text>
                            <Text style={GlobalStyles.text}>delivery man 15039287830</Text>
                            <Text style={GlobalStyles.text}>status <Text style={[GlobalStyles.textDisable, GlobalStyles.processingColor]}>processing</Text></Text>
                        </View>
                        <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <ControlButton handler={handleSend}>RECEIVED</ControlButton>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <CallButton handler={handleCall} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                            </View>
                            <Text style={GlobalStyles.textDisable}>2023-07-14 10:15</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToDetail}>
                    <View style={styles.dataCard}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                            <Text style={GlobalStyles.textBold}>Order 1234</Text>
                            <Text style={GlobalStyles.text}>spent time 50min</Text>
                            <Text style={GlobalStyles.text}>delivery man 15039287830</Text>
                            <Text style={GlobalStyles.text}>status <Text style={[GlobalStyles.textDisable, GlobalStyles.processingColor]}>processing</Text></Text>
                        </View>
                        <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <ControlButton handler={handleSend}>RECEIVED</ControlButton>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <CallButton handler={handleCall} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                            </View>
                            <Text style={GlobalStyles.textDisable}>2023-07-14 10:15</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleGoToDetail}>
                    <View style={styles.dataCard}>
                        <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                            <Text style={GlobalStyles.textBold}>Order 1234</Text>
                            <Text style={GlobalStyles.text}>spent time 50min</Text>
                            <Text style={GlobalStyles.text}>delivery man 15039287830</Text>
                            <Text style={GlobalStyles.text}>status <Text style={[GlobalStyles.textDisable, GlobalStyles.processingColor]}>processing</Text></Text>
                        </View>
                        <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <ControlButton handler={handleSend}>RECEIVED</ControlButton>
                            </View>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                <CallButton handler={handleCall} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                            </View>
                            <Text style={GlobalStyles.textDisable}>2023-07-14 10:15</Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </ScrollView >
        </View >
    )
}

const styles = StyleSheet.create({
    headerSection: {
        alignItems: 'center',
        height: 80,
        width: '100%',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: GoDeliveryColors.primary,
    },
    scrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    dataCard: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.white,
        height: 140,
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
    orderControlButton: {
        width: 100,
        height: 30,
    },
    callButton: {
        width: 40,
        height: 40,
    }
});

export default InProgressScreen;