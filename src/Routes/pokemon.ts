import express from "express";
// @ts-ignore
import pokedex from "../../data/pokedex.json" assert { type: "json" };

const router = express.Router();

router.get("/:id", (req, res, next) => {
    try {
        const { id } = req.params;
        const pokemon: any = pokedex.find((pokemon: any) => pokemon.id === parseInt(id));
        if (pokemon) {
            res.status(200).json(pokemon);
        } else {
            res.status(404).json({ message: "Not found" });
        }
    } catch (e: any) {
        next(e);
    }
});

router.get("/", (req, res, next) => {
    try {
        const page: number = parseInt(req.query.page as string);
        const perPage: number = parseInt(req.query.perPage as string);
        if (req.query.name) {
            const name = req.query.name.toString();
            const pokemon = pokedex.find((p: any) =>
                p.name.english.toLowerCase() === name.toLowerCase() ||
                p.name.french.toLowerCase() === name.toLowerCase()
            );
            res.status(200).json(pokemon);
            return;
        } else if (page < 1 || perPage < 1) {
            res.status(400).json({message: "Invalid query parameters"});
            return;
        }
        res.status(200).json(pokedex.slice((page - 1) * perPage, page * perPage));
    } catch (e: any) {
        next(e);
    }
});

export default router;