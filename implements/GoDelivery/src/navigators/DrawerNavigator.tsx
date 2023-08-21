import { createDrawerNavigator } from '@react-navigation/drawer';

import TabNavigator from './TabNavigator';
import GoDeliveryColors from '../styles/colors';
import DrawerMenu from '../components/DrawerMenu';
import ProfileHomeScreen from '../screens/settings/ProfileHome';
import ProfileScreen from '../screens/settings/Profile'
import SelectLanguageScreen from '../screens/settings/SelectLanguage';
import LocationsScreen from '../screens/settings/Locations'
import TracksScreen from '../screens/settings/Tracks'
import PriceEstimate from '../screens/settings/PriceEstimate';

const Drawer = createDrawerNavigator();

function DrawerNavigator(): JSX.Element {
    return (
        <Drawer.Navigator
            screenOptions={{
                headerShown: false,
                drawerStyle: {
                    width: '80%',
                    backgroundColor: GoDeliveryColors.primary
                },
                drawerActiveTintColor: GoDeliveryColors.green,
                drawerInactiveTintColor: GoDeliveryColors.white
            }}
            drawerContent={props => <DrawerMenu {...props} />}
        >
            <Drawer.Screen name="Home" component={TabNavigator} />
            <Drawer.Screen name="ProfileHome" component={ProfileHomeScreen} />
            <Drawer.Screen name="MyProfile" component={ProfileScreen} />
            <Drawer.Screen name="SelectLanguage" component={SelectLanguageScreen} />
            <Drawer.Screen name="myLocation" component={ProfileScreen} />
            <Drawer.Screen name="Locations" component={LocationsScreen} />
            <Drawer.Screen name="Tracks" component={TracksScreen} />
            <Drawer.Screen name="PriceEstimate" component={PriceEstimate} />
        </Drawer.Navigator>
    )
}

export default DrawerNavigator;