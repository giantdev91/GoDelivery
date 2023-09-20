import BackgroundActions from 'react-native-background-actions';
import Geolocation from 'react-native-geolocation-service';
import Action from '../service';
import store from '../redux/store';
import { UPDATE_INTERVAL } from './Constant';
import { requestLocationPermission } from './RequestPermission';

const backgroundOptions = {
    taskName: 'GoDelivery location show', // A unique name for your background task.
    taskTitle: 'Location Synchronize', // A title shown in the notification (optional).
    taskDesc: 'Reporting your location to the server.', // A description shown in the notification (optional).
    taskIcon: {
        name: 'ic_launcher',
        type: 'mipmap',
    }, // The icon to be shown in the notification (optional).
    color: '#ff0000', // The background color of the notification (optional).
    linkingURI: 'example://', // The URI to open when the user taps the notification (optional).
};

const sleep = (time: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), time));

const locationSynchronizeTask = async () => {
    Geolocation.watchPosition(
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
                console.log("update location response: ", response);
            }).catch((err) => {
                console.error('error: ', err);
            })
        },
        error => {
            console.log(error.code, error.message);
            BackgroundActions.stop();
        },
        { enableHighAccuracy: true, showsBackgroundLocationIndicator: true, fastestInterval: UPDATE_INTERVAL });
    while (true) {
        await sleep(UPDATE_INTERVAL);
    }
};

export const startBackgroundServiceScheduler = async () => {
    await BackgroundActions.stop();
    await BackgroundActions.start(locationSynchronizeTask, backgroundOptions);
    await BackgroundActions.updateNotification({ taskDesc: 'Reporting your location to the server.' }); // Only Android, iOS will ignore this call
}