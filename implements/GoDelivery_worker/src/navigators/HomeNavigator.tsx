import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/Home';
import OrderValidate from '../screens/home/OrderValidate';

const Stack = createNativeStackNavigator();

const OrderStatusNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}>
            <Stack.Screen name="OrderHome" component={HomeScreen} />
            <Stack.Screen name="OrderValidate" component={OrderValidate} />
        </Stack.Navigator>
    );
};

export default OrderStatusNavigator;
