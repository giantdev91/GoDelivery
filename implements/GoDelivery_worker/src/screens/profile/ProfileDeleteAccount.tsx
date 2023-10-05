import React, { useState } from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator, } from 'react-native';
import GoDeliveryColors from '../../styles/colors';
import GlobalStyles from '../../styles/style';
import store from '../../redux/store';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import Action from '../../service';
import LargeLabelButton from '../../components/LargeLabelButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

const ProfileDeleteAccount = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [userData, setUserData] = useState(store.getState().CurrentUser.user);
    const [avatarUri, setAvatarUri] = useState(currentUser.avatar);
    const [isModalVisible, setModalVisible] = useState(false);
    const [activityIndicator, setActivityIndicator] = useState(false);

    const handleBack = () => {
        navigation.goBack();
    }

    const toggleModal = () => {
        if(!activityIndicator) {
            setModalVisible(!isModalVisible);
        }
    }

    const deleteAccount = () => {
        setActivityIndicator(true);
        Action.client.deleteAccount({ clientId: currentUser.id })
            .then(async res => {
                const response = res.data;
                setActivityIndicator(false);
                toggleModal();
                if (response.success) {
                    await AsyncStorage.removeItem('USER_DATA');
                    Dialog.show({
                        type: ALERT_TYPE.SUCCESS,
                        title: 'GoDelivery',
                        textBody: "Delete success!",
                        button: 'close',
                    });
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash', params: { initialIndex: 0 } }],
                    });
                } else {
                    Dialog.show({
                        type: ALERT_TYPE.DANGER,
                        title: 'GoDelivery',
                        textBody: "Delete failed!",
                        button: 'close',
                    })
                }

            }).catch(err => console.log("error: ", err))
    }

    const handleConfirm = () => {
        setModalVisible(true);
    }

    return (
        <View style={GlobalStyles.container}>
            <AlertNotificationRoot>
                <View style={[GlobalStyles.headerSection]}>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Delete Account</Text>
                </View>

                <View style={styles.avatarArea}>
                    <View style={{ width: 120, height: 120 }}>
                        {
                            !avatarUri && (<Image source={require('../../../assets/images/delivery-man.png')} style={styles.avatarImg} />)
                        }
                        {
                            avatarUri && (<Image source={{ uri: avatarUri }} style={styles.avatarImg} />)
                        }
                    </View>
                </View>
                <View style={{ flex: 1, justifyContent: 'space-between', padding: 30, }}>
                    <View style={{ alignItems: 'center' }}>
                        <Text style={GlobalStyles.headerTitle}>{userData.name}</Text>
                        <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>+{userData.phone}</Text>
                    </View>

                    <LargeLabelButton buttonText="DELETE" handler={toggleModal} />
                </View>

            </AlertNotificationRoot>

            <Modal
                isVisible={isModalVisible}
                onBackdropPress={toggleModal}
                style={styles.modalContainer}>
                <View style={styles.modalContentContainer}>
                    <Text style={[GlobalStyles.headerTitle, { textAlign: 'center', color: GoDeliveryColors.primary }]}>Are you sure?</Text>
                    <Text style={[GlobalStyles.subTitle, { textAlign: 'center', color: GoDeliveryColors.disabled }]}>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</Text>

                    {activityIndicator && (
                        <ActivityIndicator
                            size={'large'}
                            style={{ position: 'absolute', alignSelf: 'center', bottom: 100 }}
                        />
                    )}

                    <View style={styles.controlButtonRow}>
                        <TouchableOpacity style={styles.controlButton} onPress={deleteAccount}>
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.white }]}>Confirm</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={toggleModal}
                            style={[styles.controlButton, { backgroundColor: GoDeliveryColors.disabled }]}>
                            <Text style={[GlobalStyles.subTitle,]}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarArea: {
        marginTop: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 120,
        height: 120,
        borderRadius: 200,
    },
    modalContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    modalContentContainer: {
        backgroundColor: GoDeliveryColors.white,
        paddingVertical: 30,
        paddingHorizontal: 20,
        width: '100%',
        borderRadius: 5,
    },
    controlButtonRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
    },
    controlButton: {
        backgroundColor: GoDeliveryColors.primary,
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 5,
    }
});

export default ProfileDeleteAccount;