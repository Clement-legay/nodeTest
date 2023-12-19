"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// @ts-ignore
const pokedex_json_1 = __importDefault(require("../../data/pokedex.json"));
const router = express_1.default.Router();
router.get("/:id", (req, res) => {
    const { id } = req.params;
    const pokemon = pokedex_json_1.default.find((pokemon) => pokemon.id === parseInt(id));
    if (pokemon) {
        res.status(200).json(pokemon);
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
router.get("/", (req, res) => {
    var _a, _b;
    const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const perPage = parseInt((_b = req.query.perPage) !== null && _b !== void 0 ? _b : 1);
    if (req.query.name) {
        const name = req.query.name.toString();
        const pokemon = pokedex_json_1.default.find((p) => p.name.english.toLowerCase() === name.toLowerCase() ||
            p.name.french.toLowerCase() === name.toLowerCase());
        res.status(200).json(pokemon);
        return;
    }
    else if (page < 1 || perPage < 1) {
        res.status(400).json({ message: "Invalid query parameters" });
        return;
    }
    res.status(200).json(pokedex_json_1.default.slice((page - 1) * perPage, page * perPage));
});
exports.default = router;
