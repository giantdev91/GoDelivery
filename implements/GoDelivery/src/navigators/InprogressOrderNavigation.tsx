import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InProgress from '../screens/Orders/InProgress';
import OrderDetail from '../screens/Orders/OrderDetail';
import LiveTracking from '../screens/Orders/LiveTracking';


const Stack = createNativeStackNavigator();

const InprogressOrderNavigator = (): JSX.Element => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
        }}
    >
        <Stack.Screen name="InProgressHome" component={InProgress} />
        <Stack.Screen name="InProgressOrderDetail" component={OrderDetail} />
        <Stack.Screen name="LiveTracking" component={LiveTracking} />
    </Stack.Navigator>
);

export default InprogressOrderNavigator;