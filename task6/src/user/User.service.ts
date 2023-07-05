import {createUser, makeUserDTO} from "./User.repository";
import {IUser, IUserDTO} from "./types";
import {RoleModel} from "../role/Role.model";
import bcrypt from 'bcrypt'
import {deleteToken, generateTokens, refreshToken, saveToken} from "../tokens/Token.service";
import {IToken} from "../tokens/types";
import {UserModel} from "./User.model";

const ROUNDS = 3
export const registration = async (userData: IUser): Promise<IUserDTO & IToken | null> => {
    const result = await RoleModel.findOne({role: userData.role});
    if (!result) {
        throw new Error('invalid role')
    }
    const password = bcrypt.hashSync(userData.password, ROUNDS);

    const user = await createUser({role: result.role, password, email: userData.email});

    if (user) {
        const userDTO = makeUserDTO(user)
        const tokens = generateTokens(userDTO);

        await saveToken(user.id!, tokens.refreshToken);

        return {...userDTO, ...tokens}
    }
    return null;
}

export const login = async ({password, email}: IUser): Promise<IUserDTO & IToken | null> => {
    const user = await UserModel.findOne({email});
    if (!user) {
        return null
    }
    const isValidPassword = bcrypt.compareSync(password, user.password);

    if (!isValidPassword) {
        throw new Error('invalid password');
    }
    const userDTO = makeUserDTO(user);
    const tokens = generateTokens(userDTO);

    await saveToken(user.id, tokens.refreshToken);

    return {...userDTO, ...tokens};
}

export const logout = async (token: string): Promise<IToken | null> => {
    deleteToken(token);
    return null
};

export const refresh = async (token: string): Promise<{user: IUserDTO} & IToken | null> => {
 return await refreshToken(token);
}
