import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import NotificationsScreen from '../screens/home/Notifications'
import GoDeliveryColors from '../styles/colors';
import ProfileStackNavigator from './ProfileStackNavigator';
import OrderStackNavigator from './OrderStackNavigator';
import HomeScreen from '../screens/home/Home';

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
                name="Home"
                component={HomeScreen}
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
                                fontSize: 12,
                                fontWeight: "400"
                            }}>Home</Text>
                    )
                }}
            />
            <Tab.Screen
                name="Orders"
                component={OrderStackNavigator}
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
                                fontSize: 12,
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
                                fontSize: 12,
                                fontWeight: "400"
                            }}>Notification</Text>
                    )
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileStackNavigator}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icons
                            name="person-outline"
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
                                fontSize: 12,
                                fontWeight: "400"
                            }}>Profile</Text>
                    )
                }}
            />
        </Tab.Navigator>
    )
}

const styles = StyleSheet.create({
    tabBarBackground: {
        backgroundColor: GoDeliveryColors.white,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
        height: 75
    },
    bottomMenuIcon: {
        marginTop: 10,
    }
})

export default TabNavigator;