import {NextFunction, Request, Response} from 'express';

export const isValidString = (value: any) => typeof value === 'string' && value.trim().length > 0;
export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
	const {userId, payment, delivery, comments} = req.body;

	if (!isValidString(userId)) {
		return res.status(400).json({message: 'Invalid userId'});
	}
	if (
		!payment ||
        typeof payment !== 'object' ||
        !isValidString(payment.type) ||
        !isValidString(payment.address) ||
        !isValidString(payment.creditCard)
	) {
		return res.status(400).json({message: 'Invalid payment'});
	}

	if (
		!delivery ||
        typeof delivery !== 'object' ||
        !isValidString(delivery.type) ||
        !isValidString(delivery.address)
	) {
		return res.status(400).json({message: 'Invalid delivery'});
	}

	if (comments && !isValidString(comments)) {
		return res.status(400).json({message: 'Invalid comments'});
	}

	next();
};
