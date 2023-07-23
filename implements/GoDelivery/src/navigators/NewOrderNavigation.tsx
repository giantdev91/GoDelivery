import { createNativeStackNavigator } from '@react-navigation/native-stack';
import InProgressScreen from '../screens/home/InProgress';
import InprogressOrderDetailScreen from '../screens/home/InProgressOrderDetail';
import HomeScreen from '../screens/home/Home';
import NewOrderStep1 from '../screens/home/NewOrderStep1';
import NewOrderStep2 from '../screens/home/NewOrderStep2';
import NewOrderStep3 from '../screens/home/NewOrderStep3';
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
            <Stack.Screen name="NewOrderStep1" component={NewOrderStep1} />
            <Stack.Screen name="NewOrderStep2" component={NewOrderStep2} />
            <Stack.Screen name="NewOrderStep3" component={NewOrderStep3} />
            <Stack.Screen name="NewOrderComplete" component={NewOrderComplete} />
        </Stack.Navigator>
    );
};

export default NewOrderNavigator;