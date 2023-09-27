import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrderHistory from '../screens/Orders/OrderHistory';
import OrderDetail from '../screens/Orders/OrderDetail';

const Stack = createNativeStackNavigator();

const OrderHistoryNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="OrderHistoryHome" component={OrderHistory} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
        </Stack.Navigator>
    )
}

export default OrderHistoryNavigator;