import React, { useState } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { TabView, TabBar, SceneRendererProps, NavigationState } from 'react-native-tab-view';

import GlobalStyles from '../../styles/style';
import HeaderBar from '../../components/HeaderBar';
import GoDeliveryColors from '../../styles/colors';
import { LocationInfoType, ScreenProps } from '../../type';
import FromLocationTab from './FromLocationTab';
import ToLocationTab from './ToLocationTab';
import ConfirmTab from './ConfirmTab';

const NewOrderCreate = ({ navigation }: ScreenProps): JSX.Element => {
    const [index, setIndex] = useState(0);
    const [fromLocation, setFromLocation] = useState({
        location: {
            latitude: 0,
            longitude: 0,
        },
        displayName: ''
    });
    const [toLocation, setToLocation] = useState({
        location: {
            latitude: 0,
            longitude: 0,
        },
        displayName: ''
    });
    const [routes] = useState([
        { key: 'step1', title: 'step1' },
        { key: 'step2', title: 'step2' },
        { key: 'step3', title: 'step3' },
    ]);

    const handleNext = (position: LocationInfoType) => {
        console.log('received position =========> ', position);
        switch (index) {
            case 0:
                setIndex(1);
                setFromLocation(position);
                return;
            case 1:
                setIndex(2);
                setToLocation(position);
                return;
        }
    }

    const handleBack = () => {
        switch (index) {
            case 0:
                return;
            case 1:
                setIndex(0);
                return;
            case 2:
                setIndex(1);
                return;
        }
    }

    const renderScene = ((props: { route: { key: any; }; }) => {
        switch (props.route.key) {
            case "step1":
                return <FromLocationTab handleNext={handleNext} handleBack={handleBack} />
            case "step2":
                return <ToLocationTab handleNext={handleNext} handleBack={handleBack} />
            case "step3":
                return <ConfirmTab handleNext={handleNext} fromLocation={fromLocation} toLocation={toLocation} navigation={navigation} handleBack={handleBack} />
            default:
                return <FromLocationTab handleNext={handleNext} />
        }
    });

    const renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<any> }) => (
        <TabBar
            {...props}
            activeColor={GoDeliveryColors.primary}
            inactiveColor={GoDeliveryColors.disabled}
            indicatorStyle={{ backgroundColor: GoDeliveryColors.primary, }}
            style={{ backgroundColor: GoDeliveryColors.background, height: 2, }}
        />
    );

    return (
        <View style={[GlobalStyles.container]}>
            <HeaderBar navigation={navigation} title={'New Order'} />
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={setIndex}
                renderTabBar={renderTabBar}
                initialLayout={{ width: Dimensions.get('screen').width }}
            />
        </View>
    )
}

const styles = StyleSheet.create({

})

export default NewOrderCreate;