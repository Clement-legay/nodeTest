import { Request, Response, NextFunction } from 'express';

const isAdminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    if (req.body.user.role !== "Manager") {
        res.status(403).json({ error: 'Forbidden' });
    } else {
        next();
    }
};

export default isAdminMiddleware