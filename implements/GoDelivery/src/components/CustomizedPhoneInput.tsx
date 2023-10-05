import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Text } from 'react-native';
import CountryFlag from "react-native-country-flag"
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

const CustomizedPhoneInput = ({ handler, value, disabled, placeholder, error }: {
    handler: (val: string) => void,
    value: string,
    disabled?: boolean
    placeholder?: string,
    error?: boolean
}): JSX.Element => {
    return (
        <View style={[styles.inputContainer, { borderColor: error ? GoDeliveryColors.primary : GoDeliveryColors.disabled }]}>
            <CountryFlag isoCode="MZ" size={20} />
            <Text style={GlobalStyles.text}>+258</Text>
            <TextInput
                keyboardType="number-pad"
                numberOfLines={1}
                style={[GlobalStyles.text, { textAlign: 'left', justifyContent: 'center', padding: 10 }]}
                value={value}
                onChangeText={(text) => handler(text)}
                maxLength={9}
                editable={!disabled}
                placeholder={placeholder}
            />
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
        borderRadius: 5,
        borderWidth: 1,
        borderColor: GoDeliveryColors.disabled
    }
});

export default CustomizedPhoneInput;