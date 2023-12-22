import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import prisma from "../Config/Database";

const authentication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.cookies) {
            const tokenCookie = Object.keys(req.cookies).find((key: string) => key === "dG9rZW4");
            if (tokenCookie) {
                const token = req.cookies[tokenCookie];
                const userFromToken = jwt.verify(token, process.env.JWT_SECRET as string);
                if (userFromToken) {
                    const user = await prisma.user.findFirst({
                        where: {
                            id: (userFromToken as any).id,
                        },
                        select: {
                            id: true,
                            firstName: true,
                            lastName: true,
                            email: true,
                            role: true,
                        }
                    });
                    if (!user) {
                        res.status(401).json({message: "Unauthorized"});
                        return;
                    }
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