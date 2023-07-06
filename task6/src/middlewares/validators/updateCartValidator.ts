import {NextFunction, Request, Response} from 'express';
import {ICart} from '../../cart/Cart.model';
import {isValidString} from './makeOrderValidator';

export const validateUpdateCartStructure = (req: Request<any, any, ICart>, res: Response, next: NextFunction) => {
	const {id, items} = req.body;

	if (!isValidString(id)) {
		return res.status(400).json({message: 'Invalid id'});
	}

	if (!Array.isArray(items) || items.length === 0) {
		return res.status(400).json({message: 'Invalid items'});
	}

	for (const item of items) {
		const {product, count} = item;

		if (!product || typeof product !== 'object') {
			return res.status(400).json({message: 'Invalid product'});
		}

		const {title, description, price, id: productId} = product;

		if (
			!isValidString(title) ||
            !isValidString(description) ||
            typeof price !== 'number' || isNaN(price) ||
            !isValidString(productId) ||
            typeof count !== 'number' || count < 0
		) {
			return res.status(400).json({message: 'Invalid product properties'});
		}
	}

	next();

};
