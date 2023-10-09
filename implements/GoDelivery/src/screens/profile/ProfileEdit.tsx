import React, { useState, useCallback } from 'react';
import { StyleSheet, TouchableOpacity, View, Image, ScrollView, Text } from 'react-native';
import GlobalStyles from '../../styles/style';
import CustomizedInput from '../../components/CustomizedInput';
import PasswordInput from '../../components/PasswordInput';
import FeatherIcon from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
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
import CustomizedPhoneInput from '../../components/CustomizedPhoneInput';
import Icons from 'react-native-vector-icons/Ionicons';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';

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
                        <FontAwesome name="arrow-left-long" size={20} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                    <Text style={GlobalStyles.whiteHeaderTitle}>Change Password</Text>
                    <TouchableOpacity style={GlobalStyles.headerCheckButton} onPress={handleSubmit}>
                        <Icons name='checkmark-outline' size={30} color={GoDeliveryColors.secondary} />
                    </TouchableOpacity>
                </View>
                <ScrollView style={GlobalStyles.container}>
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
                                <FeatherIcon
                                    name="camera"
                                    size={25}
                                    style={{
                                        color: GoDeliveryColors.primary,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={styles.profileFormArea}>
                        <View style={{ marginTop: 20 }}>
                            <View style={[styles.inputContainer, { zIndex: 3 }]}>
                                <Text style={GlobalStyles.textDisable}>Full Name</Text>
                                <CustomizedInput icon='person-outline' placeHolder='Username' handler={setUsername} val={username} error={usernameError.length > 0} />
                                {usernameError && (<View style={GlobalStyles.errorTooltip}>
                                    <Icons name="alert-outline" size={20} color={GoDeliveryColors.white} style={GlobalStyles.errorIcon} />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{usernameError}</Text></View>
                                </View>)}
                            </View>

                            <View style={[styles.inputContainer, { zIndex: 2 }]}>
                                <Text style={GlobalStyles.textDisable}>Phone Number</Text>
                                <View
                                    style={{
                                        flexDirection: 'row',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <View style={{ flex: 1, }}>
                                        <CustomizedPhoneInput value={phone} handler={setPhone} placeholder='phone number' error={phoneError.length > 0} />
                                    </View>
                                </View>
                                {phoneError && (<View style={GlobalStyles.errorTooltip}>
                                    <Icons name="alert-outline" size={20} color={GoDeliveryColors.white} style={GlobalStyles.errorIcon} />
                                    <View style={GlobalStyles.errorMessageBack} ><Text style={{ color: GoDeliveryColors.white }}>{phoneError}</Text></View>
                                </View>)}
                            </View>
                            <View style={[styles.inputContainer, { zIndex: 1 }]}>
                                <Text style={GlobalStyles.textDisable}>Password</Text>
                                <PasswordInput handler={(val) => { setPassword(val) }} />
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
                            <FeatherIcon
                                name="image"
                                color={GoDeliveryColors.white}
                                size={30}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.modalButtonBack}
                            onPress={onCameraPress}>
                            <FeatherIcon
                                name="camera"
                                color={GoDeliveryColors.white}
                                size={30}
                            />
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
        marginVertical: 20,
    },

});

export default ProfileEdit;