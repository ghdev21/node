import {getAllProducts, getProductById} from "./Product.repository";
import {IExtendedProduct} from "./types";

export const getProducts = async (): Promise<IExtendedProduct[]> => {
    return await getAllProducts();
}

export const getProduct = async (id: string): Promise<IExtendedProduct | null> => {
    return await getProductById(id);
}
