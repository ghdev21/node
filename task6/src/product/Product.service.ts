import {createProduct, getAllProducts, getProductById, updateProduct} from "./Product.repository";
import {IExtendedProduct, IProduct} from "./types";

export const getProducts = async (): Promise<IExtendedProduct[]> => {
    return await getAllProducts();
}

export const getProduct = async (id: string): Promise<IExtendedProduct | null> => {
    return await getProductById(id);
}

export const createNewProduct = async (product: IProduct): Promise<IExtendedProduct | null> => {
    return await createProduct(product)
}

export const updateExistingProduct = async (id: string, product: IProduct): Promise<IExtendedProduct | null> => {
    return await updateProduct(id, product);
}
