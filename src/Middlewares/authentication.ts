import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const authentication = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies) {
            const tokenCookie = Object.keys(req.cookies).find((key: string) => key === "dG9rZW4");
            if (tokenCookie) {
                const token = req.cookies[tokenCookie];
                const user = jwt.verify(token, process.env.JWT_SECRET as string);
                if (user) {
                    req.body = {...req.body, user};
                    next();
                    return;
                }
            }
        }
        res.status(401).json({message: "Unauthorized"});
    } catch (e: any) {
        res.status(401).json({message: "Unauthorized"});
        return;
    }
}

export default authentication;