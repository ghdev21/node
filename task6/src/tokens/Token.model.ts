import {model, Schema, Document} from "mongoose";
import {IToken} from "./types";
import {IUser} from "../user/types";

export interface ITokenExtended {
    user: IUser,
    refreshToken: IToken['refreshToken'],
}

export type ITokenSchema = ITokenExtended & Document;
export const tokenSchema = new Schema<ITokenSchema>({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    refreshToken: {type: String, required: true},
});

export const TokenModel = model<ITokenSchema>('Token', tokenSchema);
