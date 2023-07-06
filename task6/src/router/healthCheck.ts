import express from 'express';
import mongoose from 'mongoose';

export const healthCheck = express.Router();

healthCheck.get('', async (req, res, next) => {
	try {
		const adminDB = mongoose.connection.db.admin();
		const {ok} = await adminDB.ping();
		if (ok) {
			return res.status(200).send({status: 'MongoDB connection is healthy'});
		}

		res.status(500).send({error: 'MongoDB connection error'});
	} catch (error) {
		console.error('Health check error:', error);
		res.status(500).json({error: 'Health check error'});
	}
});
