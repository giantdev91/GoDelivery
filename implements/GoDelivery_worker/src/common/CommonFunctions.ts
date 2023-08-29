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

const renderStatusLabel = (status: number) => {
    if (status == 0) {
        return "Delivery Created";
    }
    if (status == 1) {
        return "Delivery Assigned";
    }
    if (status == 2) {
        return "Delivery Processing";
    }
    if (status == 3) {
        return "Delivery Completed";
    }
    if (status == 4) {
        return "Delivery Canceled";
    }
}

function getDaySuffix(day: number) {
    if (day === 1 || day === 21 || day === 31) {
        return 'st';
    } else if (day === 2 || day === 22) {
        return 'nd';
    } else if (day === 3 || day === 23) {
        return 'rd';
    } else {
        return 'th';
    }
}

const formatDate = (dateObj: Date) => {
    const day = dateObj.getDate();
    const month = dateObj.toLocaleDateString('en-US', { month: 'long' });
    const year = dateObj.getFullYear();
    const formattedDate = `${day}${getDaySuffix(day)} ${month} ${year}`;
    return formattedDate;
}


export default {
    calculateBounds,
    renderStatusLabel,
    formatDate
}