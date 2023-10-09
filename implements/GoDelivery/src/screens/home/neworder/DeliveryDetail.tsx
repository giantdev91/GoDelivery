import React, { useState, useCallback, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Text, TextInput } from 'react-native';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import RadioGroup from 'react-native-radio-buttons-group';
import { useFocusEffect } from '@react-navigation/native';
import Modal from "react-native-modal";
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import CustomizedPhoneInput from '../../../components/CustomizedPhoneInput';
import store from '../../../redux/store';
import CustomizedInput from '../../../components/CustomizedInput';
import { Divider, } from 'react-native-paper';
import PrimaryButton from '../../../components/PrimaryButton';
import { BackIcon, ForwardLinkIcon, FromLocationIcon, HomeIcon, PhoneIcon, TextEditIcon, ToLocationIcon, UserIcon, WarningIcon } from '../../../common/Icons';

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
    const [isModalVisible, setModalVisible] = useState(false);

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
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={() => setModalVisible(true)}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>DELIVERY DETAILS</Text>
                </View>
                <ScrollView >
                    <View style={styles.formArea}>
                        {/* Sender info section start */}
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={styles.locationStrSection}>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Sender</Text>
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <UserIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Full Name</Text>
                                    <TextInput value={currentUser.name} placeholder='Ex: Jose Manuel' style={GlobalStyles.textInput} editable={false} />
                                </View>
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <PhoneIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Phone Number</Text>
                                    <TextInput value={senderPhone.slice(3)} placeholder='82 12 34 567' style={GlobalStyles.textInput} editable={false} />
                                </View>
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <HomeIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Address Details</Text>
                                    <TextInput value={fromLocationReferBuilding} placeholder='Build Name / No / Flat / Floor - Optional' style={GlobalStyles.textInput} onChangeText={setFromLocationReferBuilding} />
                                </View>
                            </View>
                        </View>

                        {/* Sender info section end */}

                        <Divider style={styles.divider} />

                        {/* Receiver info section start */}
                        <View style={{ paddingHorizontal: 20 }}>
                            <View style={styles.locationStrSection}>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Receiver</Text>
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <UserIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Full Name</Text>
                                    <TextInput value={receiverName} placeholder='Ex: Jose Manuel' style={GlobalStyles.textInput} onChangeText={setReceiverName} />
                                </View>
                                {receiverNameError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                    <WarningIcon />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{receiverNameError}</Text></View>
                                </View>)}
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <PhoneIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Phone Number</Text>
                                    <TextInput value={receiverPhone} placeholder='82 12 34 567' style={GlobalStyles.textInput} onChangeText={setReceiverPhone} />
                                </View>
                                {receiverPhoneError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                    <WarningIcon />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{receiverPhoneError}</Text></View>
                                </View>)}
                            </View>
                            <View style={styles.inputRowContainer}>
                                <View style={GlobalStyles.iconBack}>
                                    <HomeIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Address Details</Text>
                                    <TextInput value={toLocationReferBuilding} placeholder='Build Name / No / Flat / Floor - Optional' style={GlobalStyles.textInput} onChangeText={setToLocationReferBuilding} />
                                </View>
                            </View>
                        </View>
                        {/* Receiver info section end */}
                        <Divider style={styles.divider} />

                        {/* Item detail section start */}
                        <View style={[styles.locationStrSection, { marginTop: 0, paddingHorizontal: 20 }]}>
                            <View style={{ flex: 1, }}>
                                <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.secondary }]}>Item Details</Text>
                            </View>
                            <TouchableOpacity
                                style={[styles.goodsOptionBack, weightError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("WeightOption") }}>
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <View style={GlobalStyles.iconBack}>
                                            <Image
                                                source={require('../../../../assets/images/icons/weight.png')}
                                                style={styles.iconElement}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'column', }}>
                                            <Text numberOfLines={2} style={GlobalStyles.textDisable}>Weight</Text>
                                            {
                                                weight && (
                                                    <Text style={[GlobalStyles.textDisable]}>{weight}</Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <ForwardLinkIcon />
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={[styles.goodsOptionBack, volumeError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("VolumeOption") }}
                            >
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <View style={GlobalStyles.iconBack}>
                                            <Image
                                                source={require('../../../../assets/images/icons/volume.png')}
                                                style={styles.iconElement}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'column', }}>
                                            <Text numberOfLines={2} style={GlobalStyles.textDisable}>Volume</Text>
                                            {
                                                volume && (
                                                    <Text style={[GlobalStyles.textDisable]}>{volume}</Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <ForwardLinkIcon />
                                </View>
                            </TouchableOpacity>


                            <TouchableOpacity
                                style={[styles.goodsOptionBack, goodsTypeError ? styles.optionError : {}]}
                                onPress={() => { navigation.navigate("GoodsTypeOption") }}
                            >
                                <View style={styles.touchableRow}>
                                    <View style={styles.textWithIcon}>
                                        <View style={GlobalStyles.iconBack}>
                                            <Image
                                                source={require('../../../../assets/images/icons/goods.png')}
                                                style={styles.iconElement}
                                            />
                                        </View>

                                        <View style={{ flexDirection: 'column', }}>
                                            <Text numberOfLines={2} style={GlobalStyles.textDisable}>Type of Goods</Text>
                                            {
                                                goodsType && (
                                                    <Text style={[GlobalStyles.textDisable]}>{goodsType}</Text>
                                                )
                                            }
                                        </View>
                                    </View>
                                    <ForwardLinkIcon />
                                </View>
                            </TouchableOpacity>

                            <View style={[styles.textWithIcon, { alignItems: 'flex-start' }]}>
                                <View style={GlobalStyles.iconBack}>
                                    <TextEditIcon />
                                </View>

                                <View style={{ flexDirection: 'column', }}>
                                    <Text numberOfLines={2} style={GlobalStyles.textDisable}>Description</Text>
                                    <TextInput
                                        style={{
                                            flex: 1,
                                            height: 70,
                                            textAlignVertical: 'top',
                                            textAlign: 'auto',
                                            paddingLeft: 0,
                                            paddingTop: 4,
                                            marginRight: 40,
                                            color: GoDeliveryColors.disabled,
                                        }}
                                        value={description}
                                        placeholder="Tell us what you are sending or share specific instructions to the courier."
                                        onChangeText={setDescription}
                                        secureTextEntry={false}
                                        multiline
                                        maxLength={150}
                                    />
                                </View>
                            </View>
                            <View style={{ width: '100%' }}>
                                <Text style={[GlobalStyles.textDisable, { textAlign: 'right' }]}>{`Maximum Character: (${description.length}/150)`}</Text>
                            </View>
                        </View>
                        {/* Item detail section end */}
                        <Divider style={styles.divider} />

                        {/* Payment option start */}
                        <View style={[styles.locationStrSection, { marginTop: 0, paddingHorizontal: 20 }]}>
                            <View style={{ flex: 1, }}>
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

                <Modal isVisible={isModalVisible}>
                    <View style={styles.alertDialog}>
                        <Text style={GlobalStyles.subTitle}>Discard Alert</Text>
                        <Text style={GlobalStyles.textMedium}>Are you sure to exit?</Text>
                        <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 40, marginTop: 30 }}>
                            <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.primary }]}>No</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => { setModalVisible(false); handleBack() }}><Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.primary }]}>Yes</Text></TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </AlertNotificationRoot>
        </View>
    )
}

const styles = StyleSheet.create({
    formArea: {
        paddingVertical: 10,
        flex: 1,
    },
    inputRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 5,
    },
    locationStrSection: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginTop: 10,
    },
    textWithIcon: {
        flex: 1,
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
        borderColor: GoDeliveryColors.dividerColor,
        borderWidth: 0.25,
        width: '100%',
        marginVertical: 10,
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
    },
    alertDialog: {
        alignSelf: 'center',
        width: '80%',
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
});

export default DeliveryDetail;