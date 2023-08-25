import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import CountryFlag from "react-native-country-flag"
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

const CustomizedPhoneInput = ({ handler, value, disabled, placeholder }: {
    handler: (val: string) => void,
    value: string,
    disabled?: boolean
    placeholder?: string,
}): JSX.Element => {
    return (
        <View style={styles.inputContainer}>
            <CountryFlag isoCode="MZ" size={20} />
            <Text style={GlobalStyles.textMedium}>+258</Text>
            <TextInput keyboardType="number-pad" style={[GlobalStyles.textMedium, { textAlign: 'left', justifyContent: 'center' }]} value={value} onChangeText={(text) => handler(text)} maxLength={9} editable={!disabled} placeholder={placeholder} />
        </View>
    )
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: GoDeliveryColors.white,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: GoDeliveryColors.disabled
    }
});

export default CustomizedPhoneInput;