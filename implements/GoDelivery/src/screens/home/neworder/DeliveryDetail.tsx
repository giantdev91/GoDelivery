import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Text, TextInput } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Icons from 'react-native-vector-icons/Ionicons';
import RadioGroup from 'react-native-radio-buttons-group';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import CustomizedPhoneInput from '../../../components/CustomizedPhoneInput';
import store from '../../../redux/store';
import CustomizedInput from '../../../components/CustomizedInput';
import { Divider, } from 'react-native-paper';
import PrimaryButton from '../../../components/PrimaryButton';

const MAX_VOLUME = 135;
const MAX_WEIGHT = 50;

const DeliveryDetail = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    const orderInfo = store.getState().NewOrder.orderInfo;
    const currentUser = store.getState().CurrentUser.user;
    const [senderPhone, setSenderPhone] = useState(
        currentUser.phone,
    );
    const [senderPhoneError, setSenderPhoneError] = useState('');
    const [fromStr, setFromStr] = useState("");
    const [fromLocationReferBuilding, setFromLocationReferBuilding] =
        useState('');
    const [toStr, setToStr] = useState("");
    const [receiverPhone, setReceiverPhone] = useState('');
    const [receiverPhoneError, setReceiverPhoneError] = useState('');
    const [receiverName, setReceiverName] = useState('');
    const [receiverNameError, setReceiverNameError] = useState('');
    const [toLocationReferBuilding, setToLocationReferBuilding] = useState('');
    const [weight, setWeight] = useState(orderInfo["weight"]);
    const [weightError, setWeightError] = useState('');
    const [volume, setVolume] = useState('');
    const [volumeError, setVolumeError] = useState('');
    const [goodsType, setGoodsType] = useState("");
    const [goodsTypeError, setGoodsTypeError] = useState("");
    const [distance, setDistance] = useState(orderInfo["distance"]);
    const [price, setPrice] = useState(orderInfo["price"]);
    const [description, setDescription] = useState("");
    const [payOption, setPayOption] = useState('1');

    const radioButtons = useMemo(() => ([
        {
            id: '1', // acts as primary key, should be unique and non-empty string
            label: 'Paid by Receiver',
        },
        {
            id: '2',
            label: 'Paid by Sender',
        }
    ]), []);

    const handleBack = () => {
        navigation.goBack();
    }

    const formValidate = () => {
        var returnVal = true;
        // if (senderPhone.length != 9) {
        //   setSenderPhoneError('Please insert valid phone number');
        //   returnVal = false;
        // } else {
        //   setSenderPhoneError('');
        // }
        if (receiverPhone.length != 9) {
            setReceiverPhoneError('Insert valid phone number');
            returnVal = false;
        } else {
            const prefix = Number.parseInt(receiverPhone.substring(0, 2));
            if (prefix > 81 && prefix < 88) {
                setReceiverPhoneError('');
            } else {
                setReceiverPhoneError('Insert valid phone number');
                returnVal = false;
            }
        }
        if (!receiverName) {
            setReceiverNameError("Can't be Empty.");
            returnVal = false;
        } else {
            setReceiverNameError('');
        }
        if (!weight) {
            setWeightError("Can't be Empty.");
            returnVal = false;
        } else {
            setWeightError('');
        }
        if (!goodsType) {
            setGoodsTypeError("Can't be Empty.");
        } else {
            setGoodsTypeError("");
        }
        if (!volume) {
            setVolumeError("Can't be Empty.");
            returnVal = false;
        } else {
            setVolumeError('');
        }
        return returnVal;
    };

    const handleNext = () => {
        if (formValidate()) {
            const param = {
                sender: store.getState().CurrentUser.user.id,
                senderPhone: senderPhone,
                receiver: `258${receiverPhone}`,
                receiverName: receiverName,
                from: fromStr,
                fromLocationReferBuilding: fromLocationReferBuilding,
                fromX: orderInfo["fromLocation"].latitude,
                fromY: orderInfo["fromLocation"].longitude,
                to: toStr,
                toLocationReferBuilding: toLocationReferBuilding,
                toX: orderInfo["toLocation"].latitude,
                toY: orderInfo["toLocation"].longitude,
                goodsVolumn: volume,
                goodsWeight: weight,
                goodsType: goodsType,
                distance: distance,
                price: price,
                description: description,
                payOption: payOption,
                screenShot: orderInfo["screenShot"],
            };
            navigation.navigate('DeliveryConfirmation', param);
        }
    }

    const initializeParameters = () => {
        const orderInfo = store.getState().NewOrder.orderInfo;
        setWeight(orderInfo["weight"]);
        if (orderInfo["weight"]) {
            setWeightError("");
        }
        setGoodsType(orderInfo["goodsType"]);
        if (orderInfo["goodsType"]) {
            setGoodsTypeError("");
        }
        setVolume(orderInfo["volume"]);
        if (orderInfo["volume"]) {
            setVolumeError("");
        }
        setFromStr(orderInfo["fromStr"]);
        setToStr(orderInfo["toStr"]);
    }

    useFocusEffect(
        useCallback(() => {
            initializeParameters();
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <AlertNotificationRoot>
                <View style={GlobalStyles.headerSection}>
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                        <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>DELIVERY DETAILS</Text>
                </View>
                <ScrollView >
                    <View style={styles.formArea}>
                        {/* Sender info section start */}
                        <View style={styles.locationStrSection}>
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Sender</Text>
                            <View style={styles.textWithIcon}>
                                <Icons
                                    name="locate-outline"
                                    size={30}
                                    color={GoDeliveryColors.green}
                                />
                                <Text numberOfLines={2} style={GlobalStyles.text}>
                                    {fromStr}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <CustomizedInput
                                icon="person-outline"
                                placeHolder="User name to contact"
                                val={currentUser.name}
                                handler={setReceiverName}
                                showCheck={true}
                                disabled={true}
                            />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <CustomizedPhoneInput value={senderPhone.slice(3)} handler={() => { }} disabled={true} placeholder='Phone to contact' />
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <CustomizedInput
                                icon="home-outline"
                                placeHolder="Build No / Flat / Floor - Optional"
                                keyboardType="number"
                                val={fromLocationReferBuilding}
                                handler={setFromLocationReferBuilding}
                                showCheck={true}
                            />
                        </View>
                        {/* Sender info section end */}
                        <Divider style={styles.divider} />
                        {/* Receiver info section start */}
                        <View style={[styles.locationStrSection, { marginTop: 0 }]}>
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Receiver</Text>
                            <View style={styles.textWithIcon}>
                                <Icons
                                    name="location-outline"
                                    size={30}
                                    color={GoDeliveryColors.primary}
                                />
                                <Text numberOfLines={2} style={GlobalStyles.text}>
                                    {toStr}
                                </Text>
                            </View>
                        </View>
                        <View style={{ marginTop: 10, zIndex: 3 }}>
                            <CustomizedInput
                                icon="person-outline"
                                placeHolder="User name to contact"
                                val={receiverName}
                                handler={setReceiverName}
                                showCheck={true}
                                error={receiverNameError.length > 0}
                            />
                            {receiverNameError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <Icons name="alert-outline" size={20} color={GoDeliveryColors.white} style={GlobalStyles.errorIcon} />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{receiverNameError}</Text></View>
                            </View>)}
                        </View>
                        <View style={{ marginTop: 10, zIndex: 2 }}>
                            <CustomizedPhoneInput value={receiverPhone} handler={setReceiverPhone} placeholder='Phone to contact' error={receiverPhoneError.length > 0} />
                            {receiverPhoneError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <Icons name="alert-outline" size={20} color={GoDeliveryColors.white} style={GlobalStyles.errorIcon} />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{receiverPhoneError}</Text></View>
                            </View>)}
                        </View>

                        <View style={{ marginTop: 10 }}>
                            <CustomizedInput
                                icon="home-outline"
                                placeHolder="Build No / Flat / Floor - Optional"
                                keyboardType="number"
                                val={toLocationReferBuilding}
                                handler={setToLocationReferBuilding}
                                showCheck={true}
                            />
                        </View>
                        {/* Receiver info section end */}
                        <Divider style={styles.divider} />
                        {/* Item detail section start */}
                        <View style={[styles.locationStrSection, { marginTop: 0 }]}>
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Item Details</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.goodsOptionBack, weightError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("WeightOption") }}>
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <Image
                                            source={require('../../../../assets/images/icons/weight.png')}
                                            style={styles.iconElement}
                                        />
                                        <Text numberOfLines={2} style={GlobalStyles.textDisable}>Weight</Text>
                                    </View>
                                    <Icons name="chevron-forward-outline" color={GoDeliveryColors.secondary} size={25} />
                                </View>
                            </TouchableOpacity>
                            {
                                weight && (
                                    <Text style={[GlobalStyles.textDisable, { marginLeft: 20, marginTop: 5 }]}>{weight}</Text>
                                )
                            }

                            <TouchableOpacity
                                style={[styles.goodsOptionBack, volumeError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("VolumeOption") }}
                            >
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <Image
                                            source={require('../../../../assets/images/icons/volume.png')}
                                            style={styles.iconElement}
                                        />
                                        <Text numberOfLines={2} style={GlobalStyles.textDisable}>Volume</Text>
                                    </View>
                                    <Icons name="chevron-forward-outline" color={GoDeliveryColors.secondary} size={25} />
                                </View>
                            </TouchableOpacity>
                            {
                                volume && (
                                    <Text style={[GlobalStyles.textDisable, { marginLeft: 20, marginTop: 5 }]}>{volume}</Text>
                                )
                            }

                            <TouchableOpacity
                                style={[styles.goodsOptionBack, goodsTypeError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("GoodsTypeOption") }}
                            >
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <Image
                                            source={require('../../../../assets/images/icons/goods.png')}
                                            style={styles.iconElement}
                                        />
                                        <Text numberOfLines={2} style={GlobalStyles.textDisable}>Type of Goods</Text>
                                    </View>
                                    <Icons name="chevron-forward-outline" color={GoDeliveryColors.secondary} size={25} />
                                </View>
                            </TouchableOpacity>
                            {
                                goodsType && (
                                    <Text style={[GlobalStyles.textDisable, { marginLeft: 20, marginTop: 5 }]}>{goodsType}</Text>
                                )
                            }
                            <View style={styles.textWithIcon}>
                                <Icons
                                    name="reader-outline"
                                    size={25}
                                    color={GoDeliveryColors.disabled}
                                />
                                <Text numberOfLines={2} style={GlobalStyles.textDisable}>Description</Text>
                            </View>
                            <View style={{ marginTop: 10, width: '100%' }}>
                                <TextInput
                                    style={{
                                        marginLeft: 10,
                                        flex: 1,
                                        paddingHorizontal: 15,
                                        borderWidth: 1,
                                        borderColor: GoDeliveryColors.disabled,
                                        borderRadius: 5,
                                        height: 100,
                                        textAlignVertical: 'top',
                                        textAlign: 'auto'
                                    }}
                                    value={description}
                                    placeholder="Tell us what you are sending or share specific instructions to the courier."
                                    onChangeText={setDescription}
                                    secureTextEntry={false}
                                    multiline
                                    maxLength={150}
                                />
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={[GlobalStyles.textDisable, { textAlign: 'right' }]}>{`Maximum Character: (${description.length}/150)`}</Text>
                            </View>
                        </View>
                        {/* Item detail section end */}
                        <Divider style={styles.divider} />

                        {/* Price info section start */}
                        <View style={styles.infoLabelBack}>
                            <Image
                                source={require('../../../../assets/images/icons/distance.png')}
                                style={styles.iconImg}
                            />
                            <Text style={GlobalStyles.subTitle}>Distance: {distance}Km</Text>
                        </View>
                        <View style={styles.infoLabelBack}>
                            <Image
                                source={require('../../../../assets/images/icons/price.png')}
                                style={styles.iconImg}
                            />
                            <Text style={GlobalStyles.subTitle}>Price: MZN {price}</Text>
                        </View>
                        {/* Price info section end */}

                        <Divider style={styles.divider} />

                        {/* Payment option start */}
                        <View style={[styles.locationStrSection, { marginTop: 0 }]}>
                            <View style={{ flex: 1, marginLeft: 5 }}>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Payment Options</Text>
                                <RadioGroup
                                    containerStyle={{ alignItems: 'flex-start' }}
                                    radioButtons={radioButtons}
                                    onPress={setPayOption}
                                    selectedId={payOption}
                                />
                            </View>
                        </View>
                        {/* Payment option end */}
                    </View>
                    <View style={styles.buttonRow}>
                        <PrimaryButton buttonText="NEXT" handler={handleNext} />
                    </View>
                </ScrollView>
            </AlertNotificationRoot>
        </View>
    )
}

const styles = StyleSheet.create({
    formArea: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        flex: 1,
    },
    locationStrSection: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 20,
    },
    textWithIcon: {
        flex: 1,
        marginLeft: 20,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
        marginTop: 10,
    },
    goodsOptionBack: {
        width: '100%',
        marginRight: 20,
        marginVertical: 3,
    },
    touchableRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    divider: {
        borderColor: GoDeliveryColors.disabled,
        borderWidth: 0.25,
        width: '100%',
        marginVertical: 30,
    },
    iconElement: {
        width: 25,
        height: 25,
        resizeMode: 'contain',
    },
    infoLabelBack: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
    iconImg: {
        width: 35,
        height: 35,
        resizeMode: 'contain',
    },
    buttonRow: {
        height: 70,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    optionError: {
        borderWidth: 1,
        borderColor: GoDeliveryColors.primary,
    }
});

export default DeliveryDetail;