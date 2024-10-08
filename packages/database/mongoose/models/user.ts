import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now,
  },
  lastLoginTime: { type: Date, default: Date.now },
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    index: true,
  },
  phonenumber: {
    type: String,
    trim: true,
    index: true,
  },
  password: String,
  salt: String,
  avatar: String,
  lastLoginIp: String,
});

export interface UserDocument extends Document {
  username: string;
  password: string;
  phonenumber: string;
  salt: string;
  avatar: string;
  createTime: Date;
  lastLoginTime: Date;
  lastLoginIp: string;
}

const User = model<UserDocument>("User", UserSchema);

export default User;
