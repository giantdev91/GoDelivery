import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface PasswordInputProps {
}

const PasswordInput = (props: PasswordInputProps): JSX.Element => {
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    return (
        <View style={styles.background}>
            <View style={styles.inputBack}>
                <Icons name={'lock-closed-outline'}
                    size={25}
                    color={GoDeliveryColors.place} />
                <TextInput style={styles.inputText}
                    placeholder={'password'}
                    secureTextEntry={secureTextEntry} />
                <TouchableOpacity onPress={() => { setSecureTextEntry(!secureTextEntry) }}>
                    <Icons name={secureTextEntry ? 'eye-outline' : 'eye-off-outline'}
                        size={25}
                        color={GoDeliveryColors.place} />
                </TouchableOpacity>
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

export default PasswordInput;