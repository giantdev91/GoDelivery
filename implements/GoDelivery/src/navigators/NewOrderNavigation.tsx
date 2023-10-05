import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator();

const NewOrderNavigator = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
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
    </Stack.Navigator>
  );
};

export default NewOrderNavigator;
