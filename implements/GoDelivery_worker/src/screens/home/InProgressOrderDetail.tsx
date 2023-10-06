import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Linking, Dimensions, Image, TextInput, ActivityIndicator } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import MapViewDirections from 'react-native-maps-directions';
import store from '../../redux/store';
import Action from '../../service';
import { ControlButtonProps } from "../../type";
import Icons from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { UPDATE_INTERVAL } from '../../common/Constant';
import TwillioService from '../../service/TwillioService';

const MAP_WIDTH = Dimensions.get('screen').width;
const MAP_HEIGHT = Dimensions.get('screen').height - 275;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.01; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log("GOOGLE_API_KEY: ", GOOGLE_API_KEY);

const CallButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const OrderDetail = ({ navigation, route }: {
    navigation: any;
    route: any;
}): JSX.Element => {
    const [deliverymanPosition, setDeliverymanPosition] = useState({
        "latitude": 0,
        "longitude": 0,
    });
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
    const [orderStatus, setOrderStatus] = useState(1);
    const [senderLocation, setSenderLocation] = useState({
        "latitude": 0,
        "longitude": 0,
    });
    const [receiverLocation, setReceiverLocation] = useState({
        "latitude": 0,
        "longitude": 0,
    });
    const [estimationTime, setEstimationTime] = useState('');
    const [allPositionDataLoaded, setAllPositionDataLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [showComment, setShowComment] = useState(false);
    const [arriveClick, setArriveClick] = useState('');

    const deliverymanID = store.getState().CurrentUser.user.id;

    const renderDateTimeFormat = (timestamp: string) => {
        const originalDate = new Date(timestamp);
        const formattedDate = originalDate.toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
            timeZone: "UTC",
        });
        return formattedDate;
    }

    const checkDeliverymanStatus = () => {
        Action.deliveryman.getById(deliverymanID)
            .then((res) => {
                const response = res.data;
                if (response.data.locationLatitude != null && response.data.locationLongitude != null) {
                    const updatedDeliverymanPosition = { latitude: parseFloat(response.data.locationLatitude), longitude: parseFloat(response.data.locationLongitude) };
                    setDeliverymanPosition(updatedDeliverymanPosition);
                    setAllPositionDataLoaded(true);
                }
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const fetchMyOrder = () => {
        Action.order.fetchMyOrder({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                const orderInfo = response.data;
                console.log("orderInfo ==> ", orderInfo);
                if (orderInfo != null) {
                    setMyOrder(orderInfo);
                    setOrderStatus(orderInfo.status);
                    setSenderLocation({ latitude: parseFloat(orderInfo.fromX), longitude: parseFloat(orderInfo.fromY) });
                    setReceiverLocation({ latitude: parseFloat(orderInfo.toX), longitude: parseFloat(orderInfo.toY) });
                    checkDeliverymanStatus();
                }

            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const handleCancelSubmit = () => {
        if (cancelReason) {
            setActivityIndicator(true);
            const param = {
                orderID: myOrder.id,
                cancelReason: cancelReason,
                by: 1,
                deliverymanID: deliverymanID
            }
            Action.order.cancelOrder(param)
                .then((res) => {
                    const response = res.data;
                    if (response.status) {
                        setModalVisible(false);
                        setActivityIndicator(false);
                    }
                }).catch((err) => {
                    console.error("error: ", err);
                    setActivityIndicator(false);
                });
        } else {
            return;
        }

    }

    const handleSend = async (orderID: number) => {
        setActivityIndicator(true);
        Action.order.sendGoods({ orderID: orderID })
            .then((res) => {
                const response = res.data;
                setShowComment(false);
                fetchMyOrder();
                setActivityIndicator(false);
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'GoDelivery',
                    textBody: "Successfully updated!",
                    button: 'OK',
                })
            }).catch((err) => {
                console.log("error: ", err);
                setActivityIndicator(false);
            })
    }

    const handleReceive = async (orderID: number) => {
        setActivityIndicator(true);
        if (await TwillioService.sendSMSVerfication('+' + myOrder["receiver"])) {
            setActivityIndicator(false);
            navigation.navigate("OrderValidate", { orderID: orderID, phone: myOrder["receiver"] });
        } else {
            Dialog.show({
                type: ALERT_TYPE.DANGER,
                title: 'GoDelivery',
                textBody: 'Send verification code failed. Try again.',
                button: 'OK',
            })
            setActivityIndicator(false);
        }
    }


    const navigateToPayment = () => {
        const params = {
            id: myOrder.id,
            from: myOrder.from,
            to: myOrder.to,
            price: myOrder.price,
        }
        console.log("params ===> ", params);
        navigation.navigate("Payment", params);
    }

    const handleArrive = () => {
        Action.order.sendArriveNotification({ orderID: myOrder.id })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    if (orderStatus == 1) {
                        setArriveClick('collect');
                        if (myOrder["payOption"] == '2') {
                            navigateToPayment();
                        }
                    }
                    if (orderStatus == 2) {
                        setArriveClick('deliver');
                        if (myOrder["payOption"] == '1') {
                            navigateToPayment();
                        }
                    }
                }
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchMyOrder();
            setShowComment(false);
        }, [])
    );

    useEffect(() => {
        fetchMyOrder();
        const interval = setInterval(checkDeliverymanStatus, UPDATE_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <View style={{ flex: 1, height: MAP_HEIGHT }}>
            <AlertNotificationRoot>
                {
                    myOrder?.status && (
                        <View style={styles.orderInfoArea}>
                            <View style={[{ flex: 1 }, GlobalStyles.shadowProp]}>
                                {allPositionDataLoaded && (
                                    <MapView
                                        style={{ flex: 1, }}
                                        provider={PROVIDER_GOOGLE}
                                        region={{
                                            latitude: deliverymanPosition["latitude"],
                                            longitude: deliverymanPosition["longitude"],
                                            latitudeDelta: LATITUDE_DELTA,
                                            longitudeDelta: LONGITUDE_DELTA,
                                        }}>
                                        <Marker
                                            coordinate={senderLocation}
                                            title={'sender'}
                                            pinColor='red'
                                        />
                                        <Marker
                                            coordinate={receiverLocation}
                                            title={'receiver'}
                                            pinColor='green'
                                        />
                                        <Marker
                                            coordinate={deliverymanPosition}
                                            title={'delivery man'}
                                        >
                                            <Image source={require("../../../assets/images/motor.png")} style={{ width: 40, height: 40, }} />
                                        </Marker>
                                        {orderStatus == 1 && (<MapViewDirections
                                            origin={deliverymanPosition}
                                            destination={senderLocation}
                                            apikey={GOOGLE_API_KEY} // insert your API Key here
                                            strokeWidth={4}
                                            strokeColor={GoDeliveryColors.primary}
                                            onReady={result => {
                                                setEstimationTime(result.duration.toString());
                                            }}
                                        />)}
                                        {orderStatus == 1 && (<MapViewDirections
                                            origin={senderLocation}
                                            destination={receiverLocation}
                                            apikey={GOOGLE_API_KEY} // insert your API Key here
                                            strokeWidth={4}
                                            strokeColor={GoDeliveryColors.primary}
                                            onReady={result => {
                                                setEstimationTime(result.duration.toString());
                                            }}
                                        />)}
                                        {orderStatus == 2 && (<MapViewDirections
                                            origin={deliverymanPosition}
                                            destination={receiverLocation}
                                            apikey={GOOGLE_API_KEY} // insert your API Key here
                                            strokeWidth={4}
                                            strokeColor={GoDeliveryColors.primary}
                                            onReady={result => {
                                                setEstimationTime(result.duration.toString());
                                            }}
                                        />)}

                                    </MapView>
                                )}
                                <TouchableOpacity onPress={() => setShowComment(true)}>
                                    <View style={styles.orderInfoPadMini}>
                                        <Divider style={styles.headerDivider} />
                                        <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'PICK-UP LOCATION' : 'DROP OFF LOCATION'}</Text>
                                        <Text style={GlobalStyles.text}>{myOrder["status"] == 1 ? myOrder["from"] : myOrder["to"]}</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            {/* cancel modal start */}
                            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                                <View style={{ height: 280, backgroundColor: GoDeliveryColors.white, borderRadius: 30, alignItems: 'center' }}>
                                    <View style={styles.modalBack}>
                                        <Text style={{ fontSize: 16, fontWeight: 'bold', color: GoDeliveryColors.primary, }}>Do you really want to cancel this order? Please leave the reason in the below box.</Text>
                                        <TextInput style={[styles.descriptionBack]} multiline={true} placeholder='please leave your feeback here.' value={cancelReason} onChangeText={(val) => { setCancelReason(val) }} />
                                        <TouchableOpacity style={styles.rateUsBtn} onPress={handleCancelSubmit}>
                                            <Text style={{ fontSize: 18, color: GoDeliveryColors.white }}>Submit</Text>
                                        </TouchableOpacity>
                                    </View>
                                    {
                                        activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                                    }
                                </View>
                            </Modal>
                            {/* cancel modal end */}

                            {/* order detail modal start */}
                            <Modal
                                isVisible={showComment}
                                onSwipeComplete={() => setShowComment(false)}
                                onBackdropPress={() => { setShowComment(false) }}
                                swipeDirection={['down']}
                                propagateSwipe={true}
                                style={styles.commentModal}
                            >
                                <View style={styles.commentModalBack}>
                                    <View style={[styles.locationArea]}>
                                        <Divider style={styles.headerDivider} />
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 5 }}>
                                            <View style={{ flex: 1, }}>
                                                <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'PICK-UP LOCATION' : 'DROP OFF LOCATION'}</Text>
                                                <Text style={GlobalStyles.textDisable}>{myOrder["status"] == 1 ? myOrder["from"] : myOrder["to"]}</Text>
                                            </View>
                                            <TouchableOpacity style={[styles.arrivedButton, GlobalStyles.shadowProp]} onPress={handleArrive}>
                                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Arrived</Text>
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                    <Divider style={styles.divider} />
                                    <View style={[styles.horizontalAlign, { paddingHorizontal: 20, marginVertical: 5 }]}>
                                        <View>
                                            {!myOrder["client"]['avatar'] && (
                                                <Image
                                                    style={styles.userAvatar}
                                                    source={require('../../../assets/images/user_default_avatar.png')}
                                                />
                                            )}
                                            {myOrder["client"]['avatar'] && (
                                                <Image style={styles.userAvatar} source={{ uri: myOrder["client"]['avatar'] }} />
                                            )}
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.horizontalAlign}>
                                                <View>
                                                    <Text style={GlobalStyles.subTitle}>Sender</Text>
                                                    <Text style={GlobalStyles.textDisable}>{myOrder["client"]["name"]}</Text>
                                                    <Text style={GlobalStyles.textDisable}>{myOrder["client"]["phone"]}</Text>
                                                </View>
                                                <CallButton handler={() => { Linking.openURL(`tel:${myOrder["client"]["phone"]}`); }}  ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                                            </View>
                                        </View>
                                    </View>
                                    <View style={[styles.horizontalAlign, { paddingHorizontal: 20, marginVertical: 5, marginBottom: 20 }]}>
                                        <View style={{ width: 50 }}>
                                        </View>
                                        <View style={{ flex: 1 }}>
                                            <View style={styles.horizontalAlign}>
                                                <View>
                                                    <Text style={GlobalStyles.subTitle}>Receiver</Text>
                                                    <Text style={GlobalStyles.textDisable}>{myOrder["receiverName"]}</Text>
                                                    <Text style={GlobalStyles.textDisable}>{myOrder["receiver"]}</Text>
                                                </View>
                                                <CallButton handler={() => { Linking.openURL(`tel:${myOrder["receiver"]}`); }}  ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                                            </View>
                                        </View>
                                    </View>
                                    <Divider style={styles.divider} />
                                    <View style={[styles.horizontalAlign, { paddingHorizontal: 20, marginVertical: 5, marginBottom: 20 }]}>

                                        <View style={{ flex: 1 }}>
                                            <View style={styles.horizontalAlign}>
                                                <View style={{ flex: 1 }}>
                                                    <Text style={GlobalStyles.subTitle}>Item Details</Text>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                                        <Text style={GlobalStyles.textDisable}>Weight</Text>
                                                        <Text style={GlobalStyles.textDisable}>{myOrder["goodsWeight"]}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                                        <Text style={GlobalStyles.textDisable}>Volume</Text>
                                                        <Text style={GlobalStyles.textDisable}>{myOrder["goodsVolumn"]}</Text>
                                                    </View>
                                                    <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                                                        <Text style={GlobalStyles.textDisable}>Type of Goods</Text>
                                                        <Text style={GlobalStyles.textDisable}>{myOrder["goodsType"]}</Text>
                                                    </View>
                                                    <Text style={GlobalStyles.textDisable}>{myOrder["description"]}</Text>
                                                </View>

                                            </View>
                                        </View>
                                    </View>
                                    <Divider style={styles.divider} />
                                    <View style={styles.locationArea}>
                                        <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'DROP OFF LOCATION' : 'PICK-UP LOCATION'}</Text>
                                        <Text style={GlobalStyles.textDisable}>{myOrder["status"] == 2 ? myOrder["from"] : myOrder["to"]}</Text>
                                        {
                                            myOrder["status"] == 1 && (
                                                <View style={styles.controlButtonArea}>
                                                    <TouchableOpacity style={[styles.controlButtonBack, GlobalStyles.shadowProp, { backgroundColor: arriveClick != 'collect' ? GoDeliveryColors.primayDisabled : GoDeliveryColors.primary }]} disabled={arriveClick != 'collect'} onPress={() => handleSend(myOrder["id"])}>
                                                        <Icons name="archive-outline" size={30} color={GoDeliveryColors.white} />
                                                        <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Collect</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity style={[styles.controlButtonBack, GlobalStyles.shadowProp, { backgroundColor: GoDeliveryColors.disabled }]} onPress={() => setModalVisible(true)}>
                                                        <Icons name="trash-outline" size={30} color={GoDeliveryColors.white} />
                                                        <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Cancel</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                        {
                                            myOrder["status"] == 2 && (
                                                <View style={styles.controlButtonArea}>
                                                    <TouchableOpacity style={[styles.controlButtonBack, GlobalStyles.shadowProp, { backgroundColor: arriveClick != 'deliver' ? GoDeliveryColors.primayDisabled : GoDeliveryColors.primary }]} disabled={arriveClick != 'deliver'} onPress={() => handleReceive(myOrder["id"])}>
                                                        <Icons name="cart-outline" size={30} color={GoDeliveryColors.white} />
                                                        <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Deliver</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                                {
                                    activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                                }
                            </Modal>
                            {/* order detail modal end */}
                        </View>
                    )
                }
            </AlertNotificationRoot>
        </View>

    );
}

