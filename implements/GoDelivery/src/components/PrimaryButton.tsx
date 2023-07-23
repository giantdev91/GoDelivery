import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import GoDeliveryColors from '../styles/colors';
import GlobalStyles from '../styles/style';

interface PrimaryButtonProps {
    buttonText: string,
    handler?: () => void,
}

const PrimaryButton = (props: PrimaryButtonProps): JSX.Element => {
    return (
        <TouchableOpacity
            style={[GlobalStyles.primaryButton, GlobalStyles.shadowProp]}
            onPress={props.handler}
        >
            <Text style={[GlobalStyles.primaryLabel]}>{props.buttonText}</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({

});

export default PrimaryButton;