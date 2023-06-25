import {IOrder, OrderModel} from "./Order.model";
import {pool} from "../db/RDB-connections";
import {
    CREATE_DELIVERY_TABLE,
    CREATE_ORDER_TABLE,
    CREATE_PAYMENT_TABLE,
    INSERT_DELIVERY_QUERY,
    INSERT_ORDER_QUERY,
    INSERT_PAYMENT_QUERY, SELECT_ORDER_QUERY
} from "../queries/checkout";
//forgive me please for that util
export const  replaceKeys = <T> (data: T, oldKey: keyof T, newKey: keyof T, visited: Set<any> = new Set()): T => {
    if (typeof data === 'object' && !visited.has(data)) {
        visited.add(data);

        if (Array.isArray(data)) {
            return data.map(item => replaceKeys(item, oldKey, newKey, visited)) as T;
        } else {
            const newData: any = {};
            for (const key in data) {
                if (key === oldKey) {
                    newData[newKey] = data[key];
                } else {
                    newData[key] = replaceKeys(data[key] as T, oldKey, newKey, visited);
                }
            }
            return newData as T;
        }
    } else {
        return data;
    }
}
export const createOrder = async ({userId, items, total, cartId, comments, delivery, payment}: IOrder) => {
    try{
        await pool.query(CREATE_PAYMENT_TABLE);
        await pool.query(CREATE_DELIVERY_TABLE);
        await pool.query(CREATE_ORDER_TABLE);

        const {rows: paymentRes} = await pool.query(INSERT_PAYMENT_QUERY, [payment.type, payment.creditCard, payment.address])
        const {rows: deliveryRes} = await pool.query(INSERT_DELIVERY_QUERY, [delivery.type, delivery.address])
        const {rows: orderRes} = await pool.query(INSERT_ORDER_QUERY, [userId, JSON.stringify(items), total, cartId, comments, deliveryRes[0].id, paymentRes[0].id]);

        return {id: orderRes[0].id};
    }catch (err){
        console.error(err);
        throw new Error('unable to create the order, likely card does not exist or empty')
    }
}

