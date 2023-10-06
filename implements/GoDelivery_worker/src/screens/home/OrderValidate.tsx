import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View, ScrollView } from "react-native"
import Icons from "react-native-vector-icons/Ionicons";
import { Checkbox } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import GlobalStyles from "../../styles/style"
import GoDeliveryColors from "../../styles/colors"
import Action from '../../service';
import PrimaryButton from '../../components/PrimaryButton';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import TwillioService from '../../service/TwillioService';
import store from '../../redux/store';

const OrderValidate = ({ navigation, route }: {
    navigation: any,
    route: any,
}) => {
    const deliverymanID = store.getState().CurrentUser.user.id;

    const { orderID, phone } = route.params;
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [value, setValue] = useState('');
    const [checked, setChecked] = useState(false);
    const [myOrder, setMyOrder] = useState({
        client: {
            phone: '',
            name: '',
        },
        receiver: '',
        from: '',
        to: '',
        expectationTime: ''
    });
    const [distance, setDistance] = useState('');
    const [price, setPrice] = useState('');

    const handleReceive = async () => {
        setActivityIndicator(true);
        if (await TwillioService.checkVerification('+' + phone, value)) {
            Action.order.receiveGoods({ orderID: orderID })
                .then((res) => {
                    const response = res.data;
                    setActivityIndicator(false);
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'GoDelivery',
                        textBody: "Successfully completed!",
                        button: 'OK',
                    })
                    navigation.navigate("Home");
                }).catch((err) => {
                    console.log("error: ", err);
                    setActivityIndicator(false);
                })
        } else {
            setActivityIndicator(false);
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'GoDelivery',
                textBody: "Validation failed. Try again.",
                button: 'OK',
            })
        }
    }

    const fetchMyOrder = () => {
        Action.order.fetchMyOrder({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                const orderInfo = response.data;
                setMyOrder(orderInfo);
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    useEffect(() => {
        fetchMyOrder();
    }, []);

    return (
        <View style={[GlobalStyles.container]}>
            <AlertNotificationRoot>
                <View style={[GlobalStyles.headerSection]}>
                    <Text style={GlobalStyles.whiteHeaderTitle}>DELIVERY CODE</Text>
                </View>
                <ScrollView>
                    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
                        <View style={styles.locationStrSection}>
                            <Icons
                                name="locate-outline"
                                size={30}
                                color={GoDeliveryColors.secondary}
                            />
                            <View style={{ flex: 1, }}>
                                <Text style={GlobalStyles.subTitle}>Pick-up location</Text>
                                <Text numberOfLines={2} style={GlobalStyles.text}>
                                    {myOrder["from"]}
                                </Text>
                            </View>
                        </View>
                        <View style={styles.locationStrSection}>
                            <Icons
                                name="location-outline"
                                size={30}
                                color={GoDeliveryColors.secondary}
                            />
                            <View style={{ flex: 1, }}>
                                <Text style={GlobalStyles.subTitle}>Delivery location</Text>
                                <Text numberOfLines={2} style={GlobalStyles.text}>
                                    {myOrder["to"]}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 15 }}>
                            <View style={styles.infoLabelBack}>
                                <Image
                                    source={require('../../../assets/images/icons/distance.png')}
                                    style={styles.iconImg}
                                />
                                <Text style={GlobalStyles.subTitle}>Distance: {myOrder["distance"]} KM</Text>
                            </View>
                            <View style={styles.infoLabelBack}>
                                <Image
                                    source={require('../../../assets/images/icons/price.png')}
                                    style={styles.iconImg}
                                />
                                <Text style={GlobalStyles.subTitle}>Price: MZN {myOrder["price"]}</Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 20, paddingHorizontal: 20 }}>
                            <Text style={GlobalStyles.subTitle}>Payment method</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }}>
                                <Checkbox
                                    status={checked ? 'checked' : 'unchecked'}
                                    onPress={() => {
                                        setChecked(!checked);
                                    }}
                                />
                                <Text style={GlobalStyles.textBold}>CASH</Text>
                            </View>
                        </View>
                        <View style={{ backgroundColor: '#fcf2ab', padding: 20, flexDirection: 'row', gap: 10, marginHorizontal: 20, borderRadius: 5, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
                            <Icons name="warning-outline" size={50} color={"#fec200"} />
                            <Text style={[GlobalStyles.textBold, { flex: 1 }]}>Before delivering the package to the receiver, please validate it by entering the OTP code generated by our System.</Text>
                        </View>
                        <View style={{ flex: 1, justifyContent: 'space-between', marginVertical: 15, paddingHorizontal: 20 }}>
                            <View style={{ width: '80%', height: 60, justifyContent: 'center', alignItems: 'center', alignSelf: 'center' }}>
                                <OTPInputView
                                    autoFocusOnLoad={false}
                                    pinCount={6}
                                    style={{ borderColor: 'black', }}
                                    code={value}
                                    onCodeChanged={code => setValue(code)}
                                    onCodeFilled={code => setValue(code)}
                                    codeInputFieldStyle={{
                                        borderColor: GoDeliveryColors.primary,
                                        borderRadius: 100,
                                        color: GoDeliveryColors.secondary,
                                    }} />
                            </View>
                            <View style={{ marginTop: 30 }}>
                                <PrimaryButton buttonText='VALIDATE & PAY' handler={handleReceive} />
                            </View>
                        </View>
                    </View>
                    {
                        activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                    }
                </ScrollView>
            </AlertNotificationRoot>
        </View>
    )
}

const styles = StyleSheet.create({
    topStatusBar: {
        flexDirection: 'row',
        backgroundColor: GoDeliveryColors.primary,
        width: '100%',
        height: 60,
        alignItems: 'center',
        paddingLeft: 80,
        justifyContent: 'space-between',
        paddingRight: 20,
    },
    locationStrSection: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
        paddingHorizontal: 20,
        gap: 10,
    },
    infoLabelBack: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
        paddingHorizontal: 20,
    },
    iconImg: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
})

export default OrderValidate;