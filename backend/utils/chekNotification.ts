import Notification, {INotificationModel} from '../model/Notification'

export async function checkNotification(id: string): Promise<Boolean> {
    const checkNotification: INotificationModel | null = await Notification.findOne({receiver: id, status: false})
    if (checkNotification) {
        return true;
    } else {
        return false;
    }
}