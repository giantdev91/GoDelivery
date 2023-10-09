import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import GoDeliveryColors from '../../styles/colors';
import GlobalStyles from '../../styles/style';
import store from '../../redux/store';
import Icons from 'react-native-vector-icons/Ionicons';
import { Divider } from 'react-native-paper';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

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
                        <FontAwesome name="arrow-left-long" size={20} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Language</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleConfirm}>
                        <Icons name='checkmark-outline' size={30} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                </View>
                <View style={[GlobalStyles.container, { padding: 30, }]}>
                    <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
                    <TouchableOpacity style={styles.selectRow} onPress={() => { languageSelect('Portuguese') }}>
                        <Text style={styles.title}>Portuguese</Text>
                        {
                            lang == 'Portuguese' && (<Icons name="checkmark-outline"
                                size={25}
                                color={GoDeliveryColors.primary} />)
                        }
                    </TouchableOpacity>
                    <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
                    <TouchableOpacity style={styles.selectRow} onPress={() => { languageSelect('English') }}>
                        <Text style={styles.title}>English</Text>
                        {
                            lang == 'English' && (<Icons name="checkmark-outline"
                                size={25}
                                color={GoDeliveryColors.primary} />)
                        }
                    </TouchableOpacity>
                    <Divider style={{ borderColor: GoDeliveryColors.disabled, borderWidth: 0.5, width: '100%' }} />
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
});

export default ProfileSelectLanguage;