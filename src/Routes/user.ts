import prisma from "../Config/Database";
import express from "express";
import {safeExecutionWrapper} from "../Helper/ErrorCatcher";
import {WishDto} from "../Helper/WishDto";
import {userConnectedDto, userUpdateDto} from "../dto/userDto";

const router = express.Router();

router.put("/update", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        if (!WishDto(userUpdateDto, req.body, res)) return;
        const {firstname, lastname, user} = req.body;
        const userData = await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                firstName: firstname,
                lastName: lastname,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            }
        });
        res.status(200).json(userData);
    });
});

router.delete("/delete", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        if (!WishDto(userConnectedDto, req.body, res)) return;
        const {id} = req.body.user;
        const user = await prisma.user.delete({
            where: {
                id: id,
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            }
        });
        res.status(200).json(user);
    });
});

export default router;