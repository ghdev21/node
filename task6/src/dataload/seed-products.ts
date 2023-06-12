import fs from "fs";
import path from "path";
import {ProductModel} from "../product/Product.model";

export const seedProducts = async (): Promise<void> => {
    try {
        const usersData = fs.readFileSync(
            path.join(__dirname, 'products.json'),
            'utf8'
        );
        const users = JSON.parse(usersData);

        for (const user of users) {
            const existingProduct = await ProductModel.findOne({ title: user.title });
            // it should be smth like product code it just to keep it simpler

            if (!existingProduct) {
                await ProductModel.create(user);
            }
        }
    } catch (error) {
        console.error('Error seeding products', error);
    }
};