const styles = StyleSheet.create({
    orderInfoArea: {
        flex: 1,
        display: 'flex',
        width: '100%',
    },
    orderDetailSection: {

    },
    cancelBtnBack: {
        backgroundColor: GoDeliveryColors.disabled,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        height: 35,
        marginRight: 20,
    },
    callButton: {
        width: 40,
        height: 40,
    },
    modalBack: {
        position: 'absolute',
        width: '100%',
        height: 240,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    descriptionBack: {
        borderColor: GoDeliveryColors.disabled,
        width: '100%',
        borderWidth: 1,
        height: 120,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontSize: 12,
        marginTop: 10,
        verticalAlign: 'top',
        textAlignVertical: 'top'
    },
    rateUsBtn: {
        width: '50%',
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 5,
        backgroundColor: GoDeliveryColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    orderInfoPadMini: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 120,
        backgroundColor: GoDeliveryColors.white,
        padding: 20,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        borderWidth: 0.5,
        borderColor: GoDeliveryColors.place,
        borderBottomWidth: 0
    },
    containerContent: { flex: 1, marginTop: 40 },
    containerHeader: {
        flex: 1,
        alignContent: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        backgroundColor: '#F1F1F1',
    },
    headerContent: {
        marginTop: 0,
    },
    Modal: {
        backgroundColor: '#005252',
        marginTop: 0,
    },
    commentModal: {
        bottom: 0,
        justifyContent: 'flex-end',
        width: '100%',
        alignSelf: 'center',
        marginBottom: -20,
    },
    commentModalBack: {
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 5,
        paddingVertical: 20,
    },
    locationArea: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    headerDivider: {
        borderColor: GoDeliveryColors.disabled,
        borderWidth: 1,
        width: 70,
        alignSelf: 'center',
        marginBottom: 10,
    },
    divider: {
        borderColor: GoDeliveryColors.disabled,
        borderWidth: 0.25,
        width: '100%',
        alignSelf: 'center',
        marginBottom: 10,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 200,
    },
    horizontalAlign: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10
    },
    controlButtonArea: {
        flexDirection: 'row',
        gap: 30,
        paddingVertical: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    controlButtonBack: {
        width: 100,
        height: 70,
        backgroundColor: GoDeliveryColors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
    },
    arrivedButton: {
        backgroundColor: GoDeliveryColors.primary,
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 5,
    }
});

export default OrderDetail;