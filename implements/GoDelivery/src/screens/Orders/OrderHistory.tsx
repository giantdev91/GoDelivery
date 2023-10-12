import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { View } from 'react-native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import Action from '../../service';
import store from '../../redux/store';
import CommonFunctions from '../../common/CommonFunctions';
import { BigDocumentIcon, HeaderOptionIcon, RadioOffIcon, RadioOnIcon } from '../../common/Icons';
import { Divider } from 'react-native-paper';
import CustomIndicator from '../../common/CustomIndicator';

const OrderHistory = ({ navigation }: {
    navigation: any;
}) => {
    const currentUser = store.getState().CurrentUser.user;
    const [orders, setOrders] = useState([]);
    const [switchShow, setSwitchShow] = useState(false);
    const [orderStatus, setOrderStatus] = useState(0);
    const [activityIndicator, setActivityIndicator] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    }

    const toggleSwitch = () => {
        setSwitchShow(!switchShow);
    }

    const fetchOrders = async () => {
        setActivityIndicator(true);
        const sendOrdersResponse = await Action.order.completeOrders({ status: 3, sender: currentUser.id });
        const sendOrders = sendOrdersResponse.data.data;
        const receivedOrdersResponse = await Action.order.completeOrders({ status: 3, receiver: currentUser.phone });
        const receivedOrders = receivedOrdersResponse.data.data;
        const cancelledOrdersResponse = await Action.order.completeOrders({ status: 4, sender: currentUser.id });
        const cancelledOrders = cancelledOrdersResponse.data.data;
        let orders: any[] = [];
        if (orderStatus == 0) {
            orders = [
                ...sendOrders,
                ...receivedOrders,
                ...cancelledOrders
            ]
        }
        if (orderStatus == 1) {
            orders = [
                ...sendOrders,
            ]
        }
        if (orderStatus == 2) {
            orders = [
                ...receivedOrders,
            ]
        }
        if (orderStatus == 3) {
            orders = [
                ...cancelledOrders,
            ]
        }
        setOrders(orders);
        setActivityIndicator(false);
    }

    useEffect(() => {
        fetchOrders();
    }, [orderStatus])

    useFocusEffect(
        useCallback(() => {
            setOrderStatus(0);
            fetchOrders();
        }, [])
    )

    return (
        <View style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
            <View style={[GlobalStyles.headerSection, { zIndex: 100 }]}>
                <Text style={GlobalStyles.whiteHeaderTitle}>{orderStatus == 0 ? 'Order History' : orderStatus == 1 ? 'Sent' : orderStatus == 2 ? 'Received' : 'Cancelled'}</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={toggleSwitch}>
                    <HeaderOptionIcon />
                </TouchableOpacity>
                {
                    switchShow && (
                        <View style={[styles.switchDialog, GlobalStyles.shadowProp]}>
                            <TouchableOpacity onPress={() => { setOrderStatus(0); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>ALL</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setOrderStatus(1); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>SENT</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setOrderStatus(2); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>RECEIVED</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setOrderStatus(3); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>CANCELLED</Text></TouchableOpacity>
                        </View>
                    )
                }
            </View>
            <ScrollView style={{ marginVertical: 30 }}>
                {
                    orders.map((order, key) => (
                        <TouchableOpacity key={key} onPress={() => {
                            navigation.navigate("OrderDetail", { orderID: order["id"] })
                        }}>
                            <View style={[styles.orderCard]}>
                                <View style={styles.textSection}>
                                    <View style={styles.locationTextRow}>
                                        <RadioOnIcon />
                                        <View style={{ width: '90%' }}>
                                            <Text style={GlobalStyles.textBold}>{CommonFunctions.formatDateToString(new Date(order["createdAt"]))}</Text>
                                            <Text numberOfLines={3} style={GlobalStyles.textDisable}>{order["from"]}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.locationTextRow}>
                                        {
                                            order["status"] == 3 ? <RadioOnIcon /> : <RadioOffIcon />
                                        }
                                        <View style={{ width: '90%' }}>
                                            <Text numberOfLines={3} style={GlobalStyles.textDisable}>{order["to"]}</Text>
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
                                    <View style={[styles.statusBar, { backgroundColor: order["status"] == 3 ? GoDeliveryColors.green : GoDeliveryColors.primary }]}>
                                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>{order["status"] == 3 ? 'Completed' : 'Cancelled'}</Text>
                                    </View>
                                </View>
                            </View>
                            <Divider style={GlobalStyles.dividerStyle} />
                        </TouchableOpacity>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <BigDocumentIcon />
                            <Text style={{ textAlign: 'center', fontSize: 18, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                        </View>
                    )
                }
            </ScrollView>
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
    orderCard: {
        flexDirection: 'row',
        gap: 15,
        padding: 10,
        borderRadius: 5,
        backgroundColor: GoDeliveryColors.white,
        marginHorizontal: 10,
        marginVertical: 7,
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
    }
});

export default OrderHistory;