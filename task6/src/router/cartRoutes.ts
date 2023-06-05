import express, {NextFunction, Request, Response} from "express";
import {deleteProfileCart, handleGetCartInfo, updateProfileCart} from "../cart/Cart.service";
import {ICart} from "../cart/Cart.model";
import {ICheckout} from "../order/types";
// import {makeOrder} from "../order/Order.service";
import {validateUpdateCartStructure} from "../middlewares/validators/updateCartValidator";
import {makeOrder} from "../order/Order.service";

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
    const userEmail = req.headers.authorization
    try {
        const {total, cart} = await handleGetCartInfo(userEmail!);
        res.send({statusCode: 200, message: 'cart retrieved', data: {total, cart}});
    } catch (err) {
        next(err);
    }
})
cartRouter.post('/cart/checkout', async (req: Request<any, any, ICheckout>, res: Response, next: NextFunction) => {
    const {body} = req;
    const userEmail = req.headers.authorization;
    try {
        const order = await makeOrder(body, userEmail!);
        if (order){
            res.status(201).send({statusCode: 201, message: 'cart retrieved', data: {order}})
        } else {
            res.status(400).send({statusCode: 400, message: 'cannot create the order'})
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
        const userEmail = req.headers.authorization
        const isDeleted = await deleteProfileCart(userEmail!);
        if (isDeleted){
            res.send({statusCode: 200, message: 'the cart has been deleted'});
        } else {
            res.send({statusCode: 404, message: 'the cart is not found'});
        }
    } catch (err) {
        next(err)
    }
})

