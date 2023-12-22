import { Router } from "express";
import prisma from "../Config/Database";
import {safeExecutionWrapper} from "../Helper/ErrorCatcher";
import {Order, OrderProduct, Product} from "@prisma/client";
import {WishDto} from "../Helper/WishDto";
import {orderCreateDto, orderUpdateDto} from "../dto/orderDto";

const router = Router();

router.get("/", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { user } = req.body;
        const orders = await prisma.order.findMany({
            where: {
                userId: user.id,
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        res.status(200).json(orders.map(order => orderMapped(order)));
    });
});

router.get("/:id", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { user } = req.body;
        const { id } = req.params;
        const order = await prisma.order.findFirst({
            where: {
                id: id,
                userId: user.id,
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

        res.status(200).json(orderMapped(order));
    });
});

// create a new order
router.post("/", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        if (!WishDto(orderCreateDto, req.body, res)) return;
        const { user } = req.body;
        const productArray: { productId: string, quantity: number}[] = req.body.productArray;
        const productExists = await prisma.product.findMany({
            where: {
                id: {
                    in: productArray.map((product) => product.productId),
                }
            }
        });
        if (productExists.length !== productArray.length) {
            res.status(400).json({ message: "One or more products not found" });
            return;
        }
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                orderProducts: {
                    create: productArray.map((product) => {
                        return {
                            quantity: product.quantity,
                            product: {
                                connect: {
                                    id: product.productId,
                                }
                            }
                        }
                    }),
                }
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        res.status(201).json(orderMapped(order));
    });
});

router.put("/:id", async (req, res, next) => {
    if (!WishDto(orderUpdateDto, req.body, res)) return;
    await safeExecutionWrapper(res, async () => {
        const { user } = req.body;
        const { id } = req.params;
        const productArray: { productId: string, quantity: number}[] = req.body.productArray;
        const orderExists = await prisma.order.findFirst({
            where: {
                id: id,
                userId: user.id,
            }
        });
        if (!orderExists) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        const productExists = await prisma.product.findMany({
            where: {
                id: {
                    in: productArray.map((product) => product.productId),
                }
            }
        });
        if (productExists.length !== productArray.length) {
            res.status(400).json({ message: "One or more products not found" });
            return;
        }
        const order = await prisma.order.update({
            where: {
                id: id,
                userId: user.id,
            },
            data: {
                orderProducts: {
                    deleteMany: {},
                    create: productArray.map((product) => {
                        return {
                            quantity: product.quantity,
                            product: {
                                connect: {
                                    id: product.productId,
                                }
                            }
                        }
                    }),
                }
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                },
            },
        });

        res.status(200).json(orderMapped(order));
    });
});

const orderMapped = (order: Order & { orderProducts: (OrderProduct & { product: Product })[] }) => {
    const { orderProducts, ...orderWithoutOrderProducts } = order;
    return {
        ...orderWithoutOrderProducts,
        products: order.orderProducts.map((orderProduct) => {
            return {
                ...orderProduct.product,
                quantity: orderProduct.quantity,
            }
        })
    }
};

router.delete("/:id", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { user } = req.body;
        const { id } = req.params;
        const orderExists = await prisma.order.findFirst({
            where: {
                id: id,
                userId: user.id,
            }
        });
        if (!orderExists) {
            res.status(404).json({ message: "Order not found" });
            return;
        }
        const order = await prisma.order.delete({
            where: {
                id: id,
                userId: user.id,
            },
            include: {
                orderProducts: {
                    include: {
                        product: true,
                    }
                }
            }
        });

        res.status(200).json(orderMapped(order));
    });
});

export default router;