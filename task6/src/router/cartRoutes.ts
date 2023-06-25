import express, {NextFunction, Request, Response} from "express";
import {deleteProfileCart, handleGetCartInfo, updateProfileCart} from "../cart/Cart.service";
import {ICart} from "../cart/Cart.model";
import {ICheckout} from "../order/types";
import {validateUpdateCartStructure} from "../middlewares/validators/updateCartValidator";
import {makeOrder} from "../order/Order.service";
import {IOrder} from "../order/Order.model";
import {HttpStatusCode} from "./constants";
import {validateProductCreation} from "../middlewares/validators/productCreationValidator";

export const cartRouter = express.Router();

export interface IShortResponse {
    statusCode: HttpStatusCode;
    message?: string;
}

interface ICartResponse<T> extends IShortResponse {
    data: {
        cart: T;
        total: number;
    };
}

interface IOrderResponse<T> extends IShortResponse {
    data: {
        order: T;
    };
}


cartRouter.get('/cart', async (req: Request, res: Response<ICartResponse<ICart>>, next: NextFunction) => {
    const userEmail = req.headers.authorization
    try {
        const {total, cart} = await handleGetCartInfo(userEmail!);
        res.json({statusCode: HttpStatusCode.OK, message: 'cart retrieved', data: {total, cart}});
    } catch (err) {
        next(err);
    }
})
cartRouter.post('/cart/checkout', async (req: Request<any, any, ICheckout>, res: Response<IOrderResponse<IOrder> | IShortResponse>, next: NextFunction) => {
    const {body} = req;
    const userEmail = req.headers.authorization;
    try {
        const order = await makeOrder(body, userEmail!);
        if (order) {
            res.json({statusCode: HttpStatusCode.CREATED, message: 'cart retrieved', data: {order}})
        } else {
            res.json({statusCode: HttpStatusCode.NO_CONTENT, message: 'no content'})
        }
    } catch (err) {
        next(err);
    }
})

cartRouter.put('/cart', validateUpdateCartStructure, async (req: Request<any, any, ICart>, res: Response<ICartResponse<ICart> | IShortResponse>, next: NextFunction) => {
    const {body} = req;
    const userEmail = req.headers.authorization
    try {
        const updatedData = await updateProfileCart(body, userEmail!);
        if (updatedData) {
            res.send({statusCode: HttpStatusCode.OK, message: 'cart data', data: {...updatedData}});
        } else {
            res.send({statusCode: HttpStatusCode.NOT_FOUND, message: 'cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

cartRouter.delete('/cart', async (req: Request, res: Response<IShortResponse>, next: NextFunction) => {
    try {
        const userEmail = req.headers.authorization
        const isDeleted = await deleteProfileCart(userEmail!);
        if (isDeleted) {
            res.send({statusCode: HttpStatusCode.OK, message: 'the cart has been deleted'});
        } else {
            res.send({statusCode: HttpStatusCode.NOT_FOUND, message: 'cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

