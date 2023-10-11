import React, { useState, useEffect, useCallback, useRef } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, Dimensions, Linking, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import MapView, { MapMarker, Marker, PROVIDER_GOOGLE, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Action from '../../service';
import { UPDATE_INTERVAL } from '../../common/Constant';
import PrimaryButton from '../../components/PrimaryButton';
import mapstyle from "../../common/mapStyles";
import { BackIcon } from '../../common/Icons';
import AnimatingPolylineComponent from '../../common/AnimatedPolylineComponent';
import { WebView } from 'react-native-webview';
import { RedSpining } from '../../common/SVGComponent';

interface ScreenProps {
    navigation: any;
    route: any,
}

interface ControlButtonProps {
    handler: any,
    children: any,
}

interface DistanceComponentProps {
    locationStr: string,
    estimationTime: string,
}

interface DeliveryManDetailDialogProps {
    name: string,
    avartar: string,
    rating: number,
    phone: string,
    motor: {
        plate: string,
        chassis: string,
        brand: string,
        model: string,
        engine: string,
        color: string,
    },
    estimationTime: string,
    status: number,
}

const MAP_WIDTH = Dimensions.get('screen').width - 40;
const MAP_HEIGHT = 350;
const ASPECT_RATIO = MAP_WIDTH / MAP_HEIGHT;
const LATITUDE_DELTA = 0.01; //Very high zoom level
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
console.log("GOOGLE_API_KEY: ", GOOGLE_API_KEY);

const DistanceComponent = (props: DistanceComponentProps) => (
    <View style={[styles.distanceComponent, GlobalStyles.shadowProp]}>
        <Icons name='locate-outline' size={24} color={GoDeliveryColors.disabled} />
        <Text style={[GlobalStyles.text, { marginLeft: 10, width: '75%', }]} numberOfLines={3} ellipsizeMode="tail">{props.locationStr}</Text>
        <Text style={[GlobalStyles.text, { justifyContent: 'flex-end', color: GoDeliveryColors.primary }]}>{Math.ceil(parseFloat(props.estimationTime))} min</Text>
    </View>
)

const ControlButton = (props: ControlButtonProps) => (
    <TouchableOpacity
        style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, styles.orderControlButton]}
        onPress={props.handler}
    >
        <Text style={[GlobalStyles.primaryLabel]}>{props.children}</Text>
    </TouchableOpacity>
)

const DeliveryManDetailDialog = (props: DeliveryManDetailDialogProps) => {
    const handleCall = () => {
        // Use the `tel:` scheme to initiate a phone call
        Linking.openURL(`tel:${props.phone}`);
    }
    const handleSMS = () => {
        // Use the `sms:` scheme to open the SMS application with a pre-filled message
        Linking.openURL(`sms:${props.phone}`);
    }

    return (
        <View style={[styles.deliveryManDetailDialog, GlobalStyles.shadowProp, { bottom: props.status == 1 ? 70 : 10 }]}>
            <View style={[{ height: '100%', flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }]}>
                {
                    !props.avartar && (<Image source={require('../../../assets/images/delivery-man.png')} style={{ width: 50, height: 50, borderRadius: 100 }} />)
                }
                {
                    props.avartar && (<Image source={{ uri: props.avartar }} style={{ width: 50, height: 50, borderRadius: 100 }} />)
                }
                <View style={{ flexDirection: 'column', height: '100%', marginLeft: 10, alignItems: 'flex-start', justifyContent: 'space-evenly' }}>
                    <Text style={GlobalStyles.subTitle}>{props.name}</Text>
                    <Text style={GlobalStyles.text}>{props.motor?.plate}</Text>
                    <Text style={GlobalStyles.text}>Est. time: {Math.ceil(parseFloat(props.estimationTime))} min</Text>
                </View>
            </View>
            <View style={[{ height: '100%', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 10 }]}>
                <ControlButton handler={handleCall}>
                    <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },]}>
                        <Icons name='call-outline' size={15} color={GoDeliveryColors.white} />
                        <Text style={[GlobalStyles.text, { color: GoDeliveryColors.white, marginLeft: 10 }]}>call</Text>
                    </View>
                </ControlButton>
            </View>
        </View>
    )
}

