import express, {NextFunction, Response} from "express";
import {deleteProfileCart, handleGetCartInfo, updateProfileCart} from "../cart/Cart.service";
import {ICart} from "../cart/Cart.model";
import {validateUpdateCartStructure} from "../middlewares/validators/updateCartValidator";
import {makeOrder} from "../order/Order.service";
import {IOrder} from "../order/Order.model";
import {HttpStatusCode} from "./constants";
import {Roles} from "../role/Role.model";
import {CustomRequest} from "../middlewares/authentification";

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


cartRouter.get('/cart', async (req: CustomRequest, res: Response<ICartResponse<ICart>>, next: NextFunction) => {
    const {user} = req;
    try {
        const {total, cart} = await handleGetCartInfo(user?.id!);
        res.json({statusCode: HttpStatusCode.OK, message: 'cart retrieved', data: {total, cart}});
    } catch (err) {
        next(err);
    }
})
cartRouter.post('/cart/checkout', async (req:CustomRequest, res: Response<IOrderResponse<IOrder> | IShortResponse>, next: NextFunction) => {
    const {body, user} = req;
    try {
        const order = await makeOrder(body, user?.id!);
        if (order) {
            res.json({statusCode: HttpStatusCode.CREATED, message: 'cart retrieved', data: {order}})
        } else {
            res.json({statusCode: HttpStatusCode.NO_CONTENT, message: 'no content'})
        }
    } catch (err) {
        next(err);
    }
})

cartRouter.put('/cart', validateUpdateCartStructure, async (req: CustomRequest, res: Response<ICartResponse<ICart> | IShortResponse>, next: NextFunction) => {
    const {body, user} = req;
    try {
        const updatedData = await updateProfileCart(body, user?.id!);
        if (updatedData) {
            res.send({statusCode: HttpStatusCode.OK, message: 'cart data', data: {...updatedData}});
        } else {
            res.send({statusCode: HttpStatusCode.NOT_FOUND, message: 'cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

cartRouter.delete('/cart', async (req: CustomRequest, res: Response<IShortResponse>, next: NextFunction) => {
    try {
        const {role, id} = req.user!
        if (role === Roles.ADMIN){
            const isDeleted = await deleteProfileCart(id!);
            if (isDeleted) {
                res.send({statusCode: HttpStatusCode.OK, message: 'the cart has been deleted'});
            } else {
                res.send({statusCode: HttpStatusCode.NOT_FOUND, message: 'cart is not found'});
            }
        }
        res.send({statusCode: HttpStatusCode.FORBIDDEN, message: 'action forbidden'});
    } catch (err) {
        next(err)
    }
})

