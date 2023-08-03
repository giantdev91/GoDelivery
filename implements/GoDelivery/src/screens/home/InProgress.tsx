import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView, Platform, Alert, Linking } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import PrimaryButton from '../../components/PrimaryButton';
import Action from '../../service';
import store from '../../redux/store';

interface ScreenProps {
    navigation: any;
}

interface ControlButtonProps {
    handler: any,
    children: any,
}

const ControlButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.orderControlButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const CallButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.callButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const InProgressScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [orders, setOrders] = useState([]);

    const client = store.getState().CurrentUser.user;
    const id = client.id;
    const phone = client.phone;

    const handleSend = () => {

    }

    const handleReceive = () => {

    }

    const handleCall = (phoneNumber) => {
        // Use the `tel:` scheme to initiate a phone call
        Linking.openURL(`tel:${phoneNumber}`);
    }

    const handleGoToDetail = (index: number) => {
        const orderDetail = orders[index];
        if (orderDetail["status"] == 0) {
            Alert.alert("This order didn't assign yet.", "There is no tracking info.");
        } else {
            const senderLocation = {
                latitude: parseFloat(orderDetail["fromX"]),
                longitude: parseFloat(orderDetail["fromY"]),
            };

            const receiverLocation = {
                latitude: parseFloat(orderDetail["toX"]),
                longitude: parseFloat(orderDetail["toY"]),
            }
            const param = {
                senderLocation: senderLocation,
                receiverLocation: receiverLocation,
                deliverymanID: orderDetail["deliverymanID"],
                orderStatus: orderDetail["status"],
            };
            navigation.navigate('InProgressDetail', param);
        }
    }

    const loadInProgressOrders = () => {
        Action.order.inprogressOrders({ sender: id, receiver: phone })
            .then((res) => {
                const response = res.data;
                setOrders(response.data);
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const calculateSpentTime = (timestamp: string) => {
        const targetDateTime = new Date(timestamp);
        const currentDateTime = new Date();
        // Calculate the time difference in milliseconds
        const timeDifferenceMs = currentDateTime - targetDateTime;
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

    const renderOrderStatus = (status: number) => {
        switch (status) {
            case 0:
                return " created";
            case 1:
                return " assigned";
            case 2:
                return " processing";
        }
    }

    useEffect(() => {
        loadInProgressOrders();
    }, []);

    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>In Progress</Text>
            </View>
            <ScrollView style={styles.scrollArea}>
                {
                    orders.map((order, index) => (
                        <TouchableOpacity onPress={() => { handleGoToDetail(index); }} key={order["id"]}>
                            <View style={styles.dataCard}>
                                <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%' }}>
                                    <Text style={GlobalStyles.textBold}>Order {order["orderNo"]}</Text>
                                    <Text style={GlobalStyles.text}>spent time {calculateSpentTime(order["createdAt"])}</Text>
                                    <Text style={GlobalStyles.text}>delivery man {order["delivery_man"]?.phone}</Text>
                                    <Text style={GlobalStyles.text}>status
                                        <Text style={[
                                            GlobalStyles.textDisable,
                                            order["status"] == 0 ? GlobalStyles.diabledColor :
                                                order["status"] == 1 ? GlobalStyles.assignedColor : GlobalStyles.processingColor
                                        ]}>{
                                                renderOrderStatus(order["status"])
                                            }</Text></Text>
                                </View>
                                <View style={{ width: 120, flexDirection: 'column', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%' }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {
                                            (order["status"] == 1) && (<ControlButton handler={handleSend}>SEND</ControlButton>)
                                        }
                                        {
                                            (order["status"] == 2) && (order["receiver"] == phone) && (<ControlButton handler={handleReceive}>RECEIVE</ControlButton>)
                                        }
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
                                        {(order["status"] > 0) && (<CallButton handler={() => { handleCall(order["delivery_man"]?.phone) }} ><Icons name='call-outline' size={20} color={GoDeliveryColors.white} /></CallButton>)}
                                    </View>
                                    <Text style={GlobalStyles.textDisable}>{renderCreatedAtTime(order["createdAt"])}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                }

            </ScrollView >
        </View >
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
    scrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    dataCard: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: GoDeliveryColors.white,
        height: 140,
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
    orderControlButton: {
        width: 100,
        height: 30,
    },
    callButton: {
        width: 40,
        height: 40,
    }
});

export default InProgressScreen;