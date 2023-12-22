import { Router } from "express";
import prisma from "../Config/Database";
import FileHelper, {DeleteFile} from "../Middlewares/FileHelper";
import {safeExecutionWrapper} from "../Helper/ErrorCatcher";
import {WishDto} from "../Helper/WishDto";
import {orderCreateDto} from "../dto/orderDto";
import {productCreateDto, productUpdateDto} from "../dto/productDto";
import isManager from "../Middlewares/isManager";

const router = Router();

router.get("/", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const products = await prisma.product.findMany({
            include: {
                imagesProducts: {
                    include: {
                        image: true,
                    }
                }
            }
        });
        res.status(200).json(products);
    });
});


router.get("/:id", async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const {id} = req.params;
        const product = await prisma.product.findUnique({
            where: {
                id: id,
            },
            include: {
                imagesProducts: {
                    include: {
                        image: true,
                    }
                }
            }
        });
        res.status(200).json(product);
    });
});

router.post("/", isManager, FileHelper, async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        if (!WishDto(productCreateDto, req.body, res)) return;
        const { name, price, description, imagePaths } = req.body;
        const product = await prisma.product.create({
            data: {
                name: name,
                price: parseInt(price),
                description: description,
                imagesProducts: {
                    create: imagePaths.map((imagePath: string) => {
                        return {
                            image: {
                                connectOrCreate: {
                                    where: {
                                        path_folder: {
                                            path: imagePath,
                                            folder: "products",
                                        }
                                    },
                                    create: {
                                        path: imagePath,
                                        folder: "products",
                                        url: imagePath
                                    }
                                }
                            }
                        }
                    })
                }
            },
            include: {
                imagesProducts: {
                    include: {
                        image: true,
                    }
                }
            }
        });
        res.status(201).json(product);
    });
});

router.put("/:id", isManager, FileHelper, async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        if (!WishDto(productUpdateDto, req.body, res)) return;
        const { id } = req.params;
        const { name, price, description, imagePaths } = req.body;
        const productExists = await prisma.product.findUnique({
            where: {
                id: id,
            }
        });
        if (!productExists) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const productImages = await prisma.image.findMany({
            where: {
                products: {
                    some: {
                        productId: id,
                    }
                }
            }
        });
        productImages.forEach((image) => {
            DeleteFile(image.path);
        });
        const product = await prisma.product.update({
            where: {
                id: id,
            },
            data: {
                name: name,
                price: parseInt(price),
                description: description,
                imagesProducts: {
                    deleteMany: {},
                    create: imagePaths.map((imagePath: string) => {
                        return {
                            image: {
                                connectOrCreate: {
                                    where: {
                                        path_folder:
                                            {
                                                path: imagePath,
                                                folder: "products",
                                            },
                                    },
                                    create: {
                                        path: imagePath,
                                        folder: "products",
                                        url: imagePath
                                    }
                                }
                            }
                        }
                    })
                },
            },
            include: {
                imagesProducts: {
                    include: {
                        image: true,
                    }
                }
            }
        });
        res.status(200).json(product);
    });
});

router.delete("/:id", isManager, async (req, res, next) => {
    await safeExecutionWrapper(res, async () => {
        const { id } = req.params;
        const productExists = await prisma.product.findUnique({
            where: {
                id: id,
            }
        });
        if (!productExists) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        const product = await prisma.product.delete({
            where: {
                id: id,
            }
        });
        res.status(200).json(product);
    });
});

export default router;