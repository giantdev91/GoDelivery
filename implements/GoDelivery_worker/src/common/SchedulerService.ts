import BackgroundActions from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import Action from '../service';
import store from '../redux/store';
import { UPDATE_INTERVAL } from './Constant';
import { requestLocationPermission } from './RequestPermission';

const backgroundOptions = {
    taskName: 'MyBackgroundTask', // A unique name for your background task.
    taskTitle: 'My Background Task Title', // A title shown in the notification (optional).
    taskDesc: 'My Background Task Description', // A description shown in the notification (optional).
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    }, // The icon to be shown in the notification (optional).
    color: '#ff00ff', // The background color of the notification (optional).
    linkingURI: 'example://', // The URI to open when the user taps the notification (optional).
};

const updateCurrentLocation = () => {

    Geolocation.getCurrentPosition(
        position => {
            const crd = position.coords;
            const locationLatitude = crd.latitude.toString();
            const locationLongitude = crd.longitude.toString();
            const deliverymanID = store.getState().CurrentUser.user.id;

            Action.deliveryman.updateLocation({
                deliverymanID: deliverymanID,
                locationLatitude: locationLatitude,
                locationLongitude: locationLongitude,
            }).then((res) => {
                const response = res.data;
            }).catch((err) => {
                console.error('error: 5', err);
            })
        },
        error => {
            // See error code charts below.
            console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 5000 },
    );


}

const myBackgroundTask = async () => {
    setInterval(() => {
        const result = requestLocationPermission();
        result.then(res => {
            updateCurrentLocation();
        })
    }, UPDATE_INTERVAL);
};

export const startBackgroundServiceScheduler = () => {
    BackgroundActions.start(myBackgroundTask, backgroundOptions);
}