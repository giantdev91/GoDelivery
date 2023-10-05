import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileHome from "../screens/profile/ProfileHome";
import ProfileSelectLanguage from '../screens/profile/ProfileSelectLanguage';
import ProfileChangePassword from '../screens/profile/ProfileChangePassword';
import ProfileEdit from '../screens/profile/ProfileEdit';
import ProfileDeleteAccount from '../screens/profile/ProfileDeleteAccount';

const Stack = createNativeStackNavigator();

const ProfileStackNavigator = (): JSX.Element => {
    return (
        <Stack.Navigator screenOptions={{
            headerShown: false,
        }}>
            <Stack.Screen name="ProfileMenu" component={ProfileHome} />
            <Stack.Screen name="ProfileSelectLanguage" component={ProfileSelectLanguage} />
            <Stack.Screen name="ProfileChangePassword" component={ProfileChangePassword} />
            <Stack.Screen name="ProfileEdit" component={ProfileEdit} />
            <Stack.Screen name="ProfileDeleteAccount" component={ProfileDeleteAccount} />
        </Stack.Navigator>
    )
}

export default ProfileStackNavigator;