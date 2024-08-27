import mongoose, { Types } from 'mongoose';

interface IUserSchema {
  email: string,
  firstName: string,
  description: string,
  sex: 'мужчина' | 'женщина',
  passwordHash: string,
  age: Number,
  purpose: string[],  
  mainPhoto: string,
  photos: string[],
  location: string,
  otherlikes: Types.ObjectId[],
  mylikes: Types.ObjectId[],
  contacts: Types.ObjectId[],
  blocked: Types.ObjectId[],
}

export interface IUserModel extends IUserSchema, mongoose.Document {
  _id: string;
}

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
    default: '',
  },
  sex: {
    type: String,
    required: true,
    enum: ['мужчина', 'женщина'],
  },
  passwordHash: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  purpose: [
    {
      type: String,
    },
  ],
  mainPhoto: {
    type: String,
    required: true,
  },
  photos: [
    {
      type: String,
    },
  ],
  location: {
    type: String,
    required: true,
  },
  otherlikes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  mylikes: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  contacts: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
  blocked: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    default: [],
  },
});

export default mongoose.model<IUserModel>('User', userSchema);
