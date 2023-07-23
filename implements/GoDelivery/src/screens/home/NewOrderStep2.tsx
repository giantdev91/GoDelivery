import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Image } from 'react-native';
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

const NewOrderStep2 = ({ navigation }: ScreenProps): JSX.Element => {
    const [checked, setChecked] = React.useState('select');

    const handleNext = () => {
        navigation.navigate('NewOrderStep3');
    }

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'New Order'} />
            <Text style={GlobalStyles.subTitleText}>Pick Receiver’s Location</Text>

            <View style={styles.formArea}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                        value='select'
                        status={checked === 'select' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('select')}
                        color={GoDeliveryColors.primary}
                    />
                    <Text style={styles.labelText}>select in map</Text>
                </View>
                <View>
                    <Image source={require('../../../assets/images/map_sample.png')} style={{ width: '100%', height: 270, resizeMode: 'stretch' }} />
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <RadioButton
                        value='input'
                        status={checked === 'input' ? 'checked' : 'unchecked'}
                        onPress={() => setChecked('input')}
                        color={GoDeliveryColors.primary}
                    />
                    <Text style={styles.labelText}>input location</Text>
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
                <View style={{ flexDirection: 'row', width: 75, alignSelf: 'center', justifyContent: 'space-between', marginVertical: 10 }}>
                    <View style={{ backgroundColor: GoDeliveryColors.disabled, width: 15, height: 15, borderRadius: 50, }}></View>
                    <View style={{ backgroundColor: GoDeliveryColors.primary, width: 15, height: 15, borderRadius: 50, }}></View>
                    <View style={{ backgroundColor: GoDeliveryColors.disabled, width: 15, height: 15, borderRadius: 50, }}></View>
                </View>

                <PrimaryButton buttonText='Next' handler={handleNext} />
            </View>
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
    },
    textFieldErrorMsgArea: {
        height: 25,
        paddingLeft: 20,
    },
})

export default NewOrderStep2;