import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, useWindowDimensions, TouchableOpacity, View, Text, Platform, Image, ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import { Layout } from 'react-native-reanimated';
import { NavigationState, SceneMap, SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Action from '../../service';
import store from '../../redux/store';
import PrimaryButton from '../../components/PrimaryButton';
import Modal from "react-native-modal";
import { Rating, AirbnbRating } from 'react-native-ratings';
import { TextInput } from 'react-native-gesture-handler';
import CommonFunctions from '../../common/CommonFunctions'

interface ScreenProps {
    navigation: any;
    route: any,
}

interface SceneProps {
    jumpTo: (key: string) => void;
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


const SentRoute = (props: SceneProps) => {
    const [orders, setOrders] = useState([]);
    const [isModalVisible, setModalVisible] = useState(false);
    const [rating, setRating] = useState(3);
    const [feedbackTitle, setFeedbackTitle] = useState('');
    const [feedbackContent, setFeedbackContent] = useState('');
    const [selectedOrderId, setSelectedOrderId] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

    const fetchCompletedOrders = () => {
        Action.order.completeOrders({ status: 3, sender: store.getState().CurrentUser.user.id })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setOrders(response.data);
                }
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const toggleModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setModalVisible(!isModalVisible);
    };

    const ratingCompleted = (rating: number) => {
        setRating(rating);
    }

    const handleRateUs = () => {
        setActivityIndicator(true);
        const param = {
            orderID: selectedOrderId,
            rate: rating,
            feedbackTitle: feedbackTitle,
            feedbackContent: feedbackContent
        };
        Action.order.leaveFeedback(param)
            .then((res) => {
                const response = res.data;
                setModalVisible(false);
                fetchCompletedOrders();
                setActivityIndicator(false);
            }).catch((err) => {
                console.log('error: ', err);
            })
    }

    useEffect(() => {
        // Call the callback function immediately
        const interval = setInterval(fetchCompletedOrders, 5000);
        return () => {
            clearInterval(interval);
        }
    }, []);

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
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Text style={styles.priceTitle}>MZN {order["price"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.textBold, styles.title]}>Status: </Text>
                                <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.green }, styles.content]}>{CommonFunctions.renderStatusLabel(order["status"])}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Order: </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{order["orderNo"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>From: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["from"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>To: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["to"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Details: </Text>
                                <Text style={[GlobalStyles.text]}>{CommonFunctions.formatDate(new Date(order["expectationTime"]))}, {order["distance"]}km, </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{CommonFunctions.calculateDeliveryTime(order["pickupTime"], order["dropoffTime"])}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                                {
                                    order["rate"] && (
                                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                                            <Icons name="star" size={20} color={'gold'} />
                                            <Text style={GlobalStyles.text}> {order["rate"]}</Text>
                                        </View>
                                    )
                                }
                                {
                                    !order["rate"] && (
                                        <TouchableOpacity style={[styles.feedbackButton, GlobalStyles.shadowProp]} onPress={() => { toggleModal(order["id"]) }}>
                                            <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>Leave Feedback</Text>
                                        </TouchableOpacity>
                                    )
                                }
                            </View>
                        </View>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 18, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                        </View>
                    )
                }
            </ScrollView>
            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                <View style={{ height: 500, backgroundColor: GoDeliveryColors.white, borderRadius: 30 }}>
                    <Image source={require("../../../assets/images/goods.jpg")} style={{ width: '100%', height: '100%', borderRadius: 30 }} />
                    <View style={styles.feedbackModalback}>
                        <Text style={styles.feedbackModalTitle}>Satisfied?</Text>
                        <Rating imageSize={30} onFinishRating={ratingCompleted} />
                        <TextInput style={styles.titleInputBack} placeholder='title' onChangeText={(val) => { setFeedbackTitle(val) }} value={feedbackTitle} />
                        <TextInput style={styles.descriptionBack} multiline={true} placeholder='please leave your feeback here.' value={feedbackContent} onChangeText={(val) => { setFeedbackContent(val) }} />
                        <TouchableOpacity style={styles.rateUsBtn} onPress={handleRateUs}>
                            <Text style={{ fontSize: 18, color: GoDeliveryColors.white }}>Rate us</Text>
                        </TouchableOpacity>
                    </View>
                    {
                        activityIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 70, alignSelf: 'center' }} />
                    }
                </View>
            </Modal>
        </View >
    )
}

