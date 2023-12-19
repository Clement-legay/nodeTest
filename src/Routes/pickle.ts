import express from "express";
import { Request, Response } from "express";

const router = express.Router();

const addQueriesToUrl = (url: string, queries: any) => {
    const keys = Object.keys(queries);
    if (keys.length === 0) {
        return url;
    }
    let newUrl = url + "?";
    keys.forEach((key) => {
        newUrl += `${key}=${queries[key]}&`;
    });
    return newUrl.slice(0, -1);
}

router.get("/", async (req: Request, res: Response, next) => {
    try {
        if (Object.keys(req.query).length !== 0) {
            const url = addQueriesToUrl("https://rickandmortyapi.com/api/character/", req.query);
            const response = await fetch(url);
            if (response.ok) {
                const data: any = await response.json();
                res.status(200).json(data.results);
            } else {
                res.status(404).json({ message: "Not found" });
            }
        } else {
            res.status(400).json({ message: "Invalid query parameters" });
        }
    } catch (e: any) {
        next(e);
    }
});

router.get("/getAll", async (req, res, next) => {
    try {
        const page: number = parseInt(req.query.page as string);
        const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
        if (response.ok) {
            const data: any = await response.json();
            res.status(200).json(data.results);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (e: any) {
        next(e);
    }
});

export default router;