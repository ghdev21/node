import {model, Schema, Document} from 'mongoose';
import {IProduct} from './types';

export type IProductSchema = IProduct & Document;

export const productSchema = new Schema<IProductSchema>({
	title: {type: String, required: true},
	description: {type: String, required: true},
	price: {type: Number, required: true},
});

export const ProductModel = model<IProductSchema>('Product', productSchema);
