import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import Action from '../../service';
import store from '../../redux/store';

interface ScreenProps {
    navigation: any;
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

const NotificationsScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [notifications, setNotifications] = useState([]);
    const clientID = store.getState().CurrentUser.user.id;

    const fetchNotifications = () => {
        Action.notification.list({ clientID: clientID })
            .then((res) => {
                const response = res.data;
                setNotifications(response.data);
            }).catch((err) => console.log("error: ", err));
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <ScrollView style={styles.scrollArea}>
                {
                    notifications.map((notif, index) => (
                        <View style={styles.dataCard} key={index}>
                            <View style={{ width: '100%', height: 35, }}>
                                <Text style={GlobalStyles.text} numberOfLines={2}>{notif["content"]}</Text>
                            </View>
                            <View style={styles.notificationDetailArea}>
                                <Text style={GlobalStyles.textBold}>Order {notif["orders"].orderNo}</Text>
                                <Text style={GlobalStyles.textDisable}>{renderCreatedAtTime(notif["createdAt"])}</Text>
                            </View>
                        </View>
                    ))
                }
                {
                    notifications.length == 0 && (
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
        marginVertical: 10,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
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
    notificationDetailArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    }
});

export default NotificationsScreen;