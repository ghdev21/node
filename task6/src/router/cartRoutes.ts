import express, {NextFunction, Request, Response} from "express";
import {deleteProfileCart, handleGetCartInfo, updateProfileCart} from "../cart/Cart.service";
import {ICart} from "../cart/Cart.model";
import {ICheckout} from "../order/types";
import {makeOrder} from "../order/Order.service";
import {validateUpdateCartStructure} from "../middlewares/validators/updateCartValidator";

export const cartRouter = express.Router();

interface IShortResponse {
    statusCode: number;
    message: string;
}
interface ICartResponse<T> extends IShortResponse{
    data: {
        cart: T;
        total: number;
    };
}


cartRouter.get('/cart', async (req: Request, res: Response<ICartResponse<ICart>>, next: NextFunction) => {
    try {
        const {total, cart} = await handleGetCartInfo();
        res.send({statusCode: 200, message: 'cart retrieved', data: {total, cart}});
    } catch (err) {
        next(err);
    }
})
cartRouter.post('/cart/checkout', async (req: Request<any, any, ICheckout>, res: Response, next: NextFunction) => {
    const {body} = req;
    try {
        const order = await makeOrder(body);
        res.status(201).send({statusCode: 201, message: 'cart retrieved', data: {order}})
    } catch (err) {
        next(err);
    }
})

cartRouter.put('/cart', validateUpdateCartStructure, async (req: Request<any, any, ICart>, res: Response<ICartResponse<ICart> | IShortResponse>, next: NextFunction) => {
    const {body} = req;
    try {
        const updatedData = await updateProfileCart(body);
        if (updatedData){
            res.send({statusCode: 200, message: 'cart data', data: {...updatedData}});
        } else {
            res.status(404).send({statusCode: 404, message: 'cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

cartRouter.delete('/cart',  async (req: Request, res: Response<IShortResponse>, next: NextFunction) => {
    try {
        const isDeleted = await deleteProfileCart();
        if (isDeleted){
            res.send({statusCode: 200, message: 'the cart has been deleted'});
        } else {
            res.send({statusCode: 404, message: 'the cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

