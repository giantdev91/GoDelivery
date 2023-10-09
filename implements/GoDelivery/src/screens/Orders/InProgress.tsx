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

const InProgress = ({ navigation }: {
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
        Action.order.inprogressOrders({ sender: currentUser.id, receiver: currentUser.phone })
            .then((res) => {
                const response = res.data;
                if (orderStatus == 0) {
                    setOrders(response.data);
                } else {
                    setOrders(response.data.filter((item: any) => item.status == orderStatus))
                }
                setActivityIndicator(false);
            }).catch(err => {
                setActivityIndicator(false);
                console.log("error: ", err);
            })
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
                <Text style={GlobalStyles.whiteHeaderTitle}>{orderStatus == 0 ? 'IN PROGRESS' : orderStatus == 1 ? 'PICK UP' : 'DROP OFF'}</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={toggleSwitch}>
                    <HeaderOptionIcon />
                </TouchableOpacity>
                {
                    switchShow && (
                        <View style={[styles.switchDialog, GlobalStyles.shadowProp]}>
                            <TouchableOpacity onPress={() => { setOrderStatus(0); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>ALL</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setOrderStatus(1); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>PICK UP</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setOrderStatus(2); toggleSwitch(); }} style={{ paddingVertical: 7 }}><Text style={GlobalStyles.textMedium}>DROP OFF</Text></TouchableOpacity>
                        </View>
                    )
                }
            </View>
            <ScrollView style={{ marginVertical: 30 }}>
                {
                    orders.map((order, key) => (
                        <TouchableOpacity key={key} onPress={() => {
                            navigation.navigate("InProgressOrderDetail", { orderID: order["id"] })
                        }}>
                            <View style={[styles.orderCard]}>
                                <View style={styles.textSection}>
                                    <View style={styles.locationTextRow}>
                                        {
                                            order["status"] >= 1 ? <RadioOnIcon /> : <RadioOffIcon />
                                        }
                                        <View style={{ width: '90%' }}>
                                            <Text style={GlobalStyles.textBold}>{CommonFunctions.formatDateToString(new Date(order["expectationTime"]))}</Text>
                                            <Text numberOfLines={3} style={GlobalStyles.textDisable}>{order["from"]}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.locationTextRow}>
                                        {
                                            order["status"] == 2 ? <RadioOnIcon /> : <RadioOffIcon />
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
                                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>{order["status"] == 0 ? 'Pending' : 'Processing'}</Text>
                                    </View>
                                </View>
                            </View>
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
                <ActivityIndicator
                    size={'large'}
                    style={{ position: 'absolute', alignSelf: 'center', top: 300 }}
                />
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
        resizeMode: 'stretch'
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
    }
});

export default InProgress;