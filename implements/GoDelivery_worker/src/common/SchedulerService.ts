import BackgroundActions from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import Action from '../service';
import store from '../redux/store';

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
                console.error('error: ', err);
            })
        });
}


const myBackgroundTask = async () => {
    setInterval(() => {
        updateCurrentLocation();
    }, 60000);
};

export const startBackgroundServiceScheduler = () => {
    BackgroundActions.start(myBackgroundTask, backgroundOptions);
}