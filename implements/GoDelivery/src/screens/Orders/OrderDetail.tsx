import React, { useState, useEffect, useCallback } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import FeatherIcon from 'react-native-vector-icons/Feather';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'react-native';
import Action from '../../service';
import store from '../../redux/store';
import CommonFunctions from '../../common/CommonFunctions';

const OrderDetail = ({ route, navigation }: {
    route: any;
    navigation: any;
}) => {
    const { orderID } = route.params;
    const currentUser = store.getState().CurrentUser.user;
    const [order, setOrder] = useState({});

    const handleBack = () => {
        navigation.goBack();
    }

    const getOrderDetail = () => {
        Action.order.getByID({ orderID: orderID })
            .then((res) => {
                const response = res.data;
                console.log("response ===> ", response);
                setOrder(response.data);

            }).catch(err => console.log("error: ", err));
    }

    useEffect(() => {
        getOrderDetail();
    }, []);

    return (
        <View style={[GlobalStyles.container, { backgroundColor: GoDeliveryColors.white }]}>
            <View style={[GlobalStyles.headerSection, { zIndex: 100 }]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Order Details</Text>

            </View>
            <ScrollView>
                <View style={{ padding: 10 }}>
                    <Image source={require("../../../assets/images/sample_map.png")} style={styles.mapThumbnail} />
                    <View style={{ justifyContent: 'space-between', flexDirection: 'row', marginTop: 10, }}>
                        <Text style={GlobalStyles.subTitle}>{CommonFunctions.formatDateToString(new Date(order["expectationTime"]))}</Text>
                        <Text style={GlobalStyles.subTitle}>MZN {Number(Number(order["price"]).toFixed(2)).toLocaleString()}</Text>
                    </View>
                    <Text style={GlobalStyles.textBold}>{order["goodsType"]}</Text>
                    <Text style={GlobalStyles.textDisable}>{order["description"]}</Text>
                    <Text style={GlobalStyles.textBold}>{order["goodsVolumn"]}</Text>
                    <View style={{ paddingHorizontal: 20, paddingVertical: 20, borderBottomWidth: 0.5, borderBottomColor: GoDeliveryColors.disabled }}>
                        <View style={styles.locationStringRow}>
                            <Icons name="radio-button-on-outline" size={15} color={GoDeliveryColors.primary} />
                            <View>
                                <Text style={GlobalStyles.textBold}>Pickup Location</Text>
                                <Text numberOfLines={2} style={GlobalStyles.textDisable}>{order["from"]}</Text>
                                <Text style={GlobalStyles.textDisable}>{order?.client?.name}</Text>
                                <Text style={GlobalStyles.textDisable}>+{order?.client?.phone}</Text>
                            </View>
                        </View>

                        <View style={[styles.locationStringRow, { marginTop: 20 }]}>
                            <Icons name="radio-button-off-outline" size={15} color={GoDeliveryColors.primary} />
                            <View>
                                <Text style={GlobalStyles.textBold}>Dropoff Location</Text>
                                <Text numberOfLines={2} style={GlobalStyles.textDisable}>{order["to"]}</Text>
                                <Text style={GlobalStyles.textDisable}>{order.receiverName}</Text>
                                <Text style={GlobalStyles.textDisable}>+{order.receiver}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ paddingVertical: 20 }}>
                        <Text style={GlobalStyles.textMedium}>Driver</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 10, marginTop: 10 }}>
                            <View style={{ width: 70, height: 70 }}>
                                {
                                    !order?.delivery_man?.avatar && (<Image source={require('../../../assets/images/user_default_avatar.png')} style={styles.avatarImg} />)
                                }
                                {
                                    order?.delivery_man?.avatar && (<Image source={{ uri: order?.delivery_man?.avatar }} style={styles.avatarImg} />)
                                }
                            </View>
                            <View>
                                <Text style={GlobalStyles.textBold}>{order?.delivery_man?.name}</Text>
                                <Text style={GlobalStyles.textDisable}>{order?.delivery_man?.motor?.plate}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    mapThumbnail: {
        width: '100%',
        height: 150,
        borderRadius: 20,
    },
    locationStringRow: {
        flexDirection: 'row',
        gap: 10,
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    avatarImg: {
        width: 70,
        height: 70,
        borderRadius: 100,
    },
});

export default OrderDetail;