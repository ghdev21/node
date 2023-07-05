import mongoose from 'mongoose';
import {debug} from 'debug';

const debugLogger = debug('my-app:database');
export const connectToDB = async (mongodbUrl: string) => {
	try {
		await mongoose.connect(mongodbUrl);
		debugLogger('connected to the db');
	} catch (err){
		debugLogger(`Error connecting to MongoDB:${err}`);
	}
};
