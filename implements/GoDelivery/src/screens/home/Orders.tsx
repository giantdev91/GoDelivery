import React, { useState, useCallback } from 'react';
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
                console.log('response ===> ', response);
                setOrders(response.data);
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const toggleModal = (orderId: string) => {
        setSelectedOrderId(orderId);
        setModalVisible(!isModalVisible);
    };

    const ratingCompleted = (rating: number) => {
        console.log('rating ==> ', rating);
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
                console.log('response ===> ', response);
                setModalVisible(false);
                fetchCompletedOrders();
                setActivityIndicator(false);
            }).catch((err) => {
                console.log('error: ', err);
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
                                <Text style={GlobalStyles.text}>Receiver {order["receiver"]}</Text>
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
                                {
                                    !order["rate"] && (
                                        <TouchableOpacity style={[styles.feedbackButton, GlobalStyles.shadowProp]} onPress={() => { toggleModal(order["id"]) }}>
                                            <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white }]}>Leave Feedback</Text>
                                        </TouchableOpacity>
                                    )
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
            <Modal isVisible={isModalVisible} onBackdropPress={() => { setModalVisible(false) }}>
                <View style={{ height: 500, backgroundColor: GoDeliveryColors.white, borderRadius: 30 }}>
                    <Image source={require("../../../assets/images/goods.jpg")} style={{ width: '100%', height: '100%', borderRadius: 30 }} />
                    <View style={styles.feedbackModalback}>
                        <Text style={styles.feedbackModalTitle}>Satisfied?</Text>
                        <Rating imageSize={30} onFinishRating={ratingCompleted} />
                        <TextInput style={styles.titleInputBack} placeholder='title' onChangeText={(val) => { setFeedbackTitle(val) }} value={feedbackTitle} />
                        <TextInput style={styles.descriptionBack} multiline={true} placeholder='please leave your feeback here.' value={feedbackContent} onChangeText={(val) => { setFeedbackContent(val) }} />
                        <TouchableOpacity style={styles.rateUsBtn} onPress={handleRateUs}>
                            <Text style={{ fontSize: 20, color: GoDeliveryColors.white }}>Rate us</Text>
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
                console.log('response ===> ', response.data[0].client);
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
                                {/* <Text style={GlobalStyles.text}>Sender {order["client"].phone}</Text> */}
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
        { key: 'sent', title: 'SENT' },
        { key: 'received', title: 'RECEIVED' },
    ]);

    const renderScene = SceneMap({
        sent: SentRoute,
        received: ReceivedRoute,
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
                <Text style={styles.headerTitle}>Order History</Text>
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
    feedbackButton: {
        backgroundColor: GoDeliveryColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 20
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
        fontSize: 48,
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
        fontSize: 16,
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
        fontSize: 14,
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
    }
});

export default OrdersScreen;