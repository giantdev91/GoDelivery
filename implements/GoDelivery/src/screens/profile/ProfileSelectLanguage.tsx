import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import GoDeliveryColors from '../../styles/colors';
import GlobalStyles from '../../styles/style';
import store from '../../redux/store';
import Icons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { BackIcon, ConfirmCheckIcon } from '../../common/Icons';

const ProfileSelectLanguage = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);
    const [lang, setLang] = useState('English');

    const handleBack = () => {
        navigation.goBack();
    }

    const languageSelect = (val: string) => {
        setLang(val);
    }

    const handleConfirm = () => {
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'GoDelivery',
            textBody: 'Save success',
            button: 'close',
        })
    }

    return (
        <View style={GlobalStyles.container}>
            <AlertNotificationRoot>
                <View style={[GlobalStyles.headerSection]}>
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Language</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                        <ConfirmCheckIcon />
                    </TouchableOpacity>
                </View>
                <View >
                    <TouchableOpacity style={[styles.selectRow, { marginTop: 10 }]} onPress={() => { languageSelect('Portuguese') }}>
                        <Text style={styles.title}>Portuguese</Text>
                        {
                            lang == 'Portuguese' && (<Icons name="checkmark-outline"
                                size={25}
                                color={GoDeliveryColors.primary} />)
                        }
                    </TouchableOpacity>
                    <Divider style={GlobalStyles.dividerStyle} />
                    <TouchableOpacity style={styles.selectRow} onPress={() => { languageSelect('English') }}>
                        <Text style={styles.title}>English</Text>
                        {
                            lang == 'English' && (<Icons name="checkmark-outline"
                                size={25}
                                color={GoDeliveryColors.primary} />)
                        }
                    </TouchableOpacity>
                    <Divider style={GlobalStyles.dividerStyle} />
                </View>
            </AlertNotificationRoot>
        </View>
    )
}

const styles = StyleSheet.create({
    selectRow: {
        flexDirection: 'row',
        paddingVertical: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: GoDeliveryColors.labelColor,
    },
});

export default ProfileSelectLanguage;