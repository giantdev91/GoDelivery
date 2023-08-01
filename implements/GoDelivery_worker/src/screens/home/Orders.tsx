import React from 'react';
import { StyleSheet, useWindowDimensions, TouchableOpacity, View, Text, Platform } from 'react-native';
import GlobalStyles from '../../styles/style';
import MenuButton from '../../components/MenuButton';
import GoDeliveryColors from '../../styles/colors';
import { Layout } from 'react-native-reanimated';
import { NavigationState, SceneMap, SceneRendererProps, TabView, TabBar } from 'react-native-tab-view';
import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

interface ScreenProps {
    navigation: any;
    route: any,
}

interface SceneProps {
    jumpTo: (key: string) => void;
}


const SentRoute = (props: SceneProps) => {

    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView style={styles.scrollArea}>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Receiver 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Icons name="star" size={20} color={'gold'} />
                            <Text style={GlobalStyles.text}> 4.7</Text>
                        </View>
                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}

const ReceivedRoute = (props: SceneProps) => {

    return (
        <View style={[GlobalStyles.container]}>
            <ScrollView style={styles.scrollArea}>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
                <View style={styles.dataCard}>
                    <View style={{ alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={GlobalStyles.textBold}>Order 1234</Text>
                        <Text style={GlobalStyles.text}>Sender 15039287830</Text>
                        <Text style={GlobalStyles.text}>delivery time 15min</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'space-evenly', height: '100%' }}>
                        <Text style={GlobalStyles.textDisable}>2023-07-20 13:10:00</Text>

                        <Text style={GlobalStyles.textBold}>shipping 5$</Text>
                    </View>
                </View>
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
});

export default OrdersScreen;