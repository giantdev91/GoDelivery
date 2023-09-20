import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Alert, Text } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import GoDeliveryColors from '../../styles/colors';
import store from '../../redux/store';
import { Checkbox, Divider } from 'react-native-paper';
import Icons from 'react-native-vector-icons/Ionicons';

interface ScreenProps {
    navigation: any;
}

const SelectLanguageScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);

    const [lang, setLang] = useState('English');

    useFocusEffect(
        useCallback(() => {
            setUserData(store.getState().CurrentUser.user);
        }, [])
    );

    const languageSelect = (val: string) => {
        setLang(val);
    }

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'CHANGE LANGUAGE'} />
            <View style={[GlobalStyles.container, { padding: 30, }]}>
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

export default SelectLanguageScreen;