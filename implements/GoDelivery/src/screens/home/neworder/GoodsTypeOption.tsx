import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, View, ScrollView, Text, ActivityIndicator, } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import GlobalStyles from '../../../styles/style';
import GoDeliveryColors from '../../../styles/colors';
import { Divider } from 'react-native-paper';
import Action from '../../../service';
import store from '../../../redux/store';
import allActions from '../../../redux/actions';
import { BackIcon, ConfirmCheckIcon, RedCheckMarker } from '../../../common/Icons';
import CustomIndicator from '../../../common/CustomIndicator';

const GoodsTypeOption = ({ navigation }: {
    navigation: any,
}): JSX.Element => {
    const orderInfo = store.getState().NewOrder.orderInfo;

    const [activityIndicator, setActivityIndicator] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(orderInfo["goodsType"]);
    const dispatch = useDispatch();

    const handleBack = () => {
        navigation.goBack();
    }

    const handleConfirm = () => {
        dispatch(allActions.OrderAction.setNewOrder({
            ...orderInfo,
            goodsType: selectedOption
        }));
        navigation.goBack();
    }

    const getAllOption = () => {
        setActivityIndicator(true);
        Action.orderOption.goodsTypeOptionList()
            .then((res) => {
                const response = res.data;
                setOptions(response.data);
                setActivityIndicator(false);
            }).catch((err) => {
                console.log("error: ", err);
                setActivityIndicator(false);
            })
    }

    useEffect(() => {
        getAllOption();
    }, [])

    return (
        <View style={[GlobalStyles.container]}>
            <View style={GlobalStyles.headerSection}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <BackIcon />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Type of Goods</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                    <ConfirmCheckIcon />
                </TouchableOpacity>
            </View>
            <ScrollView >
                {
                    options.map((option, index) => (
                        <View key={index} style={{}}>
                            <TouchableOpacity style={[styles.selectRow]} activeOpacity={0.5} onPress={() => { setSelectedOption(option["type"]) }} >
                                <Text style={styles.title}>{option["type"]}</Text>
                                {
                                    (selectedOption == option["type"]) && (
                                        <RedCheckMarker />
                                    )
                                }
                            </TouchableOpacity>
                            <Divider style={GlobalStyles.dividerStyle} />
                        </View>
                    ))
                }
            </ScrollView>
            {activityIndicator && (
                <CustomIndicator />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    selectRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        height: 50
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: GoDeliveryColors.labelColor,
    },
});


export default GoodsTypeOption;