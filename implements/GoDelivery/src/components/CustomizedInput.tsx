import React from 'react';
import { View, StyleSheet, TextInput } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface CustomizedInputProps {
    icon: string,
    placeHolder: string,
    keyboardType?: string,
}

const CustomizedInput = (props: CustomizedInputProps): JSX.Element => {
    return (
        <View style={styles.background}>
            <View style={styles.inputBack}>
                <Icons name={props.icon}
                    size={25}
                    color={GoDeliveryColors.place} />
                <TextInput style={styles.inputText}
                    placeholder={props.placeHolder}
                    keyboardType={props.keyboardType == 'number' ? 'numeric' : 'default'}
                    secureTextEntry={false} />
            </View>
            <View style={styles.checkIconArea}>
                <Icons
                    name="checkmark-outline"
                    size={25}
                    color={GoDeliveryColors.green}
                />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    background: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    inputBack: {
        backgroundColor: GoDeliveryColors.white,
        borderRadius: 25,
        paddingHorizontal: 20,
        paddingVertical: 0,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    inputText: {
        marginLeft: 10, flex: 1, paddingHorizontal: 10
    },
    checkIconArea: {
        width: 35,
        alignItems: 'flex-end'
    }
});

export default CustomizedInput;