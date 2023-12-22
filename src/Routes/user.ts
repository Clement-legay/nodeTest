import {User} from "@prisma/client";
import prisma from "../Config/Database";
import express from "express";

const router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        const users: User[] = await prisma.user.findMany()
        res.status(200).json(users);
    } catch (e: any) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const {firstname, lastname} = req.body;
        const user = await prisma.user.update({
            where: {
                id: id,
            },
            data: {
                firstName: firstname,
                lastName: lastname,
            }
        });
        res.status(200).json(user);
    } catch (e: any) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const user = await prisma.user.delete({
            where: {
                id: id,
            }
        });
        res.status(200).json(user);
    } catch (e: any) {
        next(e);
    }
});

export default router;