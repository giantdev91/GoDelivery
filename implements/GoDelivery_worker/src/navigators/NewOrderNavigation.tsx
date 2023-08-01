import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InProgressScreen from '../screens/home/InProgress';
import InprogressOrderDetailScreen from '../screens/home/InProgressOrderDetail';
import HomeScreen from '../screens/home/Home';
import NewOrderCreate from '../screens/home/NewOrderCreate';
import NewOrderComplete from '../screens/home/NewOrderComplete';


const Stack = createNativeStackNavigator();

const NewOrderNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="NewOrderHome" component={HomeScreen} />
            <Stack.Screen name="NewOrderCreate" component={NewOrderCreate} />
            <Stack.Screen name="NewOrderComplete" component={NewOrderComplete} />
        </Stack.Navigator>
    );
};

export default NewOrderNavigator;