import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native';
import GoDeliveryColors from '../../styles/colors';
import GlobalStyles from '../../styles/style';
import store from '../../redux/store';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import PasswordInput from '../../components/PasswordInput';
import Action from '../../service';
import { BackIcon, ConfirmCheckIcon, PasswordIcon, WarningIcon } from '../../common/Icons';
import { TextInput } from 'react-native-gesture-handler';

const ProfileChangePassword = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [oldPassword, setOldPassword] = useState('');

    const [passwordError, setPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [oldPasswordError, setOldPasswordError] = useState('');
    const [activityIndicator, setActivityIndicator] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    }

    const validateForm = () => {
        let flag = true;
        if (!password) {
            flag = false;
            setPasswordError("Can't Empty!");
        } else {
            setPasswordError("");
        }
        if (!confirmPassword) {
            flag = false;
            setConfirmPasswordError("Can't Empty!");
        } else {
            if (password != confirmPassword) {
                flag = false;
                setConfirmPasswordError("password doesn't match!");
            } else {
                setConfirmPasswordError("");
            }
        }

        if (!oldPassword) {
            flag = false;
            setOldPasswordError("Can't Empty!");
        } else {
            setOldPasswordError("");
        }
        return flag;
    }

    const changePassword = () => {
        setActivityIndicator(true);
        Action.client.updatePassword({
            id: currentUser.id,
            password: password,
            oldPassword: oldPassword
        }).then((res) => {

            const response = res.data;
            if (response.success) {
                Dialog.show({
                    type: ALERT_TYPE.SUCCESS,
                    title: 'GoDelivery',
                    textBody: response.message,
                    button: 'close',
                })
            } else {
                Dialog.show({
                    type: ALERT_TYPE.DANGER,
                    title: 'GoDelivery',
                    textBody: response.message,
                    button: 'close',
                })
            }
            setActivityIndicator(false);
        }).catch(err => console.log("error: ", err));
    }

    const handleConfirm = () => {
        if (validateForm()) {
            changePassword();
        }
    }

    return (
        <View style={GlobalStyles.container}>
            <AlertNotificationRoot>
                <View style={[GlobalStyles.headerSection]}>
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Change Password</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                        <ConfirmCheckIcon />
                    </TouchableOpacity>
                </View>
                <View style={{ marginTop: 30 }}>
                    <View style={[styles.inputContainer, { zIndex: 3 }]}>
                        <PasswordIcon />
                        <View style={{ flex: 1, }}>
                            <Text style={GlobalStyles.textDisable}>New Password</Text>
                            <TextInput
                                value={password}
                                placeholder='******'
                                style={GlobalStyles.textInput}
                                secureTextEntry={true}
                                placeholderTextColor={GoDeliveryColors.placeHolder}
                                onChangeText={(val) => {
                                    if (val) {
                                        setPasswordError('')
                                    }
                                    setPassword(val)
                                }} />
                            {passwordError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <WarningIcon />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{passwordError}</Text></View>
                            </View>)}
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { zIndex: 2 }]}>
                        <PasswordIcon />
                        <View style={{ flex: 1, }}>
                            <Text style={GlobalStyles.textDisable}>Confirm Password</Text>
                            <TextInput
                                value={confirmPassword}
                                placeholder='******'
                                style={GlobalStyles.textInput}
                                secureTextEntry={true}
                                placeholderTextColor={GoDeliveryColors.placeHolder}
                                onChangeText={(val) => {
                                    if (val) {
                                        setConfirmPasswordError('')
                                    }
                                    setConfirmPassword(val)
                                }} />
                            {confirmPasswordError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <WarningIcon />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{confirmPasswordError}</Text></View>
                            </View>)}
                        </View>
                    </View>

                    <View style={[styles.inputContainer, { zIndex: 1 }]}>
                        <PasswordIcon />
                        <View style={{ flex: 1, }}>
                            <Text style={GlobalStyles.textDisable}>Old Password</Text>
                            <TextInput
                                value={oldPassword}
                                placeholder='******'
                                style={GlobalStyles.textInput}
                                secureTextEntry={true}
                                placeholderTextColor={GoDeliveryColors.placeHolder}
                                onChangeText={(val) => {
                                    if (val) {
                                        setOldPasswordError('')
                                    }
                                    setOldPassword(val)
                                }} />
                            {oldPasswordError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                <WarningIcon />
                                <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{oldPasswordError}</Text></View>
                            </View>)}
                        </View>
                    </View>
                    {activityIndicator && (
                        <ActivityIndicator
                            size={'large'}
                            style={{ position: 'absolute', alignSelf: 'center', bottom: 150 }}
                        />
                    )}
                </View>
            </AlertNotificationRoot>
        </View>
    )
}

const styles = StyleSheet.create({
    selectRow: {
        flexDirection: 'row',
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: GoDeliveryColors.labelColor,
    },
    inputContainer: {
        marginVertical: 5,
        paddingHorizontal: 30,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },
});

export default ProfileChangePassword;