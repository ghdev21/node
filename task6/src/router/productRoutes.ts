import express, {NextFunction, Request, Response} from "express";
import {getProducts, getProduct} from "../product/Product.service";
import {IExtendedProduct, IProduct} from "../product/types";
import {HttpStatusCode} from "./constants";

export const productRouter = express.Router();

type IProductResponse<T> = Response<T | { error: string }>

productRouter.get('/products', async (req: Request, res: IProductResponse<IExtendedProduct[]>, next: NextFunction) => {
    try {
        res.send(await getProducts())
    } catch (err){
        next(err)
    }
})

productRouter.get('/products/:productId', async (req: Request<{ productId: string }>, res: IProductResponse<IExtendedProduct>, next: NextFunction) => {
    const {params: {productId}} = req;
    try {
        const product = await getProduct(productId);
        if (product){
            res.status(HttpStatusCode.OK).send(product)
        } else {
            res.status(HttpStatusCode.NOT_FOUND).send({error: 'The product is not found'})
        }
    } catch (err) {
        next(err)
    }
})

