import {model, Schema, Document} from 'mongoose';
import {IUser} from './types';

export type IUserSchema = IUser & Document;

export const userSchema = new Schema<IUserSchema>({
	email: {type: String, required: true, unique: true},
	password: {type: String, required: true},
	role: {type: String, ref: 'Role', required: true},
});

export const UserModel = model<IUserSchema>('User', userSchema);
