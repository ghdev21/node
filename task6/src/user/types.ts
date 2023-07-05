import {Roles} from "../role/Role.model";

export interface IUser {
    email: string,
    password: string,
    role: Roles,
}

export type IUserDTO = Omit<IUser, 'password'> & Pick<IExtendedUser, 'id'>

export interface IExtendedUser extends IUser{
    id?: string
    _id?: string
}
