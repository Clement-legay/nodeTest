import {PrismaClient, User} from "@prisma/client";
import express from "express";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res) => {
    const users: User[] = await prisma.user.findMany()
    res.status(200).json(users);
});

router.post("/", async (req, res) => {
    const {firstname, lastname} = req.body;
    const user = await prisma.user.create({
        data: {
            firstName: firstname,
            lastName: lastname,
        }
    });
    res.status(200).json(user);
});

router.put("/:id", async (req, res) => {
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
});

router.delete("/:id", async (req, res) => {
    const {id} = req.params;
    const user = await prisma.user.delete({
        where: {
            id: id,
        }
    });
    res.status(200).json(user);
});

export default router;