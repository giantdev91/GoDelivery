import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

interface HeaderBarProps {
    navigation: any,
    title?: string
}

const HeaderBar = (props: HeaderBarProps): JSX.Element => {
    const handleBack = () => {
        props.navigation.goBack();
    }
    return (
        <View style={styles.headerSection}>
            <TouchableOpacity style={styles.headerBackButton} onPress={handleBack}>
                <Icons name='chevron-back-outline' size={30} color={GoDeliveryColors.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{props.title}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    headerSection: {
        alignItems: 'flex-start',
        height: 50,
        width: '100%',
        justifyContent: 'center',
        backgroundColor: GoDeliveryColors.primary
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: GoDeliveryColors.white,
        marginLeft: 80,
    },
    headerBackButton: {
        position: 'absolute',
        left: 20,
        padding: 10,
    }
})

export default HeaderBar;