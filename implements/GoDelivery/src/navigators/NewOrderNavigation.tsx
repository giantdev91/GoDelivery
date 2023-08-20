import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../screens/home/Home';
import LocationSet from '../screens/home/LocationSet';
import DetailInformation from '../screens/home/DetailInformation';
import DetailConfirmation from '../screens/home/DetailConfirmation';
import NewOrderComplete from '../screens/home/NewOrderComplete';

const Stack = createNativeStackNavigator();

const NewOrderNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="NewOrderHome" component={HomeScreen} />
      <Stack.Screen name="LocationSet" component={LocationSet} />
      <Stack.Screen name="DetailInformation" component={DetailInformation} />
      <Stack.Screen name="DetailConfirmation" component={DetailConfirmation} />
      <Stack.Screen name="OrderComplete" component={NewOrderComplete} />
    </Stack.Navigator>
  );
};

export default NewOrderNavigator;
