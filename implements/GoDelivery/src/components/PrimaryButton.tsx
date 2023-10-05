import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

interface PrimaryButtonProps {
    buttonText: string,
    disabled?: boolean,
    handler?: () => void,
}

const PrimaryButton = (props: PrimaryButtonProps): JSX.Element => {
    return (
        <TouchableOpacity
            disabled={props.disabled}
            style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp, { backgroundColor: props.disabled ? GoDeliveryColors.primayDisabled : GoDeliveryColors.primary }]}
            onPress={props.handler}
        >
            <Text style={[GlobalStyles.primaryLabel]}>{props.buttonText}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

});

export default PrimaryButton;