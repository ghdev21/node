import express, {NextFunction, Request, Response} from "express";
import {getProducts, getProduct, updateExistingProduct, createNewProduct} from "../product/Product.service";
import {IExtendedProduct, IProduct} from "../product/types";
import {validateProductCreation} from "../middlewares/validators/productCreationValidator";

export const productRouter = express.Router();

type IProductResponse<T> = Response<T | { error: string }>

productRouter.get('/products', async (req: Request, res: IProductResponse<IExtendedProduct[]>, next: NextFunction) => {
    try {
        res.send(await getProducts())
    } catch (err){
        next(err)
    }
})

productRouter.post('/products', validateProductCreation, async (req: Request<any, any, IProduct>, res: IProductResponse<IExtendedProduct>, next: NextFunction) => {
    try {
        const {body} = req;
        const product = await createNewProduct(body);
        if (product){
            res.status(201).send(product);
        } else{
            res.status(400).send({error: 'cannot create product'})
        }
    } catch (err){
        next(err)
    }
});

productRouter.put('/products/:productId', validateProductCreation, async (req: Request<{ productId: string }, IProduct>, res: IProductResponse<IExtendedProduct>, next: NextFunction) => {
    const { body,  params: { productId } } = req;
    try {
        const product = await updateExistingProduct(productId, body);
        if (product) {
            res.status(201).send(product);
        } else {
            res.status(400).send({error: 'cannot update product'})
        }
    } catch (err) {
        next(err);
    }
});


productRouter.get('/products/:productId', async (req: Request<{ productId: string }>, res: IProductResponse<IExtendedProduct>, next: NextFunction) => {
    const {params: {productId}} = req;
    try {
        const product = await getProduct(productId);
        if (product){
            res.send(product)
        } else {
            res.status(404).send({error: 'The product is not found'})
        }
    } catch (err) {
        next(err)
    }
})

