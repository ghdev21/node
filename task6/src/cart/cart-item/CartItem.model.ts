import {model, Schema, Document} from 'mongoose';
import {IExtendedProduct} from '../../product/types';
import {productSchema} from '../../product/Product.model';

export interface ICartItem {
    product: IExtendedProduct;
    count: number;
}

export interface ICartItemSchema extends ICartItem, Document {}

export const cartItemSchema = new Schema<ICartItemSchema>({
	product: { type: productSchema, required: true },
	count: { type: Number, required: true },
});

export const CartItemModel = model<ICartItemSchema>('CartItem', cartItemSchema);
