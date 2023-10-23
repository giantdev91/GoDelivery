import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Icons from 'react-native-vector-icons/Ionicons';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import Action from '../../service';
import store from '../../redux/store';
import CommonFunctions from '../../common/CommonFunctions';
import OrderDetail from './InProgressOrderDetail';
import CustomIndicator from '../../common/CustomIndicator';

interface ScreenProps {
    navigation: any;
    route: any,
}

const OrdersScreen = ({ route, navigation }: ScreenProps): JSX.Element => {
    const currentUser = store.getState().CurrentUser.user;
    const [switchShow, setSwitchShow] = useState(false);
    const [orderStatus, setOrderStatus] = useState(1);
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [orders, setOrders] = useState([]);

    const toggleSwitch = () => {
        setSwitchShow(!switchShow);
    }

    const getTitle = () => {
        if (orderStatus == 0) {
            return "NEW ORDER";
        } else if (orderStatus == 1) {
            return "IN PROGRESS";
        } else if (orderStatus == 3) {
            return "COMPLETED";
        } else if (orderStatus == 4) {
            return "CANCELLED";
        }
    }

    const handleAccept = (orderID: number) => {
        setActivityIndicator(true);
        Action.order.acceptOrder({ orderID: orderID, deliverymanID: currentUser.id })
            .then((res) => {
                const response = res.data;
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'GoDelivery',
                    textBody: response.message,
                    button: 'close',
                })
                setOrderStatus(1);
                setActivityIndicator(false);
            }).catch((err) => {
                console.error("error: ", err);
                setActivityIndicator(false);
            });
    }

    const renderOrderList = () => {
        return (
            <ScrollView style={{ flex: 1 }}>
                {
                    orders.map((order, key) => (
                        <TouchableOpacity key={key} onPress={() => {
                            if (order["status"] == 0) {
                                handleAccept(order["id"]);
                            } else {
                                navigation.navigate("OrderDetail", { orderID: order["id"] })
                            }
                        }}>
                            <View style={[styles.orderCard]}>
                                <View style={styles.textSection}>
                                    <View style={styles.locationTextRow}>
                                        <Icons name="radio-button-on-outline" size={15} color={GoDeliveryColors.primary} />
                                        <View style={{ width: '90%' }}>
                                            <Text style={GlobalStyles.textBold}>{CommonFunctions.formatDateToString(new Date(order["expectationTime"]))}</Text>
                                            <Text numberOfLines={2} style={GlobalStyles.textDisable}>{order["from"]}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.locationTextRow}>
                                        <Icons name="radio-button-off-outline" size={15} color={GoDeliveryColors.primary} />
                                        <View style={{ width: '90%' }}>
                                            <Text numberOfLines={2} style={GlobalStyles.textDisable}>{order["to"]}</Text>
                                        </View>
                                    </View>
                                </View>
                                <View style={styles.mapSection}>
                                    {
                                        order["screenShot"] ?
                                            (
                                                <Image source={{ uri: order["screenShot"] }} style={styles.mapThumbnail} />
                                            ) :
                                            (
                                                <Image source={require("../../../assets/images/sample_map.png")} style={styles.mapThumbnail} />
                                            )
                                    }
                                    {
                                        order["status"] != 0 && (
                                            <View style={[styles.statusBar, { backgroundColor: order["status"] == 3 ? GoDeliveryColors.green : GoDeliveryColors.primary }]}>
                                                <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>{order["status"] == 3 ? 'Completed' : 'Cancelled'}</Text>
                                            </View>
                                        )
                                    }
                                    {
                                        order["status"] == 0 && (
                                            <View style={[styles.statusBar, { backgroundColor: GoDeliveryColors.primary }]}>
                                                <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>Accept</Text>
                                            </View>
                                        )
                                    }
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </ScrollView>
        )
    }

    const fetchCreatedOrderList = () => {
        setActivityIndicator(true);
        Action.order.createdOrderList({ deliverymanID: currentUser.id })
            .then((res) => {
                const response = res.data;
                setOrders(response.data);
                setActivityIndicator(false);
            }).catch((err) => {
                console.error("error: ", err);
                setActivityIndicator(false);
            })
    }

    const fetchCompletedOrders = () => {
        setActivityIndicator(true);
        Action.order.completeOrders({ status: 3, deliverymanID: currentUser.id })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setOrders(response.data);
                }
                setActivityIndicator(false);
            }).catch((err) => {
                console.log("error: ", err);
                setActivityIndicator(false);
            })
    }

    const fetchCanceledOrders = () => {
        setActivityIndicator(true);
        Action.order.completeOrders({ status: 4, deliverymanID: currentUser.id })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setOrders(response.data);
                }
                setActivityIndicator(false);
            }).catch((err) => {
                console.log("error: ", err);
                setActivityIndicator(false);
            })
    }

    const fetchOrderList = () => {
        if (orderStatus == 0) {
            fetchCreatedOrderList();
        }
        if (orderStatus == 3) {
            fetchCompletedOrders();
        }
        if (orderStatus == 4) {
            fetchCanceledOrders();
        }
    }

    useEffect(() => {
        fetchOrderList();
    }, [orderStatus]);

    return (
        <View style={[GlobalStyles.container]}>
            <AlertNotificationRoot>
                <View style={[GlobalStyles.headerSection, { zIndex: 100 }]}>
                    <Text style={GlobalStyles.whiteHeaderTitle}>{getTitle()}</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={toggleSwitch}>
                        <FeatherIcon name='more-vertical' size={25} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                    {
                        switchShow && (
                            <View style={[styles.switchDialog, GlobalStyles.shadowProp]}>
                                <TouchableOpacity onPress={() => { setOrderStatus(1); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>IN PROGRESS</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { setOrderStatus(0); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>NEW ORDER</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { setOrderStatus(3); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>COMPLETED</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => { setOrderStatus(4); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>CANCELLED</Text></TouchableOpacity>
                            </View>
                        )
                    }
                </View>
                <View style={{ flex: 1 }}>
                    {
                        (orderStatus == 0 || orderStatus == 3 || orderStatus == 4) && renderOrderList()
                    }
                    {
                        orderStatus == 1 && (
                            <OrderDetail navigation={navigation} />
                        )
                    }
                </View>
            </AlertNotificationRoot>
            {activityIndicator && (
                <CustomIndicator />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    switchDialog: {
        position: 'absolute',
        right: 10,
        top: 50,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: GoDeliveryColors.white,
        padding: 10,
        zIndex: 100,
    },
    orderCard: {
        flexDirection: 'row',
        gap: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: GoDeliveryColors.white,
        marginHorizontal: 10,
        marginVertical: 7,
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
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowColor: GoDeliveryColors.secondary,
            },
        }),
    },
    textSection: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    mapSection: {
        width: 120,
    },
    locationTextRow: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 10,
    },
    mapThumbnail: {
        width: 120,
        height: 120,
        borderRadius: 5,
    },
    statusBar: {
        position: 'absolute',
        top: 0,
        width: 120,
        height: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.green,
        borderRadius: 5,
    },
});

export default OrdersScreen;