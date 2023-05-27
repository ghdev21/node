export interface IUser {
    name: string,
    email: string,
    // hobbies: string[]

}

export interface IExtendedUser extends IUser{
    id: string;
}

