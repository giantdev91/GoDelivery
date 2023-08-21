import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import { Switch } from 'react-native-switch';
import Icons from 'react-native-vector-icons/Ionicons';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MenuButton from '../../components/MenuButton';
import Action from '../../service';
import store from '../../redux/store';

import OrderDetail from './InProgressOrderDetail';
import OfflineScreen from '../../components/OfflineScreen';
import NewOrderCard from '../../components/NewOrderCard';
import { ActivityIndicator } from 'react-native';

const HomeScreen = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    const [deliverymanStatus, setDeliverymanStatus] = useState(false);
    const [hasWork, setHasWork] = useState(false);
    const [orders, setOrders] = useState([]);
    const [connectionStatus, setConnectionStatus] = useState(false);
    const [activityIndicator, setActivityIndicator] = useState(false);

    const deliverymanID = store.getState().CurrentUser.user.id;

    const fetchCreatedOrderList = () => {
        Action.order.createdOrderList({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                setOrders(response.data);
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const handleAccept = (orderID: number) => {
        if (!activityIndicator) {
            setActivityIndicator(true);
            Action.order.acceptOrder({ orderID: orderID, deliverymanID: deliverymanID })
                .then((res) => {
                    const response = res.data;
                    Alert.alert("GoDelivery", response.message);
                    refreshHandler();
                    setActivityIndicator(false);
                }).catch((err) => {
                    console.error("error: ", err);
                    setActivityIndicator(false);
                });
        }

    }

    const handleSwitch = (val: boolean) => {
        Action.deliveryman.updateDeliverymanStatus({ deliverymanID: deliverymanID })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setDeliverymanStatus(val);
                    // refreshHandler();
                } else {
                    Alert.alert("GoDelivery", response.message);
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
                console.log('myorders ===> ', myOrders);
                const workingOrders = myOrders.filter((e: any) => { return (e["status"] == 1 || e["status"] == 2) });
                console.log('workingOrders ===> ', workingOrders);
                setHasWork(workingOrders.length > 0);
                setDeliverymanStatus(deliveryman.status == 1);
                console.log('workingOrders.length > 0 ===> ', workingOrders.length > 0);
                // setDeliverymanPosition({ latitude: parseFloat(response.data.locationLatitude), longitude: parseFloat(response.data.locationLongitude) })
            }).catch((err) => {
                console.error("error: ", err);
            })
    }

    const refreshHandler = () => {
        checkDeliverymanStatus();
        fetchCreatedOrderList();
    }

    const handleNetworkChange = (state: any) => {
        setConnectionStatus(state.isConnected);
    };

    // Use useFocusEffect to fetch orders whenever the screen gains focus
    useFocusEffect(
        useCallback(() => {
            refreshHandler();
            const interval = setInterval(fetchCreatedOrderList, 10000);
            return () => {
                clearInterval(interval);
            }
        }, [])
    );

    useEffect(() => {
        const netInfoSubscription = NetInfo.addEventListener(handleNetworkChange);
        return () => {
            netInfoSubscription && netInfoSubscription();
        };
    }, []);

    return (
        <View style={[GlobalStyles.container]}>
            <View style={[styles.topStatusBar, { backgroundColor: connectionStatus ? GoDeliveryColors.green : GoDeliveryColors.gray }]}>
                <Text style={[GlobalStyles.headerTitle, { color: GoDeliveryColors.white }]}>{connectionStatus ? 'ONLINE' : 'OFFLINE'}</Text>
                <View style={[styles.switchBack, { alignItems: connectionStatus ? 'flex-end' : 'flex-start' }]}>
                    <View style={styles.switchBall}></View>
                </View>

            </View>
            <MenuButton navigation={navigation} />
            {
                connectionStatus && (
                    <ScrollView style={{ marginBottom: 0, flex: 1 }}>
                        <View style={styles.workStatusBar}>
                            <Text style={GlobalStyles.subTitle}>MY STATUS</Text>
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
                        {
                            !deliverymanStatus && orders.map((order, index) => (
                                <NewOrderCard key={index} order={order} handleAccept={handleAccept} />
                            ))
                        }
                        {
                            (deliverymanStatus && hasWork) && (<OrderDetail refreshHandler={refreshHandler} navigation={navigation} />)
                        }
                        {
                            (deliverymanStatus && !hasWork) && (
                                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                                    <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                                    <Text style={{ textAlign: 'center', fontSize: 20, color: GoDeliveryColors.secondary, marginTop: 50 }}>You have no order yet</Text>
                                </View>
                            )
                        }
                    </ScrollView>
                )
            }
            {
                !connectionStatus && (
                    <OfflineScreen />
                )
            }
            {activityIndicator && (
                <ActivityIndicator
                    size={'large'}
                    style={{ position: 'absolute', alignSelf: 'center', bottom: 200 }}
                />
            )}
        </View >
    )
}

const styles = StyleSheet.create({
    topStatusBar: {
        flexDirection: 'row',
        backgroundColor: GoDeliveryColors.green,
        width: '100%',
        height: 60,
        alignItems: 'center',
        paddingLeft: 80,
        justifyContent: 'space-between',
        paddingRight: 20,
    },
    workStatusBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        height: 40,
    },
    switchBack: {
        borderWidth: 2,
        borderColor: 'white',
        width: 62,
        height: 28,
        borderRadius: 30,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    switchBall: {
        width: 24,
        height: 24,
        borderRadius: 30,
        backgroundColor: GoDeliveryColors.white,
    },
    headerSection: {
        height: 150,
        marginTop: 70,
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GoDeliveryColors.primary,
    },
    orderInfoArea: {
        flex: 1,
        width: '100%',
        height: 650,
        padding: 15,
    },
    orderDetailSection: {

    },
    cancelBtnBack: {
        backgroundColor: GoDeliveryColors.primary,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        height: 35
    },
});

export default HomeScreen;