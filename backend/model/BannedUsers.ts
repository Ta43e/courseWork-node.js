import mongoose from 'mongoose';

interface IBannedUserSchema {
  email: string,
  message: string,
}

export interface IBannedUserModel extends IBannedUserSchema, mongoose.Document {
  _id: string;
}

const userBannedSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  message: {
    type: String,
    required: true,
  },
});

export default mongoose.model<IBannedUserModel>('BannedUser', userBannedSchema);
