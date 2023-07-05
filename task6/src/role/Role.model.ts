import {model, Schema, Document} from 'mongoose';

export enum Roles {
    USER= 'user',
    ADMIN= 'admin',

}
interface IRole {
    role: Roles;
}

export type IRoleSchema = IRole & Document;

export const userSchema = new Schema<IRole>({
	role: {type: String, unique: true, default: Roles.USER},
});

export const RoleModel = model<IRoleSchema>('Role', userSchema);
