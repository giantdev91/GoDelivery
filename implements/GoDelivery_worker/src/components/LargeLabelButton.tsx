import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

interface PrimaryButtonProps {
    buttonText: string,
    disabled?: boolean,
    handler?: () => void,
}

const LargeLabelButton = (props: PrimaryButtonProps): JSX.Element => {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, { backgroundColor: props.disabled ? GoDeliveryColors.primayDisabled : GoDeliveryColors.primary }]}
            onPress={props.handler}
        >
            <Text style={[styles.buttonText]}>{props.buttonText}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        fontWeight: '600',
        color: GoDeliveryColors.white
    }
});

export default LargeLabelButton;