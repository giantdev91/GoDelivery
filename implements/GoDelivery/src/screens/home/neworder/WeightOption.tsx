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

const WeightOption = ({ navigation }: {
    navigation: any,
}): JSX.Element => {
    const orderInfo = store.getState().NewOrder.orderInfo;

    const [activityIndicator, setActivityIndicator] = useState(false);
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState(orderInfo["weight"]);
    const dispatch = useDispatch();
    const handleBack = () => {
        navigation.goBack();
    }

    const handleConfirm = () => {
        dispatch(allActions.OrderAction.setNewOrder({
            ...orderInfo,
            weight: selectedOption
        }));
        navigation.goBack();
    }

    const getAllOption = () => {
        setActivityIndicator(true);
        Action.orderOption.weightOptionList()
            .then((res) => {
                const response = res.data;
                console.log("response : ", response);
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
        <View style={GlobalStyles.container}>
            <View style={GlobalStyles.headerSection}>
                <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                    <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
                <Text style={GlobalStyles.whiteHeaderTitle}>Weight</Text>
                <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                    <Icons name='checkmark-outline' size={30} color={GoDeliveryColors.secondary} />
                </TouchableOpacity>
            </View>
            <ScrollView style={[GlobalStyles.container, { padding: 30, }]}>
                <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
                {
                    options.map((option, index) => (
                        <View key={index} style={{}}>
                            <TouchableOpacity style={styles.selectRow} activeOpacity={0.5} onPress={() => { setSelectedOption(option["weight"]) }} >
                                <Text style={styles.title}>{option["weight"]}</Text>
                                {
                                    (selectedOption == option["weight"]) && (
                                        <Icons name="checkmark-outline" size={25} color={GoDeliveryColors.primary} />
                                    )
                                }
                            </TouchableOpacity>
                            <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
                        </View>
                    ))
                }
            </ScrollView>
            {activityIndicator && (
                <ActivityIndicator
                    size={'large'}
                    style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
                />
            )}
        </View>
    )
}

const styles = StyleSheet.create({
    selectRow: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: GoDeliveryColors.labelColor,
    },
});


export default WeightOption;