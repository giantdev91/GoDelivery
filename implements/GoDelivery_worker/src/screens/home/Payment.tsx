import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
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
                    <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Collect Payment</Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
                    <View style={{ marginTop: 20, alignItems: 'center' }}>
                        <Image source={require("../../../assets/images/company-logo.png")} style={styles.logo} />
                        <Text style={GlobalStyles.textDisable}>{from}</Text>
                        <Text style={GlobalStyles.textDisable}>{to}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <Text style={[GlobalStyles.textMedium, { color: GoDeliveryColors.disabled }]}>SERVICE DETAILS</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={GlobalStyles.textDisable}>Discount</Text>
                        <Text style={GlobalStyles.textDisable}>0%</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={GlobalStyles.subTitle}>Total</Text>
                        <Text style={GlobalStyles.subTitle}>MZN {CommonFunctions.getLocalNumberValue(price)}</Text>
                    </View>
                    <Divider style={styles.divider} />
                    <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Text style={GlobalStyles.subTitle}>Cash Payment</Text>
                    </View>
                    <Text style={GlobalStyles.textDisable}>By Collecting the Payment in cash you must tell us the reason. Only accept Payment in cash in extreme system failure case.</Text>
                    <Divider style={styles.divider} />
                    <Text style={GlobalStyles.textMedium}>Payment Method</Text>
                    
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
                        <Text style={GlobalStyles.subTitleText}>Collect</Text>
                        <Text style={[GlobalStyles.subTitleText, { color: GoDeliveryColors.secondary }]}>Cash</Text>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <PrimaryButton buttonText='Collect' handler={handleCollect} />
                    </View>
                </View>
            </ScrollView>
            <Modal isVisible={cashReasonDialog}>
                <View style={styles.alertDialog}>
                    <Text style={GlobalStyles.subTitle}>Cash Reason</Text>
                    <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%', marginTop: 30 }} />
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
                                <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
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
        borderColor: GoDeliveryColors.disabled,
        borderWidth: 0.5,
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
        color: GoDeliveryColors.disabled,
    },
})

export default Payment;
