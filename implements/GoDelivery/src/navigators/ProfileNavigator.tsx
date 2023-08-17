import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '../screens/settings/Profile';

const Stack = createNativeStackNavigator();

const ProfileNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="profileHome" component={ProfileScreen} />
            <Stack.Screen name="changeLanguage" component={ProfileScreen} />
            <Stack.Screen name="myLocation" component={ProfileScreen} />
        </Stack.Navigator>
    )
}