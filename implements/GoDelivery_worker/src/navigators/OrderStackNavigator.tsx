import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import OrdersScreen from '../screens/home/Orders';
import OrderDetail from '../screens/home/OrderDetail';
import OrderValidate from '../screens/home/OrderValidate';
import Payment from '../screens/home/Payment';

const Stack = createNativeStackNavigator();

const OrderStackNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="OrdersHome" component={OrdersScreen} />
            <Stack.Screen name="OrderDetail" component={OrderDetail} />
            <Stack.Screen name="OrderValidate" component={OrderValidate} />
            <Stack.Screen name="Payment" component={Payment} />
        </Stack.Navigator>
    )
}

export default OrderStackNavigator;