import {IExtendedUser, IUser} from "../types/UserTypes";
import {USERS_DB} from "./InMemoryDB";
import {generateId} from "../utils/utils.";
import {userService} from "../services/user.service";

let userDB = USERS_DB;
export interface IUserRepository {
    create: (user: IUser) => IExtendedUser;
    getAllUsers(): IExtendedUser[];
    // getOneById: (id: string) => IExtendedUser;
    getOneByEmail: (email: string) => IExtendedUser | undefined;
    getOneById: (id: string) => IExtendedUser | undefined;
    updateOneById: (id: string, newData: IUser) => IExtendedUser | undefined;
    deleteOneById: (id: string) => void;
}

export class UserRepository implements IUserRepository {
    create (user: IUser){
        const newUser = {...user, id: generateId()};

        userDB.push(newUser);

        return newUser;
    }

    getAllUsers(): IExtendedUser[] {
        return userDB;
    }
    getOneByEmail(email: string): IExtendedUser | undefined{
        return this.getAllUsers().find(user => user.email === email)
    }

    getOneById(id: string){
        return this.getAllUsers().find(user => user.id === id)
    }

    updateOneById(id: string, newData: IUser) : IExtendedUser | undefined {
        const users = this.getAllUsers()
        const userIndex = users.findIndex(user => user.id === id);

        if (userIndex === -1){
            return undefined
        }

        const newUser = {...users[userIndex], ...newData};

        users.splice(userIndex, 1, newUser);

        userDB = users;

        return newUser;
    }

    deleteOneById(id: string): void{
        userDB = this.getAllUsers().filter(user => user.id !== id)
    }
}

export const userRepository = new UserRepository();
