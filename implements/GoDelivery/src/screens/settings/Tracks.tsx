import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import GlobalStyles from '../../styles/style';

interface ScreenProps {
    navigation: any;
}

const TracksScreen = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <View style={[GlobalStyles.container]}>
            <Text>Tracks Screen</Text>
        </View>
    )
}

const styles = StyleSheet.create({

});

export default TracksScreen;