import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../Config/Database";

const router = express.Router();

router.post("/signin", async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (user) {
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = jwt.sign({
                    email: user.email,
                    id: user.id,
                }, process.env.JWT_SECRET as string, {
                    expiresIn: "1h",
                });
                res.cookie("dG9rZW4", token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                res.status(200).json({message: "User logged in"});
            } else {
                res.status(401).json({message: "Unauthorized"});
            }
        } else {
            res.status(404).json({message: "Not found"});
        }
    } catch (e: any) {
        next(e);
    }
});

router.post("/signup", async (req, res, next) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        const hash = await bcrypt.hash(password, 10);
        const isNotAvailable = await prisma.user.findUnique({
            where: {
                email: email,
            }
        });
        if (isNotAvailable) {
            res.status(409).json({ message: "Email already exists" });
            return;
        }
        const user = await prisma.user.create({
            data: {
                firstName: firstname,
                lastName: lastname,
                role: "USER",
                email: email,
                password: hash,
            }
        });
        const token = jwt.sign({
            email: user.email,
            id: user.id,
        }, process.env.JWT_SECRET as string, {
            expiresIn: "1h",
        });

        // return token in cookie
        res.cookie("dG9rZW4", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.status(200).json({ message: "User created" });
    } catch (e: any) {
        next(e);
    }
});

router.get("/signout", (req, res) => {
    res.clearCookie("dG9rZW4");
    res.status(200).json({ message: "User logged out" });
});

export default router;