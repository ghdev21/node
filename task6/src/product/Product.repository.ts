
import {IExtendedProduct} from "./types";
import {pool} from "../db/RDB-connections";
import {SELECT_PRODUCT_BY_CODE_QUERY, SELECT_PRODUCTS} from "../queries/products";

export const makeProductDTO = ({title, description, price, code}: IExtendedProduct): IExtendedProduct => ({
    title,
    description,
    price,
    code
})

export const getProductById = async (code: string): Promise<IExtendedProduct | null> => {
    try {
        const {rows} = await pool.query(SELECT_PRODUCT_BY_CODE_QUERY, [code]);
        return rows.length ? makeProductDTO(rows[0]) : null;
    } catch (err) {
        console.error(err)
        throw new Error(`cannot find product with id:${code}`)
    }
}

export const getAllProducts = async (): Promise<IExtendedProduct[]> => {
    try {
        const {rows: products} = await pool.query(SELECT_PRODUCTS)
        console.log(products)
        return products.map(makeProductDTO)
    } catch (err) {
        console.error(err)
        throw new Error(`cannot find products`)
    }
}
