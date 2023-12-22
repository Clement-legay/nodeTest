import express, { Router } from 'express';
import prisma from "../Config/Database";

const router = Router();

router.get("/", async (req: express.Request, res: express.Response) => {
    if (req.query.image) {
        const imageId = req.query.image as string;
        const image = await prisma.image.findUnique({
            where: {
                id: imageId,
            }
        });
        if (image) {
            res.status(200).sendFile(image.path, { root: "./" });
        } else {
            res.status(404).json({ message: "Image not found" });
        }
    } else {
        res.status(404).json({ message: "File not found" });
    }
});

export default router;