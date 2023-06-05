import {NextFunction, Request, Response} from "express";

export const extractUserEmail = (req: Request, res: Response, next: NextFunction) => {
    const authorizationHeader = req.headers.authorization;
    if (authorizationHeader) {
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorizationHeader);
        if (isEmail) {
            return next();
        } else {
            return res.status(400).json({ message: 'email is invalid' });
        }
    } else {
        return res.status(400).json({ message: 'not authorized' });
    }
};