const OrderDetailScreen = ({ route, navigation }: ScreenProps): JSX.Element => {

    const { senderLocation, receiverLocation, deliverymanID, orderID } = route.params;
    const [orderStatus, setOrderStatus] = useState(1);
    const [deliverymanPosition, setDeliverymanPosition] = useState({ latitude: 0, longitude: 0 });
    const [deliverymanPositionStr, setDeliverymanPositionStr] = useState('');
    const [deliveryman, setDeliveryman] = useState({});
    const [estimationTime, setEstimationTime] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);
    const [directions, setDirections] = useState([]);

    const mapViewRef = useRef<MapView>(null);
    const markerRef = useRef<MapMarker>(null);

    const getDeliveryMansInfo = () => {
        Action.deliveryman.getById(deliverymanID)
            .then((res) => {
                const response = res.data;
                setDeliveryman(response.data);
                const latitude = parseFloat(response.data.locationLatitude);
                const longitude = parseFloat(response.data.locationLongitude);
                mapViewRef.current?.animateToRegion({
                    latitude: latitude,
                    longitude: longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                });
                markerRef.current?.animateMarkerToCoordinate({
                    latitude: latitude,
                    longitude: longitude,
                });

                setDeliverymanPosition({
                    latitude: latitude,
                    longitude: longitude
                })

                fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`)
                    .then(response => response.json())
                    .then(data => {
                        setDeliverymanPositionStr(data.display_name);
                    })
                    .catch(error => console.error('Error:', error));
            }).catch((err) => {
                console.log("error: ", err);
            })
    }

    const handleCancel = () => {
        setActivityIndicator(true);
        const param = {
            orderID: orderID,
            cancelReason: '',
            by: 0,
            deliverymanID: deliverymanID
        }
        Action.order.cancelOrder(param)
            .then((res) => {
                const response = res.data;
                setActivityIndicator(false);
                navigation.goBack();
            }).catch((err) => {
                console.log("error: ", err);
            })

    }

    const checkOrderStatus = () => {
        Action.order.getByID({ orderID: orderID })
            .then((res) => {
                const response = res.data;
                if (response.data.status == 1 || response.data.status == 2) {
                    setOrderStatus(response.data.status);
                } else {
                    navigation.goBack();
                }
            })
    }

    const handleRegionChange = (region: any) => {
        setDeliverymanPosition(region);
        mapViewRef.current?.animateToRegion(region);
    }

    const refreshStatus = () => {
        checkOrderStatus();
        getDeliveryMansInfo();
    }

    const handleBack = () => {
        navigation.goBack();
    }

    useFocusEffect(
        useCallback(() => {
            refreshStatus();
        }, [])
    );

    useEffect(() => {
        // Call the callback function immediately
        const interval = setInterval(refreshStatus, UPDATE_INTERVAL);
        return () => {
            clearInterval(interval);
        }
    }, []);
    const DirectionRoutes = [...directions].reverse();
    return (
        <View style={[GlobalStyles.container]}>



            <MapView
                ref={mapViewRef}
                style={{ flex: 1.5, borderColor: 'red', borderWidth: 1 }}
                provider={PROVIDER_GOOGLE}
                loadingEnabled
                customMapStyle={mapstyle}
                // onRegionChangeComplete={handleRegionChange}
                region={{
                    latitude: deliverymanPosition.latitude,
                    longitude: deliverymanPosition.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}>
                <Marker
                    coordinate={senderLocation}
                    title={'sender'}
                />
                <Marker
                    coordinate={receiverLocation}

                    title={'receiver'}
                />
                <Marker
                    ref={markerRef}
                    coordinate={deliverymanPosition}
                    title={'delivery man'}
                >
                    <View style={{ width: 25, height: 25, justifyContent: 'center', alignItems: 'center' }}>
                        <WebView
                            style={[{ width: 25, height: 25, backgroundColor: 'transparent' }]}
                            scrollenabled={false}
                            source={{ html: RedSpining }}
                        />
                    </View>
                </Marker>
                {orderStatus == 1 && (<MapViewDirections
                    origin={deliverymanPosition}
                    destination={senderLocation}
                    apikey={GOOGLE_API_KEY} // insert your API Key here
                    strokeWidth={5}
                    strokeColor={GoDeliveryColors.primary}
                    onReady={result => {
                        setDirections(result.coordinates);
                        setEstimationTime(result.duration.toString());
                    }}
                />)}
                {orderStatus == 2 && (<MapViewDirections
                    origin={deliverymanPosition}
                    destination={receiverLocation}
                    apikey={GOOGLE_API_KEY} // insert your API Key here
                    strokeWidth={5}
                    strokeColor={GoDeliveryColors.primary}
                    onReady={result => {
                        setDirections(result.coordinates);
                        setEstimationTime(result.duration.toString());
                    }}
                />)}

                {
                    directions.length > 0 && (<Polyline
                        coordinates={directions}
                        strokeColor={GoDeliveryColors.primary}
                        strokeWidth={5}

                    />)
                }

                {
                    directions.length > 0 && (
                        <AnimatingPolylineComponent Direction={DirectionRoutes} />
                    )
                }

            </MapView>
            <TouchableOpacity style={[GlobalStyles.headerBackButton, { backgroundColor: '#FFFFFFB0', borderRadius: 100, }]} onPress={handleBack}>
                <BackIcon />
            </TouchableOpacity>


            {/* <DistanceComponent locationStr={deliverymanPositionStr} estimationTime={estimationTime} /> */}
            <DeliveryManDetailDialog
                avartar={deliveryman.avatar}
                motor={deliveryman.motor}
                name={deliveryman.name}
                phone={deliveryman.phone}
                rating={deliveryman.rating}
                estimationTime={estimationTime}
                status={orderStatus}
            />
            {
                orderStatus == 1 && (
                    <View style={{ width: '95%', alignSelf: 'center', marginBottom: 10 }}>
                        <PrimaryButton buttonText='CANCEL' handler={handleCancel} />
                    </View>
                )
            }

            {
                activityIndicator && (
                    <ActivityIndicator style={{ position: 'absolute', justifyContent: 'center', alignSelf: 'center', bottom: 200 }} size="large" />
                )
            }
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
    avatarArea: {
        marginTop: 30,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 160,
        height: 160,
        borderRadius: 200,
    },
    profileFormArea: {
        padding: 20,
        flex: 1,
    },
    distanceComponent: {
        position: 'absolute',
        top: 55,
        alignSelf: 'center',
        width: '90%',
        borderRadius: 5,
        backgroundColor: GoDeliveryColors.white,
        height: 60,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    deliveryManDetailDialog: {
        width: '95%',
        backgroundColor: 'white',
        borderRadius: 5,
        height: 90,
        position: 'absolute',
        bottom: 80,
        alignSelf: 'center',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    orderControlButton: {
        width: 100,
        height: 30,
    },
});

export default OrderDetailScreen;