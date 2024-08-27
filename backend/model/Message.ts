import mongoose, { Types } from 'mongoose';

interface IMessageSchema {
  sender: Types.ObjectId,
  receiver: Types.ObjectId,
  message: String,
  timestamp: Date,
  status: boolean,
}

export interface IMessageModel extends IMessageSchema, mongoose.Document {
  _id: string;
}

const messageSchema = new mongoose.Schema<IMessageModel>({
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
  timestamp: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.model<IMessageModel>('Message', messageSchema);
