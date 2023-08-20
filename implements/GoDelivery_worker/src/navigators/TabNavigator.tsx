import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import Orders from '../screens/home/Orders';
import HomeScreen from '../screens/home/Home';
import NotificationsScreen from '../screens/home/Notifications'
import GoDeliveryColors from '../styles/colors';
import OrderStatusNavigator from './HomeNavigator';

const Tab = createBottomTabNavigator();

function TabNavigator(): JSX.Element {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBarBackground,
            tabBarActiveTintColor: GoDeliveryColors.primary,
            tabBarInactiveTintColor: GoDeliveryColors.disabled
        }}>
            <Tab.Screen
                name="Main"
                component={OrderStatusNavigator}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icons
                            name="home-outline"
                            color={color}
                            size={30}
                            style={styles.bottomMenuIcon}
                        />
                    ),
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={{
                                color: color,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: "400"
                            }}>Home</Text>
                    )
                }}
            />
            <Tab.Screen
                name="Orders"
                component={Orders}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icons
                            name="bicycle-outline"
                            color={color}
                            size={34}
                            style={styles.bottomMenuIcon}
                        />
                    ),
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={{
                                color: color,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: "400"
                            }}>Orders</Text>
                    )
                }}
            />
            <Tab.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icons
                            name="notifications-outline"
                            color={color}
                            size={32}
                            style={styles.bottomMenuIcon}
                        />
                    ),
                    tabBarLabel: ({ focused, color }) => (
                        <Text
                            style={{
                                color: color,
                                marginBottom: 5,
                                fontSize: 14,
                                fontWeight: "400"
                            }}>Notification</Text>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarBackground: {
        backgroundColor: GoDeliveryColors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 75
    },
    bottomMenuIcon: {
        marginTop: 10,
    }
})

export default TabNavigator;