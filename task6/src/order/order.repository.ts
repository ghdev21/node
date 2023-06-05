import {IOrder, OrderModel} from "./Order.model";
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

export const createOrder = async (orderData: IOrder) => {
   try{
       const res = new OrderModel(orderData);
       const {_id,} = await res.save();

       return {id: _id};
   }catch (err){
       console.error(err);
       throw new Error('unable to create the order, likely card does not exist or empty')
   }
}

