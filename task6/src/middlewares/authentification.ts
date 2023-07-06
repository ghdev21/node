import {NextFunction, Request, Response} from 'express';
import {validateToken} from '../tokens/Token.service';
import {config} from 'dotenv';
import {HttpStatusCode} from '../router/constants';
import {IUserDTO} from '../user/types';

export interface CustomRequest extends Request{
    user?: IUserDTO
}

export const authMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
	try {
		const authorizationHeader = req.headers.authorization;
		if (!authorizationHeader) {
			return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
		}
		const [_, accessToken] = authorizationHeader.split(' ');
		if (!accessToken){
			return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
		}
		const {JWT_ACCESS_SECRET} = config().parsed!;
		const userData = validateToken(accessToken, JWT_ACCESS_SECRET) as IUserDTO;

		if (!userData){
			return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
		}

		req.user = userData;
		next();
	} catch (e){
		console.error(e);
		return res.status(HttpStatusCode.UNAUTHORIZED).json({ message: 'Unauthorized' });
	}
};
