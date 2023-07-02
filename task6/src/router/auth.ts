import express, {NextFunction, Request, Response} from "express";
import {HttpStatusCode} from "./constants";
import {login, logout, refresh, registration} from "../user/User.service";
import {IToken} from "../tokens/types";

export const auth = express.Router();
const getMaxAge = () => 30 * 24 * 60 * 6000

type IProductResponse<T> = Response<T | { error: string }>

auth.post('/register', async (req: Request, res: IProductResponse<any>, next: NextFunction) => {
    try {
        const userData = await registration(req.body);
        if (userData){
            res.cookie('refreshToken', userData.refreshToken, {maxAge: getMaxAge(), httpOnly:true})// one month
            res.status(HttpStatusCode.OK).send(userData)

        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({error: 'unable to create user'})
        }
    } catch (err){
        next(err)
    }
})

auth.post('/login', async (req: Request<{ email: string, password: string }>, res: IProductResponse<any>, next: NextFunction) => {
    try {
        const userData = await login(req.body);
        if (userData){
            res.cookie('refreshToken', userData.refreshToken, {maxAge: getMaxAge(), httpOnly: true})// one month
            res.status(HttpStatusCode.OK).send(userData)

        } else {
            res.status(HttpStatusCode.BAD_REQUEST).send({error: 'unable to login'})
        }
    } catch (err) {
        next(err)
    }
});

auth.get('/logout', async (req: Request, res: IProductResponse<IToken>, next: NextFunction) => {
    try {
        const {refreshToken} = req.cookies;
        const token = await logout(refreshToken);

        res.clearCookie('refreshToken');
        res.status(HttpStatusCode.OK).send(token!)
    } catch (err) {
        next(err)
    }
})

auth.get('/refresh', async (req: Request, res: IProductResponse<IToken>, next: NextFunction) => {
    try {
        const {refreshToken} = req.cookies;
        const data = await refresh(refreshToken);
        res.status(HttpStatusCode.OK).send(data!)
    } catch (err) {
        next(err)
    }
})

