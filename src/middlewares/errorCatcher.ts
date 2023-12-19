import { Request, Response, NextFunction } from 'express';

const errorHandlerMiddleware = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log('Executing error handling middleware');
    console.log(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
};

export default errorHandlerMiddleware;