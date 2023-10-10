import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Text, TextInput } from 'react-native';
import GlobalStyles from '../../styles/style';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import GoDeliveryColors from '../../styles/colors';
import Modal from 'react-native-modal';
import { ActivityIndicator } from 'react-native';
import storage from '@react-native-firebase/storage'; // Import the firestore module
import store from '../../redux/store';
import { useFocusEffect } from '@react-navigation/native';
import Action from '../../service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import allActions from '../../redux/actions';
import { useDispatch } from 'react-redux';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { BackIcon, CameraIcon, CameraIconWhite, ConfirmCheckIcon, ImageIcon, PasswordIcon, PhoneIcon, UserIcon, WarningIcon } from '../../common/Icons';

interface ScreenProps {
    navigation: any;
}

const ProfileEdit = ({ navigation }: ScreenProps): JSX.Element => {
    var currentUser = store.getState().CurrentUser.user;
    const [userData, setUserData] = useState({});
    const [avatarUri, setAvatarUri] = useState(currentUser.avatar);
    const [phone, setPhone] = useState(currentUser.phone.slice(3));
    const [phoneError, setPhoneError] = useState('');
    const [username, setUsername] = useState(currentUser.name);
    const [usernameError, setUsernameError] = useState('');
    const [password, setPassword] = useState('');
    const [modalActivitiIndicator, setModalActivityIndicator] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [activiIndicator, setActivityIndicator] = useState(false);

    const dispatch = useDispatch();

    const storeData = async (userData: any) => {
        try {
            await AsyncStorage.setItem('USER_DATA', JSON.stringify(userData));
        } catch {
            console.log('error occured!');
        }
    }

    const validateForm = () => {
        var validFlag = true;
        if (phone.length != 9) {
            setPhoneError('Please insert valid phone number.');
            validFlag = false;
        } else {
            const prefix = Number.parseInt(phone.substring(0, 2));
            if (prefix > 81 && prefix < 88) {
                setPhoneError('');
            } else {
                validFlag = false;
                setPhoneError('Please insert valid phone number.');
            }
        }
        if (!username) {
            setUsernameError('Please insert user name.');
            validFlag = false;
        } else {
            setUsernameError('');
        }
        return validFlag;
    }

    const handleSubmit = () => {
        if (validateForm()) {
            setActivityIndicator(true);
            const param = {
                clientId: store.getState().CurrentUser.user.id
            }
            if (avatarUri) {
                param.avatar = avatarUri;
            }
            if (phone) {
                param.phone = `258${phone}`;
            }
            if (username) {
                param.name = username;
            }
            if (password) {
                param.password = password;
            }

            Action.client.updateProfile(param)
                .then((res) => {
                    const response = res.data;
                    if (response.success) {
                        Dialog.show({
                            type: ALERT_TYPE.SUCCESS,
                            title: 'GoDelivery',
                            textBody: "Save success!",
                            button: 'close',
                        })
                        dispatch(allActions.UserAction.setUser(response.data));
                        storeData(response.data);
                    }
                    setActivityIndicator(false);
                }).catch((err) => {
                    console.log("error: ", err);
                    setActivityIndicator(false);
                });
        }
    }

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

    const handleBack = () => {
        navigation.goBack();
    }

    const handleConfirm = () => {
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'GoDelivery',
            textBody: 'Save success',
            button: 'close',
        })
    }

    useFocusEffect(
        useCallback(() => {
            currentUser = store.getState().CurrentUser.user;
            setUsername(currentUser.name);
            setPhone(currentUser.phone.slice(3));
        }, [])
    );

    return (
        <View style={[GlobalStyles.container]}>
            <AlertNotificationRoot>
                <View style={GlobalStyles.headerSection}>
                    <TouchableOpacity style={GlobalStyles.headerBackButton} onPress={handleBack}>
                        <BackIcon />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Edit Profile</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleSubmit}>
                        <ConfirmCheckIcon />
                    </TouchableOpacity>
                </View>
                <ScrollView >
                    <View style={styles.avatarArea}>
                        <View style={{ width: 120, height: 120 }}>
                            {
                                !avatarUri && (<Image source={require('../../../assets/images/user_default_avatar.png')} style={styles.avatarImg} />)
                            }
                            {
                                avatarUri && (<Image source={{ uri: avatarUri }} style={styles.avatarImg} />)
                            }
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(true);
                                }}
                                style={{
                                    backgroundColor: GoDeliveryColors.place,
                                    padding: 10,
                                    borderRadius: 100,
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                }}>
                                <CameraIcon />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profileFormArea}>
                        <View style={{ marginTop: 20 }}>

                            <View style={[styles.inputContainer, { zIndex: 3 }]}>
                                <View style={GlobalStyles.iconBack}>
                                    <UserIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Full Name</Text>
                                    <TextInput
                                        value={username}
                                        placeholder='Ex: Jose Manuel'
                                        style={GlobalStyles.textInput}
                                        placeholderTextColor={GoDeliveryColors.placeHolder}
                                        onChangeText={setUsername} />
                                </View>
                                {usernameError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                    <WarningIcon />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{usernameError}</Text></View>
                                </View>)}
                            </View>

                            <View style={[styles.inputContainer, { zIndex: 2 }]}>
                                <View style={GlobalStyles.iconBack}>
                                    <PhoneIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Phone Number</Text>
                                    <TextInput
                                        value={phone}
                                        placeholder='82 12 34 567'
                                        style={GlobalStyles.textInput}
                                        onChangeText={setPhone}
                                        placeholderTextColor={GoDeliveryColors.placeHolder}
                                        keyboardType='number-pad' />
                                </View>
                                {phoneError && (<View style={[GlobalStyles.errorTooltip, { top: 0 }]}>
                                    <WarningIcon />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{phoneError}</Text></View>
                                </View>)}
                            </View>
                            <View style={[styles.inputContainer, { zIndex: 1 }]}>
                                <View style={GlobalStyles.iconBack}>
                                    <PasswordIcon />
                                </View>
                                <View>
                                    <Text style={[GlobalStyles.textBold, { color: GoDeliveryColors.disabled }]}>Password</Text>
                                    <TextInput
                                        value={password}
                                        placeholder='******'
                                        style={GlobalStyles.textInput}
                                        onChangeText={setPassword}
                                        placeholderTextColor={GoDeliveryColors.placeHolder}
                                        secureTextEntry={true} />
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </AlertNotificationRoot>
            {
                activiIndicator && <ActivityIndicator size="large" style={{ position: 'absolute', bottom: 150, alignSelf: 'center' }} />
            }
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
    profileFormArea: {
        paddingHorizontal: 30,
        flex: 1,
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
    inputContainer: {
        marginVertical: 5,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        gap: 10,
    },

});

export default ProfileEdit;