import express, {Request, Response, NextFunction} from 'express';
import {connectToDB, mongodbUrl} from "./db/db-connection";
import { productRouter} from "./router/productRoutes";
import {cartRouter} from "./router/cartRoutes";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import {seedProducts} from "./dataload/seed-products";
import {auth} from "./router/auth";
import {authMiddleware} from "./middlewares/authentification";
import {seedRoles} from "./dataload/seed-roles";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err, 'here');
    res.status(500);
    res.send({message: err.message});
};

const PORT = 3000;
const app = express();

app.listen(PORT, async () => {
    console.log(`The server has been started on port ${PORT}`);
    await connectToDB(mongodbUrl);
    await seedProducts();
    await seedRoles();
})

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.json())
app.use('/api', auth)
app.use('/api', productRouter)
app.use('/api/profile', authMiddleware, cartRouter)
app.use(errorHandler)
