import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Platform, ScrollView } from 'react-native';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';

interface ScreenProps {
    navigation: any;
}

const NotificationsScreen = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <ScrollView style={styles.scrollArea}>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Your order is accepted. Our system supporter will help you soon.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>The order is canceled by the delivery man. If you have some questions, please contact us.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Client xxxx is sending goods to you. Our system supporter will deliver it soon.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Your order is successfully completed. Our system expects your good feedback.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Your order is accepted. Our system supporter will help you soon.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Your order is accepted. Our system supporter will help you soon.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <Text style={GlobalStyles.text}>Your order is accepted. Our system supporter will help you soon.</Text>
                    <View style={styles.notificationDetailArea}>
                        <Text style={GlobalStyles.textBold}>Order 12345678</Text>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 10:00:00</Text>
                    </View>
                </View>
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