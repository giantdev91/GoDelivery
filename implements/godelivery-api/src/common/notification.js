const admin = require('firebase-admin');
const Notification = require("../models/notification");
const {
    NOTIFICATION_TYPE_ORDER_CREATED,
    NOTIFICATION_TYPE_ORDER_ASSIGNED,
    NOTIFICATION_TYPE_ORDER_CANCEL,
    NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN,
    NOTIFICATION_TYPE_ORDER_PROCESSING,
    NOTIFICATION_TYPE_ORDER_COMPLETED,
    NOTIFICATION_TYPE_ORDER_FEEDBACK,
    NOTIFICATION_TYPE_ORDER_CANNOT_CREATE,

} = require('../common/constant');

exports.sendNotification = (fcmTokens, title, body, orderId, receiverIds, type) => {
    const message = {
        notification: {
            title: title,
            body: body
        },
        tokens: fcmTokens
    };
    admin.messaging().sendMulticast(message)
        .then((response) => {
            console.log('Successfully sent message:', response.successCount);
            var receiverType = 0;
            switch (type) {
                case NOTIFICATION_TYPE_ORDER_CREATED:
                    receiverType = 1;
                    break;
                case NOTIFICATION_TYPE_ORDER_ASSIGNED:
                    receiverType = 0;
                    break;
                case NOTIFICATION_TYPE_ORDER_CANCEL:
                    receiverType = 1;
                    break;
                case NOTIFICATION_TYPE_ORDER_CANCEL_BY_DELIVERYMAN:
                    receiverType = 0;
                    break;
                case NOTIFICATION_TYPE_ORDER_PROCESSING:
                    receiverType = 0;
                    break;
                case NOTIFICATION_TYPE_ORDER_COMPLETED:
                    receiverType = 0;
                    break;
                case NOTIFICATION_TYPE_ORDER_FEEDBACK:
                    receiverType = 1;
                    break;
                case NOTIFICATION_TYPE_ORDER_CANNOT_CREATE:
                    receiverType = 0;
                    break;
            }
            console.log('receiver type ===> ', receiverType);
            receiverIds.map((receiver) => {
                Notification.create({
                    content: body,
                    type: type,
                    orderID: orderId,
                    receiver: receiver,
                    receiverType: receiverType,
                });
            })

        })
        .catch((error) => {
            console.log('Error sending message:', error);
        });
}