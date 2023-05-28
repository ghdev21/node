import {IUserRepository, userRepository} from "../db/user.repository";
import {IExtendedUser, IUser} from "../types/UserTypes";

interface IUserService {
    createUser(user: IUser): IExtendedUser,
    updateUser(id: string, newData: IUser): IExtendedUser | undefined,
    getAllUsers(): IExtendedUser[],
    getUserById(id: string): IExtendedUser | undefined,
    deleteUserById(id: string): IExtendedUser | undefined;
    createUserHobby(id: string, hobbies: IUser["hobbies"]): IUser["hobbies"]
}


class UserService implements IUserService {
    private readonly _userRepository: IUserRepository;

    constructor(userRepository: IUserRepository) {
        this._userRepository = userRepository;
    }

    get userRepository(): IUserRepository {
        return this._userRepository;
    }

    createUser(userData: IUser): IExtendedUser{
        const user = this.userRepository.getOneByEmail(userData.email);

        if (user){
            throw new Error(`Unable to create the user with: ${user.email} the email already exists`)
        }

        return this.userRepository.create(userData);
    };

    updateUser(id: string, userData: IUser): IExtendedUser | undefined {
        const user = this.userRepository.getOneById(id);

        if (!user){
            throw new Error(`Unable to find the user with ID: ${id}`)
        }
        return this.userRepository.updateOneById(id, userData);
    }

    createUserHobby(id: string, hobbies: IUser["hobbies"]): IUser["hobbies"] {
        const user = this.userRepository.getOneById(id);

        if (!user){
            throw new Error(`Unable to find the user with ID: ${id}`)
        }
        this.userRepository.updateOneById(id, {...user, hobbies});

        return hobbies
    }
    deleteUserHobby(id: string ) {
        const user = this.userRepository.getOneById(id);

        if (!user){
            throw new Error(`Unable to find the user with ID: ${id}`)
        }
        this.userRepository.updateOneById(id, {...user, hobbies: []});
    }

    getAllUsers(): IExtendedUser[]{
        return userRepository.getAllUsers();
    }

    getUserById(id: string): IExtendedUser | undefined {
        const user = userRepository.getOneById(id);

        if (!user) {
            throw new Error(`Unable to find the user with following id: ${id}`)
        }

        return user;
    }

    deleteUserById(id: string): IExtendedUser | undefined{
        try{
            const user = userRepository.getOneById(id);

            if (user){
                userRepository.deleteOneById(id)
            }

            return user;
        } catch (err){
            throw new Error(`Unable to delete the user with following id: ${id}`)
        }

    }
}

export const userService = new UserService(userRepository)
