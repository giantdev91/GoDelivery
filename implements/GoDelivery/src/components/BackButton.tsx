import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import GoDeliveryColors from '../styles/colors';

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
            <FontAwesomeIcon
                name="chevron-left"
                size={30}
                color={GoDeliveryColors.white}
            />
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