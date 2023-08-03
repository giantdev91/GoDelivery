const admin = require('firebase-admin');

exports.sendNotification = (fcmTokens, title, body) => {
    const message = {
        notification: {
            title: title,
            body: body
        },
        tokens: fcmTokens
    };
    console.log('message info ===> ', message);
    admin.messaging().sendMulticast(message)
        .then((response) => {
            console.log('Successfully sent message:', response.successCount);
        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}