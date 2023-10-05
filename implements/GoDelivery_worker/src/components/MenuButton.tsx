import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface ScreenProps {
    navigation: any;
    color?: string;
}

const MenuButton = ({ navigation, color }: ScreenProps): JSX.Element => {
    return (
        <TouchableOpacity
            style={{ position: 'absolute', left: 20, top: 10 }}
            onPress={() => { navigation.openDrawer(); }}
        >
            <Icons name={'menu-sharp'} size={45} color={color == 'default' ? GoDeliveryColors.primary : GoDeliveryColors.white} />
        </TouchableOpacity>
    )
}

export default MenuButton;