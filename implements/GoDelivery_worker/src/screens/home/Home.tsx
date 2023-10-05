import React, { useState, useCallback, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import NetInfo from "@react-native-community/netinfo";
import { Switch } from 'react-native-switch';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import Action from '../../service';
import store from '../../redux/store';

import OfflineScreen from '../../components/OfflineScreen';
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

    const handleNetworkChange = (state: any) => {
        setConnectionStatus(state.isConnected);
    };

    // Use useFocusEffect to fetch orders whenever the screen gains focus
    useFocusEffect(
        useCallback(() => {
            refreshHandler();
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

                <View style={[styles.topStatusBar, { backgroundColor: connectionStatus ? GoDeliveryColors.green : GoDeliveryColors.gray }]}>
                    <Text style={[GlobalStyles.headerTitle, { color: GoDeliveryColors.white }]}>{connectionStatus ? 'ONLINE' : 'OFFLINE'}</Text>
                    <View style={[styles.switchBack, { alignItems: connectionStatus ? 'flex-end' : 'flex-start' }]}>
                        <View style={styles.switchBall}></View>
                    </View>

                </View>
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
        </AlertNotificationRoot>

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
        borderRadius: 5,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    switchBall: {
        width: 24,
        height: 24,
        borderRadius: 5,
        backgroundColor: GoDeliveryColors.white,
    },
    headerTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: GoDeliveryColors.primary,
    },
});

export default HomeScreen;