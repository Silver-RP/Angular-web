import mongoose, { Schema, Document } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  role: 'admin' | 'user';
  resetTokenExpires?: Date;
  resetToken?: string;
  verifyEmail: boolean;
  verifyToken?: string;
  blocked: boolean;
  totalOrders: number;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6},
    phone: { type: String, unique: true },
    avatar: { type: String, default: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'},
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    resetTokenExpires: { type: Date },
    resetToken: { type: String },
    verifyEmail: { type: Boolean, default: false },
    verifyToken: { type: String },
    blocked: { type: Boolean, default: false },
    totalOrders: { type: Number, default: 0 }
  },
  { timestamps: true }
);

UserSchema.plugin(mongoosePaginate);
export type UserDocument = mongoose.PaginateModel<IUser>;

const UserS = mongoose.model<IUser, UserDocument>('User', UserSchema);
export default UserS;

