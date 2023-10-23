import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { BackIcon } from '../common/Icons';

interface BackButtonProps {
    navigation: any,
}

const BackButton = ({ navigation }: BackButtonProps): JSX.Element => {

    const backButtonHandler = () => {
        navigation.goBack();
    }
    return (
        <TouchableOpacity
            style={styles.backButtonBack}
            onPress={backButtonHandler}
        >
            <BackIcon />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    backButtonBack: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        position: 'absolute',
        top: 25,
        left: 25,
    },

});

export default BackButton;