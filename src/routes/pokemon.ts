import express from "express";
// @ts-ignore
import pokedex from "../../data/pokedex.json" assert { type: "json" };

const router = express.Router();

router.get("/:id", (req, res) => {
    const { id } = req.params;
    const pokemon: any = pokedex.find((pokemon: any) => pokemon.id === parseInt(id));
    if (pokemon) {
        res.status(200).json(pokemon);
    } else {
        res.status(404).json({ message: "Not found" });
    }
});

router.get("/", (req, res) => {
    const page: number = parseInt(req.query.page as string ?? 1);
    const perPage: number = parseInt(req.query.perPage as string ?? 1);
    if (req.query.name) {
        const name = req.query.name.toString();
        const pokemon = pokedex.find((p: any) =>
            p.name.english.toLowerCase() === name.toLowerCase() ||
            p.name.french.toLowerCase() === name.toLowerCase()
        );
        res.status(200).json(pokemon);
        return;
    } else if (page < 1 || perPage < 1) {
        res.status(400).json({ message: "Invalid query parameters" });
        return;
    }
    res.status(200).json(pokedex.slice((page - 1) * perPage, page * perPage));
});

export default router;