import React, { useState } from 'react';
import GlobalStyles from '../../styles/style';
import { StyleSheet, TouchableOpacity, View, Text, ScrollView, Platform } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../../styles/colors';
import MenuButton from '../../components/MenuButton';
import { Switch } from 'react-native-switch';

interface ScreenProps {
    navigation: any;
}

const HomeScreen = ({ navigation }: ScreenProps): JSX.Element => {
    const [deliverymanStatus, setDeliverymanStatus] = useState(false);

    const handleNewOrder = () => {
        navigation.navigate('NewOrderCreate');
    }
    return (
        <View style={[GlobalStyles.container]}>
            <MenuButton navigation={navigation} />
            <View style={styles.headerSection}>
                <Text style={styles.headerTitle} >My Total Orders XX</Text>
                <Text style={styles.headerTitle} >My rate XX</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={styles.headerTitle}>Status</Text>
                    <Switch
                        value={deliverymanStatus}
                        onValueChange={(val) => setDeliverymanStatus(val)}
                        activeText={'work'}
                        inActiveText={'free'}
                        circleSize={30}
                        barHeight={35}
                        circleBorderWidth={0}
                        backgroundActive={GoDeliveryColors.disabled}
                        backgroundInactive={GoDeliveryColors.disabled}
                        circleActiveColor={GoDeliveryColors.primary}
                        circleInActiveColor={GoDeliveryColors.green}
                        // renderInsideCircle={() => <CustomComponent />} // custom component to render inside the Switch circle (Text, Image, etc.)
                        changeValueImmediately={true} // if rendering inside circle, change state immediately or wait for animation to complete
                        innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                        renderActiveText={true}
                        renderInActiveText={true}
                        switchLeftPx={5} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                        switchRightPx={5} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                        switchWidthMultiplier={2.8} // multiplied by the `circleSize` prop to calculate total width of the Switch
                        switchBorderRadius={30} // Sets the border Radius of the switch slider. If unset, it remains the circleSize.
                    />
                </View>
            </View>
            <ScrollView style={{ padding: 10, marginBottom: 20 }}>
                <TouchableOpacity >
                    <View style={styles.dataCard}>
                        <Text style={[GlobalStyles.textDisable]}>Order No 123456789</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={[GlobalStyles.textBold, { fontSize: 18, fontWeight: 'bold' }]}>15039287830</Text>
                            <Text style={[GlobalStyles.textBold]}>Jean Martin</Text>
                        </View>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            6, Biskupia, Ostrów Tumski, Osiedle Stare Miasto, Wrocław, województwo dolnośląskie, 50-148, Polska
                        </Text>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            80, Podwale, Trójkąt, Przedmieście Oławskie, Osiedle Przedmieście Oławskie, Wrocław, województwo dolnośląskie, 50-449, Polska
                        </Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={[GlobalStyles.primaryLabel, { fontSize: 14, fontWeight: 'bold' }]}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity >
                    <View style={styles.dataCard}>
                        <Text style={[GlobalStyles.textDisable]}>Order No 123456789</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={[GlobalStyles.textBold, { fontSize: 18, fontWeight: 'bold' }]}>15039287830</Text>
                            <Text style={[GlobalStyles.textBold]}>Jean Martin</Text>
                        </View>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            6, Biskupia, Ostrów Tumski, Osiedle Stare Miasto, Wrocław, województwo dolnośląskie, 50-148, Polska
                        </Text>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            80, Podwale, Trójkąt, Przedmieście Oławskie, Osiedle Przedmieście Oławskie, Wrocław, województwo dolnośląskie, 50-449, Polska
                        </Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={[GlobalStyles.primaryLabel, { fontSize: 14, fontWeight: 'bold' }]}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity >
                    <View style={styles.dataCard}>
                        <Text style={[GlobalStyles.textDisable]}>Order No 123456789</Text>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <Text style={[GlobalStyles.textBold, { fontSize: 18, fontWeight: 'bold' }]}>15039287830</Text>
                            <Text style={[GlobalStyles.textBold]}>Jean Martin</Text>
                        </View>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            6, Biskupia, Ostrów Tumski, Osiedle Stare Miasto, Wrocław, województwo dolnośląskie, 50-148, Polska
                        </Text>
                        <Text style={GlobalStyles.textDisable} numberOfLines={2} ellipsizeMode="tail" >
                            80, Podwale, Trójkąt, Przedmieście Oławskie, Osiedle Przedmieście Oławskie, Wrocław, województwo dolnośląskie, 50-449, Polska
                        </Text>
                        <TouchableOpacity style={styles.acceptBtn}>
                            <Text style={[GlobalStyles.primaryLabel, { fontSize: 14, fontWeight: 'bold' }]}>ACCEPT</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View >
    )
}

const styles = StyleSheet.create({
    headerSection: {
        height: 150,
        marginTop: 70,
        padding: 20,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: GoDeliveryColors.primary,
    },
    dataCard: {
        flex: 1,
        marginVertical: 10,
        marginHorizontal: 10,
        padding: 20,
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        backgroundColor: GoDeliveryColors.white,
        height: 200,
        borderRadius: 10,
        ...Platform.select({
            ios: {
                shadowColor: GoDeliveryColors.secondary,
                shadowOffset: {
                    width: 0,
                    height: 8,
                },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
            },
            android: {
                elevation: 8,
                shadowColor: GoDeliveryColors.secondary
            },
        }),
    },
    acceptBtn: {
        backgroundColor: GoDeliveryColors.primary,
        width: 100,
        paddingVertical: 5,
        alignItems: 'center',
        borderRadius: 30,
    },
});

export default HomeScreen;