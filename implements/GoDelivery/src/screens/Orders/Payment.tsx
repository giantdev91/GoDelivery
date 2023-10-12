import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image, TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GlobalStyles from '../../styles/style';
import GoDeliveryColors from '../../styles/colors';
import { ScrollView } from 'react-native-gesture-handler';
import { Checkbox, Divider } from 'react-native-paper';
import Modal from "react-native-modal";
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import PrimaryButton from '../../components/PrimaryButton';
import Action from '../../service';
import CommonFunctions from '../../common/CommonFunctions';
import { BackIcon, PhoneIcon, WarningIcon } from '../../common/Icons';

const Payment = ({ navigation, route }: {
    navigation: any;
    route: any;
}): JSX.Element => {
    const { from, to, price, id } = route.params;
    const [phoneError, setPhoneError] = useState('');
    const [mpesaCheck, setMpesaCheck] = useState(false);
    const [emolaCheck, setEmolaCheck] = useState(false);
    const [cashCheck, setCashCheck] = useState(false);
    const [cashReasonDialog, setCashReasonDialog] = useState(false);
    const [cashReasonOptions, setCashReasonOptions] = useState([]);
    const [cashReason, setCashReason] = useState("");

    const handleBack = () => {
        navigation.goBack();
    }

    const handleCollect = () => {
        navigation.goBack();
    }

    const getCashReason = () => {
        Action.cashReason.cashReasonList().then(res => {
            const response = res.data;
            setCashReasonOptions(response.data);
        }).catch(err => console.log("error: ", err));
    }

    useEffect(() => {
        getCashReason();
    }, []);

    return (
        <View style={GlobalStyles.container}>
            <View style={[GlobalStyles.headerSection]}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Checkout</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginBottom: 20 }}>
                    <View style={{ marginTop: 20, alignItems: 'center', paddingHorizontal: 20 }}>
                        <Image source={require("../../../assets/images/company-logo.png")} style={styles.logo} />
                        <Text style={GlobalStyles.textDisable}>{from}</Text>
                        <Text style={GlobalStyles.textDisable}>{to}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.disabled }]}>SERVICE DETAILS</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={GlobalStyles.textDisable}>Discount</Text>
                            <Text style={GlobalStyles.textDisable}>0%</Text>
                        </View>
                    </View>

                    <Divider style={styles.divider} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20 }}>
                        <Text style={GlobalStyles.subTitle}>Total</Text>
                        <Text style={GlobalStyles.subTitle}>{CommonFunctions.getLocalNumberValue(price)}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={{ paddingHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                            <Text style={GlobalStyles.textMedium}>Payment secured by</Text>
                            <Image source={require("../../../assets/images/xpay.png")} style={styles.paymentLogo} />
                        </View>
                        <Text style={GlobalStyles.textDisable}>The payment is 100% safe and secure. xPay don't share your personal financial information with Go Delivery.</Text>
                    </View>

                    <Divider style={styles.divider} />

                    <View style={{ paddingHorizontal: 20 }}>
                        <Text style={GlobalStyles.textMedium}>Payment Method</Text>
                        <Text style={GlobalStyles.textDisable}>It's safe to pay. Please choose below your payment method.</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                            <Checkbox
                                status={mpesaCheck ? 'checked' : 'unchecked'}
                                onPress={() => { setMpesaCheck(!mpesaCheck); setCashCheck(false); setEmolaCheck(false); }}
                            />
                            <Image source={require("../../../assets/images/mpesa.png")} style={styles.paymentLogo} />
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                            <Checkbox
                                status={emolaCheck ? 'checked' : 'unchecked'}
                                onPress={() => { setEmolaCheck(!emolaCheck); setCashCheck(false); setMpesaCheck(false); }}
                            />
                            <Image source={require("../../../assets/images/emola.png")} style={styles.paymentLogo} />
                        </View>
                        <View style={{ zIndex: 100, flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', gap: 7 }}>
                            <View style={GlobalStyles.iconBack}>
                                <PhoneIcon />
                            </View>
                            <View>
                                <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Phone Number</Text>
                                <TextInput
                                    placeholder='84/86 12 34 567'
                                    placeholderTextColor={GoDeliveryColors.placeHolder}
                                    style={GlobalStyles.textInput} />
                            </View>
                            {phoneError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <WarningIcon />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{phoneError}</Text></View>
                            </View>)}
                        </View>
                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', }}>
                            <Checkbox
                                status={cashCheck ? 'checked' : 'unchecked'}
                                onPress={() => {
                                    if (!cashCheck) {
                                        setCashReasonDialog(true);
                                    }
                                    setCashCheck(!cashCheck);
                                    setMpesaCheck(false);
                                    setEmolaCheck(false);
                                }}
                            />
                            <Text style={GlobalStyles.subTitleText}>Cash</Text>
                            <Text style={[GlobalStyles.subTitleText, { color: GoDeliveryColors.secondary }]}>OnDelivery</Text>
                        </View>
                        <View style={{ marginTop: 20 }}>
                            <PrimaryButton buttonText='Pay' handler={handleCollect} />
                        </View>
                    </View>

                </View>
            </ScrollView>
            <Modal isVisible={cashReasonDialog}>
                <View style={styles.alertDialog}>
                    <Text style={[GlobalStyles.subTitle, { marginBottom: 20 }]}>Cash Reason</Text>
                    {
                        cashReasonOptions.map((option, index) => (
                            <View key={index} style={{}}>
                                <TouchableOpacity style={styles.selectRow} activeOpacity={0.5} onPress={() => { setCashReason(option["type"]) }} >
                                    <Text style={styles.title}>{option["type"]}</Text>
                                    {
                                        (cashReason == option["type"]) && (
                                            <Icons name="checkmark-outline" size={25} color={GoDeliveryColors.primary} />
                                        )
                                    }
                                </TouchableOpacity>
                                <Divider style={GlobalStyles.dividerStyle} />
                            </View>
                        ))
                    }

                    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 40, marginTop: 30 }}>
                        <TouchableOpacity onPress={() => {
                            setCashReasonDialog(false);
                        }}><Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.primary }]}>Ok</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setCashReasonDialog(false);
                            setCashReason("");
                            setCashCheck(false);
                        }}><Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.primary }]}>Cancel</Text></TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    logo: {
        width: 180,
        height: 80,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    divider: {
        borderColor: GoDeliveryColors.dividerColor,
        borderWidth: 0.25,
        width: '100%',
        marginVertical: 10,
    },
    paymentLogo: {
        width: 70,
        height: 30,
        resizeMode: 'contain'
    },
    alertDialog: {
        alignSelf: 'center',
        width: '100%',
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 5,
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    selectRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
        color: GoDeliveryColors.labelColor,
    },
})

export default Payment;
