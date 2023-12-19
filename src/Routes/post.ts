import {Post, PrismaClient, User} from "@prisma/client";
import express from "express";
import {SaveImageHelper} from "../Helpers/FileHelper";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/", async (req, res, next) => {
    try {
        const posts: Post[] = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        firstName: true,
                        lastName: true,
                    }
                }
            }
        })
        res.status(200).json(posts);
    } catch (e: any) {
        next(e);
    }
});

router.post("/", async (req, res, next) => {
    try {
        SaveImageHelper(req, res, { width: 400, height: undefined })
        const {title, content, published, imagesPath, user} = req.body;
        console.log(imagesPath)
        const post = await prisma.post.create({
            data: {
                title: title,
                content: content,
                published: published,
                authorId: user.id,
            },
        });
        res.status(200).json(post);
    } catch (e: any) {
        next(e);
    }
});

router.put("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const {title, content, published, user} = req.body;
        const post = await prisma.post.update({
            where: {
                id: id,
                authorId: user.id,
            },
            data: {
                title: title,
                content: content,
                published: published
            }
        });
        if (!post) {
            res.status(404).json({message: "Post not found"});
            return;
        }
        res.status(200).json(post);
    } catch (e: any) {
        next(e);
    }
});

router.delete("/:id", async (req, res, next) => {
    try {
        const {id} = req.params;
        const post = await prisma.post.delete({
            where: {
                id: id,
            }
        });
        if (!post) {
            res.status(404).json({message: "Post not found"});
            return;
        }
        res.status(200).json(post);
    } catch (e: any) {
        next(e);
    }
});

export default router;