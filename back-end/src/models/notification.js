/* eslint-disable max-len */
const { Schema, Types, model } = require('mongoose');
const Steps = require('../utils/steps.json');

const NotificationSchema = new Schema({
    message: { type: String, required: true },
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    process: { type: Schema.Types.ObjectId, ref: 'Process', required: false },
    isRead: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
});

NotificationSchema.statics.getAllUserNotifications = function get(userId) {
    const recipient = Types.ObjectId(userId);

    return this
        .find({
            isRead: false,
            recipient,
        })
        .sort({
            createdAt: -1,
        })
        .select('-recipient')
        .lean();
};

NotificationSchema.statics.createNotifications = async function createNotifications(process, targetStepPosition, attributesModified) {
    const stepKey = Object.keys(Steps).find((step) => Steps[step].position === targetStepPosition);
    const stepNotifications = Steps[stepKey].notifications || {};
    const notifications = [];

    Object.keys(stepNotifications).forEach((notificableAttribute) => {
        if (!attributesModified[notificableAttribute]) {
            return;
        }

        const notificationSettings = stepNotifications[notificableAttribute];

        Object.keys(notificationSettings).forEach((notificationRecipient) => {
            const recipient = process[notificationRecipient];
            const message = notificationSettings[notificationRecipient]
                .replace('{tipoDocumento}', process.type === 'convencional' ? 'TCE' : 'contrato de trabalho');

            notifications.push({
                message,
                recipient,
                process,
            });
        });
    });

    return this.insertMany(notifications);
};

const Notification = model('Notification', NotificationSchema);

module.exports = Notification;