const ReceivedRoute = (props: SceneProps) => {
    const [orders, setOrders] = useState([]);

    const fetchCompletedOrders = () => {
        Action.order.completeOrders({ status: 3, receiver: store.getState().CurrentUser.user.phone })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setOrders(response.data);
                }
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
                        <View style={[styles.dataCard, { height: 175 }]} key={index}>
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Text style={styles.priceTitle}>MZN {order["price"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.textBold, styles.title]}>Status: </Text>
                                <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.green }, styles.content]}>{CommonFunctions.renderStatusLabel(order["status"])}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Order: </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{order["orderNo"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>From: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["from"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>To: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["to"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Details: </Text>
                                <Text style={[GlobalStyles.text]}>{CommonFunctions.formatDate(new Date(order["expectationTime"]))}, {order["distance"]}km, </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{CommonFunctions.calculateDeliveryTime(order["pickupTime"], order["dropoffTime"])}</Text>
                            </View>
                        </View>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 18, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                        </View>
                    )
                }
            </ScrollView>
        </View>
    )
}

const CancelledRoute = (props: SceneProps) => {
    const [orders, setOrders] = useState([]);

    const fetchCompletedOrders = () => {
        Action.order.completeOrders({ status: 4, sender: store.getState().CurrentUser.user.id })
            .then((res) => {
                const response = res.data;
                if (response.success) {
                    setOrders(response.data);
                }
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
                        <View style={[styles.dataCard, { height: 175 }]} key={index}>
                            <View style={{ alignSelf: 'flex-end' }}>
                                <Text style={styles.priceTitle}>MZN {order["price"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.textBold, styles.title]}>Status: </Text>
                                <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.primary }, styles.content]}>{CommonFunctions.renderStatusLabel(order["status"])}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Order: </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{order["orderNo"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>From: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["from"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>To: </Text>
                                <Text style={[GlobalStyles.text, styles.content]} numberOfLines={2}>{order["to"]}</Text>
                            </View>
                            <View style={styles.labelRow}>
                                <Text style={[GlobalStyles.text, styles.title]}>Details: </Text>
                                <Text style={[GlobalStyles.text, styles.content]}>{CommonFunctions.formatDate(new Date(order["expectationTime"]))}, {order["distance"]}km</Text>
                            </View>
                        </View>
                    ))
                }
                {
                    orders.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 18, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
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
        { key: 'sent', title: 'SENT' },
        { key: 'received', title: 'RECEIVED' },
        { key: 'cancelled', title: 'CANCELLED' },
    ]);

    const renderScene = SceneMap({
        sent: SentRoute,
        received: ReceivedRoute,
        cancelled: CancelledRoute,
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
                <Text style={styles.headerTitle}>ORDER HISTORY</Text>
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
        fontSize: 18,
        fontWeight: "600",
        color: GoDeliveryColors.primary,
    },
    tabLabelStyle: {
        fontSize: 12,
        fontWeight: "500",
    },
    scrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    dataCard: {
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 15,
        paddingVertical: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 10,
        height: 200,
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
    feedbackButton: {
        backgroundColor: GoDeliveryColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
        marginTop: 10,
    },
    feedbackModalback: {
        position: 'absolute',
        width: '100%',
        height: 370,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    feedbackModalTitle: {
        marginBottom: 15,
        fontSize: 46,
        color: GoDeliveryColors.primary,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.4)', // Shadow color
        textShadowOffset: { width: 3, height: 3 }, // Shadow offset (x, y)
        textShadowRadius: 5, // Shadow radius
    },
    titleInputBack: {
        borderColor: '#FFCB45',
        width: '100%',
        borderWidth: 0.85,
        borderRadius: 30,
        paddingHorizontal: 20,
        paddingVertical: 3,
        fontSize: 14,
        marginTop: 15,
    },
    descriptionBack: {
        borderColor: '#FFCB45',
        width: '100%',
        borderWidth: 0.85,
        height: 120,
        borderRadius: 10,
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
        borderRadius: 20,
        backgroundColor: GoDeliveryColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    priceTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: GoDeliveryColors.secondary,
    },
    labelRow: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
    },
    title: {
        width: 55,
        justifyContent: 'flex-start'
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start'
    }
});

export default OrdersScreen;