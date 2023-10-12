import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform, ScrollView, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { useFocusEffect } from '@react-navigation/native';
import Action from '../../service';
import store from '../../redux/store';
import CustomIndicator from '../../common/CustomIndicator';
import { Divider } from 'react-native-paper';

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
    const [activityIndicator, setActivityIndicator] = useState(false);

    const fetchNotifications = () => {
        setActivityIndicator(true);
        Action.notification.list({ clientID: clientID })
            .then((res) => {
                const response = res.data;
                setNotifications(response.data);
                setActivityIndicator(false);
            }).catch((err) => console.log("error: ", err));
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            fetchNotifications();
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <View style={[GlobalStyles.headerSection]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <FontAwesome name="arrow-left-long" size={20} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Notifications</Text>
            </View>
            <ScrollView style={styles.scrollArea}>
                {
                    notifications.map((notif, index) => (
                        <View key={index}>
                            <View style={styles.dataCard} key={index}>
                                <View style={{ width: '100%', height: 35, }}>
                                    <Text style={GlobalStyles.text} numberOfLines={2}>{notif["content"]}</Text>
                                </View>
                                <View style={styles.notificationDetailArea}>
                                    <Text style={GlobalStyles.textBold}>Order {notif["orders"]?.orderNo}</Text>
                                    <Text style={GlobalStyles.textDisable}>{renderCreatedAtTime(notif["createdAt"])}</Text>
                                </View>
                            </View>
                            <Divider style={GlobalStyles.dividerStyle} />
                        </View>
                    ))
                }
                {
                    notifications.length == 0 && (
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: 40, marginTop: 60, paddingVertical: 20 }}>
                            <Icons name="document-text-outline" size={120} color={'#c7c7c7'} />
                            <Text style={{ textAlign: 'center', fontSize: 18, color: GoDeliveryColors.secondary, marginTop: 50 }}>No history yet</Text>
                            {/* <Text style={{ textAlign: 'center', fontSize: 16, marginTop: 15, marginBottom: 100 }}>Hit the orange button down below to Create an order</Text> */}
                            {/* <PrimaryButton buttonText='Start Ordering' handler={() => { props.navigation.navigate('Main') }} /> */}
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
    scrollArea: {
        padding: 10,
        marginBottom: 20,
    },
    dataCard: {
        marginVertical: 10,
        paddingHorizontal: 15,
        paddingVertical: 5,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: GoDeliveryColors.white,
        height: 80,
    },
    notificationDetailArea: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
    }
});

export default NotificationsScreen;