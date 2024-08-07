import { Schema, model, Document } from "mongoose";

const UserSchema = new Schema({
  createTime: {
    type: Date,
    default: Date.now,
  },
  username: {
    type: String,
    require: true,
    trim: true,
    unique: true,
    index: true,
  },
  password: String,
  salt: String,
  avatar: String,
});

export interface UserDocument extends Document {
  username: string;
  password: string;
  salt: string;
  avatar: string;
  createTime: Date;
}

const User = model<UserDocument>("user", UserSchema);

export default User;
