export type LoginParam = {
    phone: string,
    password: string
}

export type SignupParam = {
    phone: string,
    password: string,
    name: string,
}

export type PhoneCheckParam = {
    phone: string
}

export type GetByIdParam = {
    id: string,
}

export type GeoCoordinates = {
    latitude: number,
    longitude: number,
}

export type LocationInfoType = {
    location: GeoCoordinates,
    displayName: string,
}

export type ScreenProps = {
    navigation: any;
}

export type TabSceneProps = {
    handleNext: (position: LocationInfoType) => void;
    handleBack?: () => void;
    fromLocation?: LocationInfoType,
    toLocation?: LocationInfoType,
    navigation?: any,
}