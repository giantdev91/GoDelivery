import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InProgressScreen from '../screens/home/InProgress';
import InprogressOrderDetailScreen from '../screens/home/InProgressOrderDetail';


const Stack = createNativeStackNavigator();

const InprogressOrderNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="InProgressHome" component={InProgressScreen} />
            <Stack.Screen name="InProgressDetail" component={InprogressOrderDetailScreen} />
        </Stack.Navigator>
    );
};

export default InprogressOrderNavigator;