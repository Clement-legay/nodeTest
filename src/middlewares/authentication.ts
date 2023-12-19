import { Request, Response, NextFunction } from "express";

const authentication = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
        next();
    } else {
        res.status(401).json({ message: "Unauthorized" });
    }
}

export default authentication;