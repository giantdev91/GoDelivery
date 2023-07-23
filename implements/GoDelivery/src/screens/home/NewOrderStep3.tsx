import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image, ScrollView } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';

import { RadioButton } from 'react-native-paper';
import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import CustomizedInput from '../../components/CustomizedInput';
import PrimaryButton from '../../components/PrimaryButton';
import GoDeliveryColors from '../../styles/colors';

interface ScreenProps {
    navigation: any;
}

const NewOrderStep3 = ({ navigation }: ScreenProps): JSX.Element => {

    const handleSubmit = () => {
        navigation.navigate('NewOrderComplete');
    }

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'New Order'} />
            <Text style={GlobalStyles.subTitleText}>Confirmation</Text>
            <ScrollView>
                <View style={styles.formArea}>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='locate-outline' placeHolder='Location Area' keyboardType='number' />
                            </View>
                            <View style={[{ width: '10%', padding: 5, alignItems: 'center', justifyContent: 'center' }]}>
                                <TouchableOpacity>
                                    <Icons name='bookmark-outline' size={20} color={GoDeliveryColors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='compass-outline' placeHolder='location reference building' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='person-outline' placeHolder='Please select receiver' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='locate-outline' placeHolder='Location Area' keyboardType='number' />
                            </View>
                            <View style={[{ width: '10%', padding: 5, alignItems: 'center', justifyContent: 'center' }]}>
                                <TouchableOpacity>
                                    <Icons name='bookmark-outline' size={20} color={GoDeliveryColors.primary} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='compass-outline' placeHolder='location reference building' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='time-outline' placeHolder='expectation time' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='speedometer-outline' placeHolder='volumn' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View>
                        <View style={[{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
                            <View style={{ width: '90%', }}>
                                <CustomizedInput icon='speedometer-outline' placeHolder='weight' keyboardType='number' />
                            </View>
                        </View>
                        <View style={styles.textFieldErrorMsgArea}>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                        <View style={{ backgroundColor: GoDeliveryColors.disabled, width: 15, height: 15, borderRadius: 50, }}></View>
                        <View style={{ backgroundColor: GoDeliveryColors.disabled, width: 15, height: 15, borderRadius: 50, }}></View>
                        <View style={{ backgroundColor: GoDeliveryColors.primary, width: 15, height: 15, borderRadius: 50, }}></View>
                    </View>
                    <PrimaryButton buttonText='Submit' handler={handleSubmit} />
                </View>
            </ScrollView>

        </View>
    )
}

const styles = StyleSheet.create({
    labelText: {
        fontSize: 17,
        fontWeight: "600",
        color: GoDeliveryColors.secondary,
    },
    formArea: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    textFieldErrorMsgArea: {
        height: 25,
        paddingLeft: 20,
    },
})

export default NewOrderStep3;