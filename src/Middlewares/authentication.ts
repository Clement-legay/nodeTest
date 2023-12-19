import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authentication = (req: Request, res: Response, next: NextFunction) => {
    if (req.cookies) {
        const tokenCookie = Object.keys(req.cookies).find((key: string) => key === "dG9rZW4");
        if (tokenCookie) {
            const token = req.cookies[tokenCookie];
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            if (decoded) {
                req.body.user = decoded;
                next();
                return;
            }
        }
    }
    res.status(401).json({message: "Unauthorized"});
}

export default authentication;