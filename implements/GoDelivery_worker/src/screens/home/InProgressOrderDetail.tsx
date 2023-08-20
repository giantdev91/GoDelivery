import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Linking, Dimensions, Image, TextInput, ActivityIndicator, Button, FlatList } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import store from '../../redux/store';
import Action from '../../service';
import { ControlButtonProps } from "../../type";
import Icons from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";
import { Divider } from 'react-native-paper';
import { UPDATE_INTERVAL } from '../../common/Constant';

const MAP_WIDTH = Dimensions.get('screen').width;
const MAP_HEIGHT = Dimensions.get('screen').height - 275;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.01; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const CallButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const OrderDetail = ({ refreshHandler, navigation }: {
    refreshHandler: () => void,
    navigation: any
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
                console.log('orderInfo ===> !!!!!!!!!', orderInfo["client"]);
                setMyOrder(orderInfo);
                setOrderStatus(orderInfo.status);
                setSenderLocation({ latitude: parseFloat(orderInfo.fromX), longitude: parseFloat(orderInfo.fromY) });
                setReceiverLocation({ latitude: parseFloat(orderInfo.toX), longitude: parseFloat(orderInfo.toY) });
                checkDeliverymanStatus();
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
                        refreshHandler();
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

    const handleSend = (orderID: number) => {
        setActivityIndicator(true);
        Action.order.sendGoods({ orderID: orderID })
            .then((res) => {
                const response = res.data;
                setShowComment(false);
                fetchMyOrder();
                setActivityIndicator(false);
            }).catch((err) => {
                console.log("error: ", err);
                setActivityIndicator(false);
            })
    }

    const handleReceive = (orderID: number) => {
        navigation.navigate("OrderValidate", { orderID: orderID, phone: myOrder["receiver"] });
    }

    useEffect(() => {
        fetchMyOrder();
        const interval = setInterval(checkDeliverymanStatus, UPDATE_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <View style={{ flex: 1, height: MAP_HEIGHT }}>
            {
                myOrder && (
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
                                        apikey={"AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg"} // insert your API Key here
                                        strokeWidth={4}
                                        strokeColor={GoDeliveryColors.primary}
                                        onReady={result => {
                                            setEstimationTime(result.duration.toString());
                                        }}
                                    />)}
                                    {orderStatus == 1 && (<MapViewDirections
                                        origin={senderLocation}
                                        destination={receiverLocation}
                                        apikey={"AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg"} // insert your API Key here
                                        strokeWidth={4}
                                        strokeColor={GoDeliveryColors.primary}
                                        onReady={result => {
                                            setEstimationTime(result.duration.toString());
                                        }}
                                    />)}
                                    {orderStatus == 2 && (<MapViewDirections
                                        origin={deliverymanPosition}
                                        destination={receiverLocation}
                                        apikey={"AIzaSyCNl5jl7Zk09SMHDPHQI4j-6mfu3Jg0bdg"} // insert your API Key here
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
                                    <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'PICK-UP LOCATION' : 'DROP OFF LOCATION'}</Text>
                                    <Text style={GlobalStyles.text}>{myOrder["status"] == 1 ? myOrder["from"] : myOrder["to"]}</Text>
                                </View>
                            </TouchableOpacity>

                        </View>

                        <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                            <View style={{ height: 280, backgroundColor: GoDeliveryColors.white, borderRadius: 30, alignItems: 'center' }}>
                                <View style={styles.modalBack}>
                                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: GoDeliveryColors.primary, }}>Do you really want to cancel this order? Please leave the reason in the below box.</Text>
                                    <TextInput style={[styles.descriptionBack]} multiline={true} placeholder='please leave your feeback here.' value={cancelReason} onChangeText={(val) => { setCancelReason(val) }} />
                                    <TouchableOpacity style={styles.rateUsBtn} onPress={handleCancelSubmit}>
                                        <Text style={{ fontSize: 20, color: GoDeliveryColors.white }}>Submit</Text>
                                    </TouchableOpacity>
                                </View>
                                {
                                    activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                                }
                            </View>
                        </Modal>

                        <Modal
                            isVisible={showComment}
                            onSwipeComplete={() => setShowComment(false)}
                            onBackdropPress={() => { setShowComment(false) }}
                            swipeDirection={['down']}
                            propagateSwipe={true}
                            style={styles.commentModal}
                        >
                            <View style={styles.commentModalBack}>
                                <View style={styles.locationArea}>
                                    <Divider style={styles.headerDivider} />
                                    <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'PICK-UP LOCATION' : 'DROP OFF LOCATION'}</Text>
                                    <Text style={GlobalStyles.text}>{myOrder["status"] == 1 ? myOrder["from"] : myOrder["to"]}</Text>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={[styles.horizontalAlign, { paddingHorizontal: 20, marginVertical: 5 }]}>
                                    <View>
                                        {!myOrder["client"]['avatar'] && (
                                            <Image
                                                style={styles.userAvatar}
                                                source={require('../../../assets/images/delivery-man.png')}
                                            />
                                        )}
                                        {myOrder["client"]['avatar'] && (
                                            <Image style={styles.userAvatar} source={{ uri: myOrder["client"]['avatar'] }} />
                                        )}
                                    </View>
                                    <View style={{ flex: 1 }}>
                                        <View style={styles.horizontalAlign}>
                                            <View>
                                                <Text style={GlobalStyles.subTitle}>Sender details</Text>
                                                <Text style={GlobalStyles.text}>{myOrder["client"]["name"]}</Text>
                                                <Text style={GlobalStyles.text}>{myOrder["client"]["phone"]}</Text>
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
                                                <Text style={GlobalStyles.subTitle}>Receiver details</Text>
                                                <Text style={GlobalStyles.text}>{myOrder["receiver"]}</Text>
                                            </View>
                                            <CallButton handler={() => { Linking.openURL(`tel:${myOrder["receiver"]}`); }}  ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                                        </View>
                                    </View>
                                </View>
                                <Divider style={styles.divider} />
                                <View style={styles.locationArea}>
                                    <Text style={GlobalStyles.subTitle}>{myOrder["status"] == 1 ? 'DROP OFF LOCATION' : 'PICK-UP LOCATION'}</Text>
                                    <Text style={GlobalStyles.text}>{myOrder["status"] == 2 ? myOrder["from"] : myOrder["to"]}</Text>
                                    {
                                        myOrder["status"] == 1 && (
                                            <View style={styles.controlButtonArea}>
                                                <TouchableOpacity style={[styles.controlButtonBack, GlobalStyles.shadowProp]} onPress={() => handleSend(myOrder["id"])}>
                                                    <Icons name="archive-outline" size={30} color={GoDeliveryColors.white} />
                                                    <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Collected</Text>
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
                                                <TouchableOpacity style={[styles.controlButtonBack, GlobalStyles.shadowProp]} onPress={() => handleReceive(myOrder["id"])}>
                                                    <Icons name="cart-outline" size={30} color={GoDeliveryColors.white} />
                                                    <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Delivered</Text>
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
                    </View>
                )
            }
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
        borderRadius: 30,
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
        borderRadius: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        fontSize: 14,
        marginTop: 10,
        verticalAlign: 'top',
        textAlignVertical: 'top'
    },
    rateUsBtn: {
        width: '50%',
        paddingHorizontal: 20,
        paddingVertical: 7,
        borderRadius: 10,
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
        height: 80,
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
        borderRadius: 20,
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
        borderWidth: 0.5,
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
        borderRadius: 10,
    }
});

export default OrderDetail;