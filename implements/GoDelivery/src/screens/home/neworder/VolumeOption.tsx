import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text, TextInput, } from 'react-native';
import { useDispatch } from 'react-redux';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import store from '../../../redux/store';
import allActions from '../../../redux/actions';
import { BackIcon, ConfirmCheckIcon, WarningIcon } from '../../../common/Icons';

const VolumeOption = ({ navigation }: {
    navigation: any,
}): JSX.Element => {

    const defaultOptions = [
        {
            name: "Small",
            value: "20x11x7cm",
        },
        {
            name: "Medium",
            value: "23x30x11cm",
        },
        {
            name: "Large",
            value: "40x40x20cm",
        }
    ];
    const orderInfo = store.getState().NewOrder.orderInfo;

    const [selectedOption, setSelectedOption] = useState(orderInfo["volume"]);
    const [customLength, setCustomLength] = useState("");
    const [customLengthError, setCustomLengthError] = useState(false);
    const [customWidth, setCustomWidth] = useState("");
    const [customWidthError, setCustomWidthError] = useState(false);
    const [customHeight, setCustomHeight] = useState("");
    const [customHeightError, setCustomHeightError] = useState(false);

    const dispatch = useDispatch();
    const handleBack = () => {
        navigation.goBack();
    }

    const validate = () => {
        var flag = true;
        if (selectedOption && selectedOption.includes("Custom")) {
            if (!customLength || Number.parseInt(customLength) > 50) {
                flag = false;
                setCustomLengthError(true);
            } else {
                setCustomLengthError(false);
            }
            if (!customWidth || Number.parseInt(customWidth) > 50) {
                flag = false;
                setCustomWidthError(true);
            } else {
                setCustomWidthError(false);
            }
            if (!customHeight || Number.parseInt(customHeight) > 50) {
                flag = false;
                setCustomHeightError(true);
            } else {
                setCustomHeightError(false);
            }
        }
        return flag;
    }

    const handleClick = (option: any) => {
        setSelectedOption(`${option["name"]}-${option["value"]}`);
        setCustomLengthError(false);
        setCustomWidthError(false);
        setCustomHeightError(false);
        setCustomLength("");
        setCustomWidth("");
        setCustomHeight("");
    }

    const handleConfirm = () => {
        if (validate()) {
            dispatch(allActions.OrderAction.setNewOrder({
                ...orderInfo,
                volume: selectedOption && selectedOption.includes("Custom") ? `Custom-${customLength}x${customWidth}x${customHeight}cm` : selectedOption
            }));
            navigation.goBack();
        }
    }

    const initializeValue = () => {
        if (orderInfo["volume"] && orderInfo["volume"].includes("Custom")) {
            const value = orderInfo["volume"].split("-")[1].replaceAll("cm", "");
            setCustomLength(value.split("x")[0]);
            setCustomWidth(value.split("x")[1]);
            setCustomHeight(value.split("x")[2]);
        }
    }

    useEffect(() => {
        initializeValue();
    }, [])

    return (
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.headerSection}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Volume</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                    <ConfirmCheckIcon />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20 }}>
                {
                    defaultOptions.map((option, index) => (
                        <TouchableOpacity key={index} onPress={() => {
                            handleClick(option);
                        }}>
                            <View style={[styles.optionCard, (selectedOption && selectedOption.split("-")[0] == option["name"]) ? { borderColor: GoDeliveryColors.primary } : {}]}>
                                <Image source={require("../../../../assets/images/icons/goods-dark.png")} />
                                <Text style={GlobalStyles.subTitle}>{option["name"]}</Text>
                                <Text style={GlobalStyles.textDisable}>{option["value"]}</Text>
                            </View>
                        </TouchableOpacity>
                    ))
                }
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, paddingHorizontal: 20, alignItems: 'center', gap: 20 }}>
                <TouchableOpacity onPress={() => setSelectedOption("Custom")} >
                    <View style={[styles.optionCard, selectedOption && selectedOption.includes("Custom") ? { borderColor: GoDeliveryColors.primary } : {}]}>
                        <Image source={require("../../../../assets/images/icons/goods-dark.png")} />
                        <Text style={GlobalStyles.subTitle}>Custom</Text>
                        <Text style={GlobalStyles.textDisable}>LxWxH</Text>
                    </View>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <View>
                        <TextInput
                            placeholder='Length'
                            style={[styles.inputBox, customLengthError ? { borderColor: GoDeliveryColors.primary } : {}]}
                            value={customLength}
                            onChangeText={setCustomLength}
                            keyboardType='number-pad' />
                        {customLengthError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                            <WarningIcon />
                            <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>Value must be less than 50.</Text></View>
                        </View>)}
                    </View>
                    <View>
                        <TextInput
                            placeholder='Width'
                            style={[styles.inputBox, customWidthError ? { borderColor: GoDeliveryColors.primary } : {}]}
                            value={customWidth}
                            onChangeText={setCustomWidth}
                            keyboardType='number-pad' />
                        {customWidthError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                            <WarningIcon />
                            <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>Value must be less than 50.</Text></View>
                        </View>)}
                    </View>

                    <View>
                        <TextInput
                            placeholder='Height'
                            style={[styles.inputBox, customHeightError ? { borderColor: GoDeliveryColors.primary } : {}]}
                            value={customHeight}
                            onChangeText={setCustomHeight}
                            keyboardType='number-pad' />
                        {customHeightError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                            <WarningIcon />
                            <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>Value must be less than 50.</Text></View>
                        </View>)}
                    </View>

                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    optionCard: {
        width: 100,
        borderWidth: 2,
        borderColor: GoDeliveryColors.disabled,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    inputBox: {
        borderBottomWidth: 0.5,
        borderBottomColor: GoDeliveryColors.disabled,
        paddingHorizontal: 15,
        paddingVertical: 5,
        marginTop: 10,
    }
});

export default VolumeOption;