import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import GlobalStyles from '../../styles/style';
import CustomizedInput from '../../components/CustomizedInput';
import GoDeliveryColors from '../../styles/colors';
import { TabSceneProps } from '../../type';
import Action from '../../service';
import store from '../../redux/store';

interface LocationInputProps {
    value: string,
}

const LocationInput = (props: LocationInputProps) => {
    return (
        <View style={styles.background}>
            <View style={styles.inputBack}>
                <Icons name={'locate-outline'}
                    size={25}
                    color={GoDeliveryColors.place} />
                <TextInput style={styles.inputText}
                    placeholder={'Location'}
                    editable={false}
                    value={props.value}
                    secureTextEntry={false} />
            </View>
            <View style={styles.checkIconArea}>
                {props.value && (<Icons
                    name="checkmark-outline"
                    size={25}
                    color={GoDeliveryColors.green}
                />)}
            </View>
        </View>
    )
};

const ConfirmTab = (props: TabSceneProps) => {

    const [receiverPhone, setReceiverPhone] = useState('');
    const [expectationTime, setExpectationTime] = useState(new Date());
    const [volume, setVolume] = useState('');
    const [weight, setWeight] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

    const [fromLocationError, setFromLocationError] = useState('');
    const [toLocationError, setToLocationError] = useState('');
    const [receiverPhoneError, setReceiverPhoneError] = useState('');
    const [volumeError, setVolumeError] = useState('');
    const [weightError, setWeightError] = useState('');

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate;
        console.log('current date ===> ', currentDate);
        setExpectationTime(currentDate);
    }

    const showMode = (currentMode: string) => {
        DateTimePickerAndroid.open({
            display: 'spinner',
            value: expectationTime,
            onChange,
            mode: currentMode,
            is24Hour: true,
        });
    };

    const showDatePicker = () => {
        showMode('time');
    }

    const getFormatedExpectationTime = () => {
        const hours = expectationTime.getHours();
        const minutes = expectationTime.getMinutes();
        const formatedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        return formatedTime;
    }

    const formValidate = () => {
        var returnVal = true;
        if (!props.fromLocation?.displayName) {
            setFromLocationError("Please select the sender's location.");
            returnVal = false;
        } else {
            setFromLocationError("");
        }
        if (!receiverPhone) {
            setReceiverPhoneError("Please Enter the recipient's phone number.");
            returnVal = false;
        } else {
            setReceiverPhoneError("");
        }
        if (!props.toLocation?.displayName) {
            setToLocationError("Please select the recipient's location.");
            returnVal = false;
        } else {
            setToLocationError("");
        }
        if (!volume) {
            setVolumeError("Please enter the volume of the goods.");
            returnVal = false;
        } else {
            setVolumeError("");
        }
        if (!weight) {
            setWeightError("Please enter the weight of the goods.");
            returnVal = false;
        } else {
            setWeightError("");
        }
        return returnVal;
    }

    const handleSubmit = () => {
        setActivityIndicator(true);
        if (formValidate()) {
            const param = {
                sender: store.getState().CurrentUser.user.id,
                receiver: receiverPhone,
                from: props.fromLocation?.displayName,
                fromX: props.fromLocation?.location.latitude,
                fromY: props.fromLocation?.location.longitude,
                to: props.toLocation?.displayName,
                toX: props.toLocation?.location.latitude,
                toY: props.toLocation?.location.longitude,
                expectationTime: expectationTime,
                goodsVolumn: volume,
                goodsWeight: weight,
            }

            Action.order.createOrder(param)
                .then((res) => {
                    const response = res.data;
                    setActivityIndicator(false);
                    if (response.success) {
                        // props.navigation.reset({
                        //     index: 1,
                        //     routes: [{ name: 'NewOrderComplete' }],
                        // });
                        props.navigation.navigate('NewOrderComplete');
                    } else {
                        Alert.alert('Operation failed. Try again.');
                    }
                }).catch((err) => {
                    console.log('error: ', err);
                    setActivityIndicator(false);
                    Alert.alert('Operation failed. Try again.');
                });
        } else {
            setActivityIndicator(false);
        }
    }

    useEffect(() => {
    }, []);

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.subTitleText}>Confirmation</Text>
            <ScrollView>
                <View style={styles.formArea}>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <LocationInput value={props.fromLocation?.displayName ?? ''} />
                        </View>
                        <Text style={styles.textFieldErrorMsgArea}>
                            {fromLocationError}
                        </Text>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <CustomizedInput icon='person-outline' placeHolder="Receiver's phone number" keyboardType='number' handler={setReceiverPhone} />
                        </View>
                        <Text style={styles.textFieldErrorMsgArea}>
                            {receiverPhoneError}
                        </Text>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <LocationInput value={props.toLocation?.displayName ?? ''} />
                        </View>
                        <Text style={styles.textFieldErrorMsgArea}>
                            {toLocationError}
                        </Text>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }]}>
                            <TouchableOpacity onPress={showDatePicker} style={{ backgroundColor: GoDeliveryColors.white, padding: 10, borderRadius: 10 }}>
                                <Text style={GlobalStyles.text}>Set Expectation Time</Text>
                            </TouchableOpacity>
                            {/* <CustomizedInput icon='time-outline' placeHolder='expectation time' keyboardType='number' handler={setExpectationTime} /> */}

                            <Text style={{ marginLeft: 10 }}>{getFormatedExpectationTime()}</Text>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <CustomizedInput icon='speedometer-outline' placeHolder='volume' keyboardType='number' handler={setVolume} />
                        </View>
                        <Text style={styles.textFieldErrorMsgArea}>
                            {volumeError}
                        </Text>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <CustomizedInput icon='speedometer-outline' placeHolder='weight' keyboardType='number' handler={setWeight} />
                        </View>
                        <Text style={styles.textFieldErrorMsgArea}>
                            {weightError}
                        </Text>
                    </View>
                </View>
                <View style={styles.buttonRow}>
                    <TouchableOpacity
                        style={[styles.submitButton]}
                        onPress={handleSubmit}
                    >
                        <Text style={GlobalStyles.primaryLabel}>Submit</Text>
                    </TouchableOpacity>

                </View>
            </ScrollView>
            {activityIndicator && <ActivityIndicator size={'large'} style={{ position: 'absolute', alignSelf: 'center', bottom: 150, }} />}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputBack: {
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputText: {
        marginLeft: 10, flex: 1, paddingHorizontal: 10
    },
    checkIconArea: {
        width: 35,
        alignItems: 'flex-end'
    },
    formArea: {
        paddingHorizontal: 20,
        flex: 1,
    },
    textFieldErrorMsgArea: {
        height: 25,
        paddingLeft: 20,
        color: GoDeliveryColors.primary
    },
    buttonRow: {
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    submitButton: {
        borderRadius: 30,
        backgroundColor: GoDeliveryColors.primary,
        width: 150,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
});

export default ConfirmTab;