import React, { useState, useCallback } from 'react';
import { StyleSheet, useWindowDimensions, TouchableOpacity, View, Text, Platform } from 'react-native';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import { NavigationState, SceneMap, SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import Action from '../../service';
import store from '../../redux/store';

interface ScreenProps {
    navigation: any;
    route: any,
}

interface SceneProps {
    jumpTo: (key: string) => void;
}

const calculateSpentTime = (firstTimeStamp: string, lastTimeStamp: string) => {
    const firstTime = new Date(firstTimeStamp);
    const lastTime = new Date(lastTimeStamp);
    // Calculate the time difference in milliseconds
    const timeDifferenceMs = lastTime - firstTime;
    // Calculate hours and minutes from the time difference
    const hours = Math.floor(timeDifferenceMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours} h ${minutes} mins`;
}

const renderCreatedAtTime = (timestamp: string) => {
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

const CompleteRoute = (props: SceneProps) => {
    const [orders, setOrders] = useState([]);

    const fetchCompletedOrders = () => {
        Action.order.completeOrders({ status: 3, deliverymanID: store.getState().CurrentUser.user.id })
            .then((res) => {
                const response = res.data;
                setOrders(response.data);
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchCompletedOrders();
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView style={styles.scrollArea}>
                {
                    orders.map((order, index) => (
                        <View style={styles.dataCard} key={index}>
                            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={GlobalStyles.textBold}>Order {order["orderNo"]}</Text>
                                <Text style={GlobalStyles.text}>sender {order["client"].phone}</Text>
                                <Text style={GlobalStyles.text}>delivery time {calculateSpentTime(order["createdAt"], order["updatedAt"])}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                <Text style={GlobalStyles.textDisable}>{renderCreatedAtTime(order["createdAt"])}</Text>
                                {
                                    order["rate"] && (<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                        <Icons name="star" size={20} color={'gold'} />
                                        <Text style={GlobalStyles.text}> {order["rate"]}</Text>
                                    </View>)
                                }
                                {/* <Text style={GlobalStyles.textBold}>shipping 5$</Text> */}
                            </View>
                        </View>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 20, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                            {/* <Text style={{ textAlign: 'center', fontSize: 18, marginTop: 15, marginBottom: 100 }}>Hit the orange button down below to Create an order</Text> */}
                            {/* <PrimaryButton buttonText='Start Ordering' handler={() => { props.navigation.navigate('Main') }} /> */}
                        </View>
                    )
                }
            </ScrollView>
        </View>
    )
}

const CanceledRoute = (props: SceneProps) => {
    const [orders, setOrders] = useState([]);

    const fetchCanceledOrders = () => {
        Action.order.completeOrders({ status: 4, deliverymanID: store.getState().CurrentUser.user.id })
            .then((res) => {
                const response = res.data;
                setOrders(response.data);
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    useFocusEffect(
        useCallback(() => {
            fetchCanceledOrders();
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView style={styles.scrollArea}>
                {
                    orders.map((order, index) => (
                        <View style={styles.dataCard} key={index}>
                            <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                                <Text style={GlobalStyles.textBold}>Order {order["orderNo"]}</Text>
                                <Text style={GlobalStyles.text}>Sender {order["client"].phone}</Text>
                                <Text style={GlobalStyles.text}>delivery time {calculateSpentTime(order["createdAt"], order["updatedAt"])}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                                <Text style={GlobalStyles.textDisable}>{renderCreatedAtTime(order["createdAt"])}</Text>

                                {/* <Text style={GlobalStyles.textBold}>shipping 5$</Text> */}
                            </View>
                        </View>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 20, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    )
}

const OrdersScreen = ({ route, navigation }: ScreenProps): JSX.Element => {
    const layout = useWindowDimensions();
    const [index, setIndex] = React.useState(0);
    const [routes] = React.useState([
        { key: 'complete', title: 'COMPLETE' },
        { key: 'canceled', title: 'CANCELED' },
    ]);

    const renderScene = SceneMap({
        complete: CompleteRoute,
        canceled: CanceledRoute,
    });

    const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> }) => (
        <TabBar
            {...props}
            activeColor={GoDeliveryColors.primary}
            inactiveColor={GoDeliveryColors.disabled}
            indicatorStyle={{ backgroundColor: GoDeliveryColors.primary, height: 4, }}
            style={{ backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20, marginHorizontal: 20, }}
            labelStyle={styles.tabLabelStyle}
        />
    )


    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Work History</Text>
            </View>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: layout.width }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        alignItems: 'center',
        height: 80,
        width: '100%',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "600",
        color: GoDeliveryColors.primary,
    },
    tabLabelStyle: {
        fontSize: 16,
        fontWeight: "600",
    },
    scrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    dataCard: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.white,
        height: 80,
        borderRadius: 10,
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
                shadowColor: GoDeliveryColors.secondary
            },
        }),
    },
});

export default OrdersScreen;