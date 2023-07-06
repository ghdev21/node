import winston from 'winston';
import {NextFunction, Request, Response} from 'express';

export const logger = winston.createLogger({
	level: 'info',
	format: winston.format.json(),
	transports: [
		new winston.transports.Console(),
		new winston.transports.File({ filename: 'app.log' })
	]
});

const formatResponseTime = (duration: number) => {
	if (duration < 1000) {
		return duration + 'ms';
	} else {
		const seconds = (duration / 1000).toFixed(2);
		return seconds + 's';
	}
};
export const loggers = (req: Request, res: Response, next: NextFunction) => {
	logger.info(`${req.method} ${req.path}`);
	const start = Date.now();
	res.on('finish', () => {
		const duration = Date.now() - start;
		const responseTime = formatResponseTime(duration);
		logger.info(`Response time: ${responseTime}`);
	});
	next();
};
