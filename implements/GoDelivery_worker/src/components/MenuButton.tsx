import React from 'react';
import { StyleSheet, TouchableOpacity, View, Image, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface ScreenProps {
    navigation: any;
}

const MenuButton = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <TouchableOpacity
            style={{ position: 'absolute', left: 20, top: 20 }}
            onPress={() => { navigation.openDrawer(); }}
        >
            <Icons name={'menu-sharp'} size={45} color={GoDeliveryColors.primary} />
        </TouchableOpacity>
    )
}

export default MenuButton;