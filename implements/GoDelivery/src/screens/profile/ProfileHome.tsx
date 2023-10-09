import React, { useState, useCallback } from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { useFocusEffect } from '@react-navigation/native';
import GoDeliveryColors from '../../styles/colors';
import GlobalStyles from '../../styles/style';
import store from '../../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import storage from '@react-native-firebase/storage';
import { CameraIcon, CameraIconWhite, DocumentIcon, GlobIcon, ImageIcon, LogoutIcon, PasswordIcon, SaveIcon, ShieldCheckIcon, TrashIcon } from '../../common/Icons';

const ProfileHome = ({ navigation }: {
    navigation: any;
}): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [avatarUri, setAvatarUri] = useState(currentUser.avatar);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalActivitiIndicator, setModalActivityIndicator] = useState(false);
    const [activiIndicator, setActivityIndicator] = useState(false);
    const [phone, setPhone] = useState(currentUser.phone.slice(3));
    const [username, setUsername] = useState(currentUser.name);

    const setPickerResponse = async (response: any) => {
        setModalActivityIndicator(true);
        try {
            const uri = response?.assets[0].uri;
            const storageRef = storage().ref();
            const imageRef = storageRef.child('images/' + Date.now()); // Use a unique path for each upload

            const res = await fetch(uri);
            const blob = await res.blob();
            //upload image to firebase storage
            await imageRef.put(blob);
            // Get the public download URL
            const downloadURL = await imageRef.getDownloadURL();
            console.log('Image uploaded successfully');
            console.log('Download URL:', downloadURL);
            setAvatarUri(downloadURL.toString());
            setModalActivityIndicator(false);
            setModalVisible(false);
        } catch (error) {
            console.error('Error uploading image: ', error);
            setModalActivityIndicator(false);
        }
    };

    const onImageLibraryPress = () => {
        const options = {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
        };
        launchImageLibrary(options, setPickerResponse);
    };

    const onCameraPress = () => {
        const options = {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            cameraType: 'front',
        };
        launchCamera(options, setPickerResponse);
    };

    const logout = async () => {
        await AsyncStorage.removeItem('CLIENT_DATA');
        navigation.reset({
            index: 0,
            routes: [{ name: 'Splash', params: { initialIndex: 0 } }],
        });
    };

    useFocusEffect(
        useCallback(() => {
            currentUser = store.getState().CurrentUser.user;
            setUsername(currentUser.name);
            setPhone(currentUser.phone.slice(3));
        }, [])
    );

    return (
        <View style={GlobalStyles.container}>
            <View style={[GlobalStyles.headerSection]}>
                <Text style={GlobalStyles.whiteHeaderTitle}>Profile</Text>
            </View>
            <ScrollView>
                <View style={styles.avatarArea}>
                    <View style={{ width: 125, height: 125 }}>
                        {
                            !avatarUri && (<Image source={require('../../../assets/images/user_default_avatar.png')} style={styles.avatarImg} />)
                        }
                        {
                            avatarUri && (<Image source={{ uri: avatarUri }} style={styles.avatarImg} />)
                        }
                        {/* <TouchableOpacity
                            onPress={() => {
                                setModalVisible(true);
                            }}
                            style={{
                                backgroundColor: GoDeliveryColors.place,
                                padding: 8,
                                borderRadius: 100,
                                position: 'absolute',
                                bottom: 0,
                                right: 0,
                            }}>
                            <CameraIcon />
                        </TouchableOpacity> */}
                    </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={GlobalStyles.headerTitle}>{username}</Text>
                    <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>+258{phone}</Text>
                </View>
                <View style={styles.subMenuContainer}>
                    <TouchableOpacity onPress={() => { navigation.navigate("ProfileSelectLanguage") }}>
                        <View style={styles.subMenu}>
                            <GlobIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Language</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("ProfileChangePassword") }}>
                        <View style={styles.subMenu}>
                            <PasswordIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Change Password</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("ProfileEdit") }}>
                        <View style={styles.subMenu}>
                            <SaveIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Edit Profile</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.subMenu}>
                            <DocumentIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Terms & Conditions</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <View style={styles.subMenu}>
                            <ShieldCheckIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Privacy Policy</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { navigation.navigate("ProfileDeleteAccount") }}>
                        <View style={styles.subMenu}>
                            <TrashIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Delete Account</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={logout}>
                        <View style={styles.subMenu}>
                            <LogoutIcon />
                            <Text style={[GlobalStyles.subTitle, { color: GoDeliveryColors.disabled }]}>Logout</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Modal
                isVisible={isModalVisible}
                onSwipeComplete={() => setModalVisible(false)}
                onBackdropPress={() => { setModalVisible(false) }}
                swipeDirection={['down']}
                propagateSwipe={true}
                style={styles.modalContainer}>
                <View style={styles.modalContentContainer}>
                    {modalActivitiIndicator && (
                        <ActivityIndicator
                            size="large"
                            style={{
                                position: 'absolute',
                                left: '50%',
                                top: '50%',
                            }}
                        />
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingHorizontal: 40,
                        }}>
                        <TouchableOpacity
                            style={styles.modalButtonBack}
                            onPress={onImageLibraryPress}>
                            <ImageIcon />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButtonBack}
                            onPress={onCameraPress}>
                            <CameraIconWhite />
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    avatarArea: {
        paddingTop: 30,
        paddingBottom: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarImg: {
        width: 120,
        height: 120,
        borderRadius: 200,
    },
    modalContainer: {
        justifyContent: 'flex-end',
        margin: 0,
    },
    modalContentContainer: {
        backgroundColor: GoDeliveryColors.white,
        paddingVertical: 30,
        paddingHorizontal: 20,
        height: 150,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    modalButtonBack: {
        backgroundColor: GoDeliveryColors.primary,
        padding: 10,
        borderRadius: 100,
    },
    subMenuContainer: {
        marginTop: 10,
        borderTopWidth: 0.25,
        borderTopColor: GoDeliveryColors.dividerColor,
    },
    subMenu: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingLeft: 30,
        gap: 20,
        paddingVertical: 10,
        borderBottomWidth: 0.25,
        borderColor: GoDeliveryColors.dividerColor
    }
});

export default ProfileHome;