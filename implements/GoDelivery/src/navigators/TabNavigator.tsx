import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, Text } from 'react-native';
import Icons from 'react-native-vector-icons/Ionicons';
import GoDeliveryColors from '../styles/colors';

import FromLocationScreen from '../screens/home/neworder/FromLocation';
import InProgress from '../screens/Orders/InProgress';
import OrderHistory from '../screens/Orders/OrderHistory';
import ProfileHome from '../screens/profile/ProfileHome';

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
                component={FromLocationScreen}
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
                name="InProgress"
                component={InProgress}
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
                            }}>In Progress</Text>
                    )
                }}
            />
            <Tab.Screen
                name="OrderHistory"
                component={OrderHistory}
                options={{
                    tabBarIcon: ({ focused, color, size }) => (
                        <Icons
                            name="cart-outline"
                            color={color}
                            size={33}
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
                            }}>Order</Text>
                    )
                }}
            />
            <Tab.Screen
                name="ProfileHome"
                component={ProfileHome}
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
        height: 65
    },
    bottomMenuIcon: {
        marginTop: 10,
    }
})

export default TabNavigator;