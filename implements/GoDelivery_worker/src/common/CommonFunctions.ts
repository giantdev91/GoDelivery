const EARTH_RADIUS = 6371; // Earth's radius in kilometers

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

const calculateDeliveryTime = (pickupTime: string, dropoffTime: string) => {
    if (!pickupTime || !dropoffTime) {
        return '';
    }
    // Define the two date-time values
    const startDate = new Date(pickupTime);
    const endDate = new Date(dropoffTime);

    // Calculate the time difference in milliseconds
    const timeDifference = endDate - startDate;

    // Calculate the duration components
    const millisecondsInMinute = 1000 * 60;
    const minutes = Math.floor(timeDifference / millisecondsInMinute);

    // Output the duration
    return `${minutes} min`;
}

function formatDateToString(date: Date) {
    // Get the day, month, and time components
    const day = date.getDate();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const month = monthNames[date.getMonth()];
    const hours = date.getHours();
    const minutes = date.getMinutes();

    // Determine the ordinal suffix for the day (e.g., "st" for 1st, "nd" for 2nd, etc.)
    let daySuffix;
    if (day === 1 || day === 21 || day === 31) {
        daySuffix = 'st';
    } else if (day === 2 || day === 22) {
        daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
        daySuffix = 'rd';
    } else {
        daySuffix = 'th';
    }

    // Convert hours to 12-hour format and determine AM/PM
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;

    // Pad the minutes with leading zeros if needed
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Create the formatted string
    const formattedString = `${day}${daySuffix} ${month} ${formattedHours}:${formattedMinutes} ${amPm}`;

    return formattedString;
}

export default {
    calculateBounds,
    renderStatusLabel,
    formatDate,
    calculateDeliveryTime,
    formatDateToString
}