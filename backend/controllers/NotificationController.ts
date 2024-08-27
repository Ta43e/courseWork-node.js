import Users, {IUserModel} from '../model/User'
import { Response } from 'express';
import Notification, {INotificationModel} from '../model/Notification'
import { IAuthRequest } from '../interfaces/Interfaces';

interface notificationUser extends INotificationModel {
    mainPhoto: string,
}

export async function getNotificationPage(req: IAuthRequest, res: Response) {
    const currentUser: IUserModel | null = await Users.findById(req._id); 
    if (currentUser) {
        const notifications: notificationUser[] | null = await Notification.find({receiver: currentUser._id});
        if (notifications) {
            for (const element of notifications) {
                const contact: IUserModel | null = await Users.findById(element.sender.toString());
                if(contact) {
                    element.mainPhoto = contact.mainPhoto;
                }
            }
            res.render('notifications.ejs', { 
                notifications: notifications,
                currentUser: currentUser,
                currentStatus: false,
            });
        }

    }
}

export async function deleteNotification(req: IAuthRequest, res: Response) {
    const notification: INotificationModel | null = await Notification.findByIdAndDelete(req.params['notificationId']);
    console.log(notification);
    res.status(201).json(notification);
}

export async function checkNotification(req: IAuthRequest, res: Response) {
    const notification: INotificationModel | null = await Notification.findById(req.params['notificationId']);
    if(notification) {
        notification.status = true;
        await notification.save();
        return res.redirect(`/users/${notification?.sender}`);
    }
}