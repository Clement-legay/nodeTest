import { Router } from "express";
import prisma from "../Config/Database";
import FileHelper from "../Middlewares/FileHelper";

const router = Router();

router.get("/", async (req, res, next) => {
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

router.get("/:id", async (req, res, next) => {
    const { id } = req.params;
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

router.post("/", FileHelper, async (req, res, next) => {
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

router.put("/:id", FileHelper, async (req, res, next) => {
    const { id } = req.params;
    const { name, price, description, imagePaths } = req.body;
    const product = await prisma.product.update({
        where: {
            id: id,
        },
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

router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    const product = await prisma.product.delete({
        where: {
            id: id,
        }
    });
    res.status(200).json(product);
});

export default router;