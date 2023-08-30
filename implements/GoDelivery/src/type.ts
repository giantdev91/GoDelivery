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

export type ResetPasswordParam = {
    phone: string,
    password: string,
}

export type GetByIdParam = {
    id: string,
}

export type UpdateFcmTokenParam = {
    clientID: string,
    fcmToken: string,
}

export type InProgressParam = {
    sender: number,
    receiver: string,
}

export type OrderUpdateParam = {
    orderID: number,
}

export type LeaveFeedbackParam = {
    orderID: string,
    rate: number,
    feedbackTitle: string,
    feedbackContent: string,
}

export type CancelOrderParam = {
    orderID: string,
    cancelReason: string,
    by: number,
    deliverymanID: string
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
    handleNext: (
        markers: any[],
        fromStr: string,
        toStr: string,
        estimationTime: string,
        distance: string,
    ) => void;
    handleBack?: () => void;
    fromLocation?: LocationInfoType,
    toLocation?: LocationInfoType,
    navigation?: any,
}