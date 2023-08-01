import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import CustomizedInput from '../../components/CustomizedInput';
import PrimaryButton from '../../components/PrimaryButton';

interface ScreenProps {
    navigation: any;
}

const ProfileScreen = ({ navigation }: ScreenProps): JSX.Element => {
    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'My Profile'} />
            <View style={styles.avatarArea}>
                <TouchableOpacity>
                    <Image source={require('../../../assets/images/user_default_avatar.png')} style={styles.avatarImg} />
                </TouchableOpacity>
            </View>
            <View style={styles.profileFormArea}>
                <View style={{ marginTop: 20 }}>
                    <CustomizedInput icon='call-outline' placeHolder='Phone number' keyboardType='number' />
                    <View style={styles.textFieldErrorMsgArea}>
                    </View>
                    <CustomizedInput icon='person-outline' placeHolder='Username' />
                    <View style={styles.textFieldErrorMsgArea}>
                    </View>
                </View>
                <View style={{ marginTop: 20 }}>
                    <PrimaryButton buttonText='Submit' />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarArea: {
        marginTop: 30,
        paddingVertical: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 160,
        height: 160,
        borderRadius: 200,
    },
    profileFormArea: {
        padding: 20,
        flex: 1,
    },
    textFieldErrorMsgArea: {
        height: 35,
        paddingLeft: 20,
    },
});

export default ProfileScreen;