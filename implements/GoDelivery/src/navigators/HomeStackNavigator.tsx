import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileHome from "../screens/profile/ProfileHome";
import ProfileSelectLanguage from '../screens/profile/ProfileSelectLanguage';
import ProfileChangePassword from '../screens/profile/ProfileChangePassword';
import ProfileEdit from '../screens/profile/ProfileEdit';
import ProfileDeleteAccount from '../screens/profile/ProfileDeleteAccount';
import InProgress from '../screens/Orders/InProgress';
import OrderDetail from '../screens/Orders/OrderDetail';
import LiveTracking from '../screens/Orders/LiveTracking';
import Payment from '../screens/Orders/Payment';
import OrderHistory from '../screens/Orders/OrderHistory';
import FromLocationScreen from '../screens/home/neworder/FromLocation';
import ToLocationScreen from '../screens/home/neworder/ToLocation';
import NewOrderComplete from '../screens/home/neworder/NewOrderComplete';
import NotificationsScreen from '../screens/home/Notifications';
import LocationSearch from '../screens/home/neworder/LocationSearch';
import DeliveryDetail from '../screens/home/neworder/DeliveryDetail';
import WeightOption from '../screens/home/neworder/WeightOption';
import GoodsTypeOption from '../screens/home/neworder/GoodsTypeOption';
import VolumeOption from '../screens/home/neworder/VolumeOption';
import DeliveryConfirmation from '../screens/home/neworder/DeliveryConfirmation';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = (): JSX.Element => (
    <Stack.Navigator screenOptions={{
        headerShown: false,
    }}>
        <Stack.Screen name="MainTab" component={TabNavigator} />
        {/* new order navigations start */}
        <Stack.Screen name="FromLocation" component={FromLocationScreen} />
        <Stack.Screen name="ToLocation" component={ToLocationScreen} />
        <Stack.Screen name="DeliveryDetail" component={DeliveryDetail} />
        <Stack.Screen name="WeightOption" component={WeightOption} />
        <Stack.Screen name="GoodsTypeOption" component={GoodsTypeOption} />
        <Stack.Screen name="VolumeOption" component={VolumeOption} />
        <Stack.Screen name="DeliveryConfirmation" component={DeliveryConfirmation} />
        <Stack.Screen name="OrderComplete" component={NewOrderComplete} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="LocationSearch" component={LocationSearch} />
        {/* new order navigations end */}

        {/* In progress order navigations start */}
        <Stack.Screen name="InProgressHome" component={InProgress} />
        <Stack.Screen name="InProgressOrderDetail" component={OrderDetail} />
        <Stack.Screen name="LiveTracking" component={LiveTracking} />
        <Stack.Screen name="Payment" component={Payment} />
        {/* In progress order navigations end */}

        {/* order history navigations start */}
        <Stack.Screen name="OrderHistoryHome" component={OrderHistory} />
        <Stack.Screen name="OrderDetail" component={OrderDetail} />
        {/* order history navigations end */}

        {/* profile navigations start */}
        <Stack.Screen name="ProfileMenu" component={ProfileHome} />
        <Stack.Screen name="ProfileSelectLanguage" component={ProfileSelectLanguage} />
        <Stack.Screen name="ProfileChangePassword" component={ProfileChangePassword} />
        <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
        <Stack.Screen name="ProfileDeleteAccount" component={ProfileDeleteAccount} />
        {/* profile navigations end */}
    </Stack.Navigator>
)

export default HomeStackNavigator;