import mongoose, { Types } from 'mongoose';

interface INotificationSchema {
  sender: Types.ObjectId,
  receiver: Types.ObjectId,
  message: String,
  timestamp: Date,
  status: boolean,
}

export interface INotificationModel extends INotificationSchema, mongoose.Document {
  _id: string;
}

const notificationSchema = new mongoose.Schema<INotificationModel>({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<INotificationModel>('Notification', notificationSchema);
