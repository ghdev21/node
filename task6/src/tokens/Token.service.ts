import {config} from 'dotenv';
import jwt, {JwtPayload} from 'jsonwebtoken';
import {IUserDTO} from "../user/types";
import {IToken} from "./types";
import {TokenModel} from "./Token.model";
import {makeUserDTO} from "../user/User.repository";
import {UserModel} from "../user/User.model";

const {JWT_ACCESS_SECRET, JWT_REFRESH_SECRET} = config().parsed!
export const generateTokens = (payload: IUserDTO): IToken => {
    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: '2h'})
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: '30d'});

    return {
        accessToken,
        refreshToken
    }
};

export const validateToken = (token: string, secret: string) => {
    try {
        return jwt.verify(token, secret)
    }catch (e){
        console.error(e);
        return null
    }
}

export const findToken = async (refreshToken: string) => {
     const token = await TokenModel.findOne({refreshToken});

     return token;
}
export const saveToken = async(userId: string, refreshToken: string) => {
    const tokenData = await TokenModel.findOne({user: userId});
    if (tokenData) {
        tokenData.refreshToken = refreshToken;
        return tokenData.save();
    }

    const token = new TokenModel({user: userId, refreshToken});

    return await token.save();
}

export const deleteToken = (refreshToken: string) => {
    return TokenModel.deleteOne({refreshToken})
};

export const refreshToken = async (refreshToken: string): Promise<{user: IUserDTO} & IToken | null>  => {
    if (!refreshToken){
        throw new Error('unauthorized')
    }
    const userData = validateToken(refreshToken, JWT_REFRESH_SECRET);
    const tokenFromDB = await findToken(refreshToken);

    if (!userData && ! tokenFromDB){
        throw new Error('unauthorized')
    }
    //@ts-ignore
    const user = await UserModel.findById(userData.id as IUserDTO)
    if (user){
        const userDTO = makeUserDTO(user);
        const tokens = generateTokens(userDTO);

        await saveToken(user.id, tokens.refreshToken);

        return {...tokens, user: userDTO};
    }
    return null
}

