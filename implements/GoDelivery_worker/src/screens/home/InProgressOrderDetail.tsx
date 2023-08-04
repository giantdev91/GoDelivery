import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Linking, Dimensions, Image, TextInput, ActivityIndicator } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import store from '../../redux/store';
import Action from '../../service';
import { ControlButtonProps } from "../../type";
import Icons from "react-native-vector-icons/Ionicons";
import Modal from "react-native-modal";

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
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

const OrderDetail = (): JSX.Element => {
    const [deliverymanPosition, setDeliverymanPosition] = useState({
        latitude: 10000,
        longitude: 10000,
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
        latitude: 10000,
        longitude: 10000,
    });
    const [receiverLocation, setReceiverLocation] = useState({
        latitude: 10000,
        longitude: 10000,
    });
    const [estimationTime, setEstimationTime] = useState('');
    const [allPositionDataLoaded, setAllPositionDataLoaded] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [cancelReason, setCancelReason] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

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
                setDeliverymanPosition({ latitude: parseFloat(response.data.locationLatitude), longitude: parseFloat(response.data.locationLongitude) })
                setAllPositionDataLoaded(true);
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const fetchMyOrder = () => {
        Action.order.fetchMyOrder({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                const orderInfo = response.data;
                setMyOrder(orderInfo);
                setOrderStatus(orderInfo.status);
                setSenderLocation({ latitude: parseFloat(orderInfo.fromX), longitude: parseFloat(orderInfo.fromY) });
                setReceiverLocation({ latitude: parseFloat(orderInfo.toX), longitude: parseFloat(orderInfo.toY) });
                checkDeliverymanStatus();
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const handleCancelSubmit = () => {

    }

    useEffect(() => {
        fetchMyOrder();
        const interval = setInterval(checkDeliverymanStatus, 60000);
        return () => {
            clearInterval(interval);
        }
    }, []);

    return (
        <View style={styles.orderInfoArea}>
            <View style={styles.orderDetailSection}>
                <Text style={GlobalStyles.textDisable}>Sender</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View>
                        <Text style={[GlobalStyles.textBold, { fontSize: 16, fontWeight: 'bold' }]}>{myOrder["client"]["phone"]}</Text>
                        <Text style={[GlobalStyles.textBold, { fontSize: 16, fontWeight: 'bold' }]}>{myOrder["client"]["name"]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity style={styles.cancelBtnBack} onPress={ } >
                            <Text style={[GlobalStyles.primaryLabel, { fontSize: 14, fontWeight: 'bold' }]}>Cancel</Text>
                        </TouchableOpacity>
                        <CallButton handler={() => { Linking.openURL(`tel:${myOrder["client"]["phone"]}`); }}  ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                    </View>
                </View>
                <Text style={[GlobalStyles.textDisable, { marginTop: 10 }]}>Receiver</Text>
                <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={[GlobalStyles.textBold, { fontSize: 16, fontWeight: 'bold' }]}>{myOrder["receiver"]}</Text>
                    <CallButton handler={() => { Linking.openURL(`tel:${myOrder["receiver"]}`); }}  ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>
                </View>
                <Text style={GlobalStyles.textDisable}>From</Text>
                <Text style={GlobalStyles.text}>{myOrder["from"]}</Text>
                <Text style={GlobalStyles.textDisable}>To</Text>
                <Text style={GlobalStyles.text}>{myOrder["to"]}</Text>
                <Text style={GlobalStyles.textDisable}>Expectation time: {renderDateTimeFormat(myOrder["expectationTime"])}</Text>
            </View>
            <View style={[{ flex: 1, marginTop: 10, borderWidth: 1, borderColor: GoDeliveryColors.primary, }, GlobalStyles.shadowProp]}>
                {allPositionDataLoaded && (
                    <MapView
                        style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                        provider={PROVIDER_GOOGLE}
                        loadingEnabled
                        region={{
                            latitude: deliverymanPosition.latitude,
                            longitude: deliverymanPosition.longitude,
                            latitudeDelta: LATITUDE_DELTA,
                            longitudeDelta: LONGITUDE_DELTA,
                        }}>
                        {senderLocation && <Marker
                            coordinate={senderLocation}
                            title={'sender'}
                        />}
                        <Marker
                            coordinate={receiverLocation}

                            title={'receiver'}
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
            </View>
            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                <View style={{ height: 500, backgroundColor: GoDeliveryColors.white, borderRadius: 30 }}>
                    <View style={styles.feedbackModalback}>
                        <Text>Do you really want to cancel this order? Please leave the reason in the below box.</Text>
                        <TextInput style={styles.descriptionBack} multiline={true} placeholder='please leave your feeback here.' value={cancelReason} onChangeText={(val) => { setCancelReason(val) }} />
                        <TouchableOpacity style={styles.rateUsBtn} onPress={handleCancelSubmit}>
                            <Text style={{ fontSize: 20, color: GoDeliveryColors.white }}>Submit</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                    }
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    orderInfoArea: {
        flex: 1,
        width: '100%',
        height: 650,
        padding: 15,
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
    }
});

export default OrderDetail;