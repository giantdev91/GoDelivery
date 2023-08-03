const radiusKm = 30; // Radius in kilometers

function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers

    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distance = R * c; // Distance in kilometers

    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI / 180);
}

exports.filterPeopleByRadius = (people, specialLocation) => {
    const { specialLat, specialLon } = specialLocation;
    return people.filter((person) => {
        const distance = haversineDistance(
            person.locationLatitude,
            person.locationLongitude,
            specialLat,
            specialLon
        );

        return distance <= radiusKm;
    });
}