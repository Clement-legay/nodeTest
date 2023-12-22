import { Router } from "express";
import prisma from "../Config/Database";

const router = Router();

router.get("/", async (req, res, next) => {
    const { user } = req.body;
    const orders = prisma.order.findMany({
        where: {
            userId: user.id,
        }
    });

    res.status(200).json(orders);
});

router.get("/:id", async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    const order = prisma.order.findFirst({
        where: {
            id: id,
            userId: user.id,
        }
    });

    res.status(200).json(order);
});

router.post("/", async (req, res, next) => {
    const { user } = req.body;
    const productArray: { productId: string, quantity: number}[] = req.body;
    const order = prisma.order.create({
        data: {
            userId: user.id,
            products: {
                create: productArray,
            }
        }
    });

    res.status(201).json(order);
});

router.put("/:id", async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    const productArray: { productId: string, quantity: number}[] = req.body;
    const order = prisma.order.update({
        where: {
            id: id,
            userId: user.id,
        },
        data: {
            products: {
                create: productArray,
            }
        }
    });

    res.status(200).json(order);
});

router.delete("/:id", async (req, res, next) => {
    const { user } = req.body;
    const { id } = req.params;
    const order = prisma.order.delete({
        where: {
            id: id,
            userId: user.id,
        }
    });

    res.status(200).json(order);
});

export default router;