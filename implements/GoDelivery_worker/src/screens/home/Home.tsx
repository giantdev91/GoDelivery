import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, Platform, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import Icons from 'react-native-vector-icons/Ionicons';
import { Switch } from 'react-native-switch';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import Action from '../../service';
import store from '../../redux/store';
import OfflineScreen from '../../components/OfflineScreen';
import CommonFunctions from '../../common/CommonFunctions';

const HomeScreen = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    const [deliverymanStatus, setDeliverymanStatus] = useState(false);
    const [hasWork, setHasWork] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalOrderCount, setTotalOrderCount] = useState(0);
    const [todayRevenue, setTodayRevenue] = useState(0);
    const [todayOrderCount, setTodayOrderCount] = useState(0);
    const [weekRevenue, setWeekRevenue] = useState(0);
    const [weekOrderCount, setWeekOrderCount] = useState(0);
    const [monthRevenue, setMonthRevenue] = useState(0);
    const [monthOrderCount, setMonthOrderCount] = useState(0);

    const deliverymanID = store.getState().CurrentUser.user.id;

    const handleSwitch = (val: boolean) => {
        Action.deliveryman.updateDeliverymanStatus({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setDeliverymanStatus(val);
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'GoDelivery',
                        textBody: response.message,
                        button: 'OK',
                    })
                    setDeliverymanStatus(true);
                }
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const checkDeliverymanStatus = () => {
        Action.deliveryman.getById(deliverymanID)
            .then((res) => {
                const response = res.data;
                const deliveryman = response.data;
                const myOrders = deliveryman.orders || [];
                const workingOrders = myOrders.filter((e: any) => { return (e["status"] == 1 || e["status"] == 2) });
                setHasWork(workingOrders.length > 0);
                setDeliverymanStatus(deliveryman.status == 1);
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const refreshHandler = () => {
        checkDeliverymanStatus();
    }

    const getTotalRevenue = () => {
        Action.statistics.totalRevenue({ deliverymanId: deliverymanID })
            .then((res) => {
                const response = res.data;
                setTotalRevenue(response.data[0].revenue);
                setTotalOrderCount(response.data[0].orderCount);
            })
        Action.statistics.todayRevenue({ deliverymanId: deliverymanID })
            .then((res) => {
                const response = res.data;
                setTodayRevenue(response.data[0].revenue);
                setTodayOrderCount(response.data[0].orderCount);
            })
        Action.statistics.weekRevenue({ deliverymanId: deliverymanID })
            .then((res) => {
                const response = res.data;
                setWeekRevenue(response.data[0].revenue);
                setWeekOrderCount(response.data[0].orderCount);
            })
        Action.statistics.monthRevenue({ deliverymanId: deliverymanID })
            .then((res) => {
                const response = res.data;
                setMonthRevenue(response.data[0].revenue);
                setMonthOrderCount(response.data[0].orderCount);
            })
    }

    const getValues = () => {
        getTotalRevenue();
    }

    const handleNetworkChange = (state: any) => {
        setConnectionStatus(state.isConnected);
    };

    // Use useFocusEffect to fetch orders whenever the screen gains focus
    useFocusEffect(
        useCallback(() => {
            refreshHandler();
            getValues();
        }, [])
    );

    useEffect(() => {
        const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
        return () => {
            netInfoSubscription && netInfoSubscription();
        };
    }, []);

    return (
        <AlertNotificationRoot>
            <View style={[GlobalStyles.container]}>
                <View style={[GlobalStyles.headerSection]}>
                    <Text style={GlobalStyles.whiteHeaderTitle}>HOME</Text>
                    <View style={GlobalStyles.headerCheckButton}>
                        <Switch
                            value={deliverymanStatus}
                            onValueChange={(val) => { handleSwitch(val); }}
                            activeText={'work'}
                            inActiveText={'free'}
                            circleSize={30}
                            barHeight={35}
                            circleBorderWidth={0}
                            backgroundActive={GoDeliveryColors.disabled}
                            backgroundInactive={GoDeliveryColors.disabled}
                            circleActiveColor={GoDeliveryColors.primary}
                            circleInActiveColor={GoDeliveryColors.green}
                            // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                            changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                            renderActiveText={true}
                            renderInActiveText={true}
                            switchLeftPx={5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                            switchRightPx={5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                            switchWidthMultiplier={2.8} // multiplied by the `circleSize` prop to calculate total width of the Switch
                            switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                        />
                    </View>
                </View>

                {/* status card start */}
                <ScrollView style={{ flex: 1, padding: 20 }}>
                    <Text style={GlobalStyles.textMedium}>Earnings</Text>
                    <View style={[styles.mainCard]}>
                        <View style={{ flexDirection: 'row', gap: 20, alignItems: 'center', justifyContent: 'flex-start' }}>
                            <Icons name="wallet-outline" size={60} color={GoDeliveryColors.white} />
                            <View>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Total Earning</Text>
                                <Text style={[GlobalStyles.headerTitle, { color: GoDeliveryColors.white }]}>MZN {CommonFunctions.getLocalNumberValue(totalRevenue)}</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20, }}>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>Today</Text>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>MZN {CommonFunctions.getLocalNumberValue(todayRevenue)}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center', borderColor: GoDeliveryColors.white, borderLeftWidth: 1, borderRightWidth: 1, paddingHorizontal: 20 }}>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>This Week</Text>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>MZN {CommonFunctions.getLocalNumberValue(weekRevenue)}</Text>
                            </View>
                            <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>This Month</Text>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>MZN {CommonFunctions.getLocalNumberValue(monthRevenue)}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Text style={GlobalStyles.textMedium}>Orders</Text>
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View style={[styles.ordersCard]}>
                                <Text style={GlobalStyles.headerTitle}>{CommonFunctions.getLocalNumberValue(todayOrderCount)}</Text>
                                <Text style={GlobalStyles.textMedium}>Today's Orders</Text>
                            </View>
                            <View style={styles.ordersCard}>
                                <Text style={GlobalStyles.headerTitle}>{CommonFunctions.getLocalNumberValue(weekOrderCount)}</Text>
                                <Text style={GlobalStyles.textMedium}>This Week Orders</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View style={styles.ordersCard}>
                                <Text style={GlobalStyles.headerTitle}>{CommonFunctions.getLocalNumberValue(totalOrderCount)}</Text>
                                <Text style={GlobalStyles.textMedium}>Total Orders</Text>
                            </View>
                        </View>
                    </View>

                    <View style={{ marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', gap: 20 }}>
                            <View style={[styles.ordersCard, { backgroundColor: GoDeliveryColors.green }]}>
                                <Text style={[GlobalStyles.headerTitle, { color: GoDeliveryColors.white, fontSize: 24, fontWeight: '900' }]}>MZN {CommonFunctions.getLocalNumberValue(totalRevenue)}</Text>
                                <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.white }]}>Cash for this year</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                {/* status card end */}
                {
                    !connectionStatus && (
                        <OfflineScreen />
                    )
                }
            </View >
        </AlertNotificationRoot>

    )
}

const styles = StyleSheet.create({
    mainCard: {
        padding: 20,
        backgroundColor: GoDeliveryColors.golden,
        borderRadius: 5,
        gap: 20,
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
                shadowColor: GoDeliveryColors.secondary,
            },
        }),
    },
    ordersCard: {
        flex: 1,
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
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
                shadowColor: GoDeliveryColors.secondary,
            },
        }),
    }
});

export default HomeScreen;