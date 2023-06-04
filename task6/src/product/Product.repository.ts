import {IProductSchema, ProductModel} from "./Product.model";
import {IExtendedProduct, IProduct} from "./types";

export const makeProductDTO = ({title, description, price, _id}: IProductSchema): IExtendedProduct => ({
    title,
    description,
    price,
    id: _id
})
export const createProduct = async (product: IProduct) => {
    try {
        const newProduct = new ProductModel(product);

        return makeProductDTO(await newProduct.save());
    } catch (err) {
        console.error(err);
        throw new Error(`Error saving product:}`)
    }
}

export const updateProduct = async (id: string, product: IProduct) => {
    try {
        const newProduct = await ProductModel.findByIdAndUpdate(id, product, {new: true})
        if (newProduct) {
            return makeProductDTO(newProduct)
        }
        return null;
    } catch (err) {
        console.error(err);
        throw new Error(`cannot update product with id:${id}`)
    }
}

export const getProductById = async (id: string): Promise<IExtendedProduct | null> => {
    try {
        const product = await ProductModel.findById(id);
        return product ? makeProductDTO(product) : null;
    } catch (err) {
        console.error(err)
        throw new Error(`cannot find product with id:${id}`)
    }
}

export const getAllProducts = async (): Promise<IExtendedProduct[]> => {
    try {
        const products = await ProductModel.find();
        return products.map(makeProductDTO)
    } catch (err) {
        console.error(err)
        throw new Error(`cannot find products`)
    }
}
