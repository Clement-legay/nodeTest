import { Router } from "express";
import prisma from "../Config/Database";
import {safeExecutionWrapper} from "../Helper/ErrorCatcher";
import {User} from "@prisma/client";

const router = Router();

router.get("/user", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
            }
        })
        res.status(200).json(users);
    });
});

router.get("/user/:id", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { id } = req.params;
        const user = await prisma.user.findFirst({
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
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        res.status(200).json(user);
    });
});

router.get("/orders/", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const orders = await prisma.order.findMany({
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        res.status(200).json(orders);
    });
});

router.get("/orders/:id", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { id } = req.params;
        const order = await prisma.order.findFirst({
            where: {
                id: id,
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        });
        if (!order) {
            res.status(404).json({ message: "Order not found" });
            return;
        }

        res.status(200).json(order);
    });
});

export default router;