const EARTH_RADIUS = 6371; // Earth's radius in kilometers
import AsyncStorage from '@react-native-async-storage/async-storage';
import Action from '../service';

const calculateBounds = (latitude: number, longitude: number, radius: number) => {
    const radianLatitude = (latitude * Math.PI) / 180;
    const radianLongitude = (longitude * Math.PI) / 180;

    const latitudeDelta = (radius / EARTH_RADIUS) * (180 / Math.PI);
    const longitudeDelta = (radius / EARTH_RADIUS) * (180 / Math.PI) / Math.cos(radianLatitude);

    const maxLatitude = latitude + latitudeDelta;
    const minLatitude = latitude - latitudeDelta;
    const maxLongitude = longitude + longitudeDelta;
    const minLongitude = longitude - longitudeDelta;

    return {
        latitude: {
            max: maxLatitude,
            min: minLatitude,
        },
        longitude: {
            max: maxLongitude,
            min: minLongitude,
        },
    };
};

export default {
    calculateBounds,
}