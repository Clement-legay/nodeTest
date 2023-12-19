"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
// @ts-ignore
var pokedex_json_1 = __importDefault(require("../../data/pokedex.json"));
var router = express_1.default.Router();
router.get("/:id", function (req, res, next) {
    try {
        var id_1 = req.params.id;
        var pokemon = pokedex_json_1.default.find(function (pokemon) { return pokemon.id === parseInt(id_1); });
        if (pokemon) {
            res.status(200).json(pokemon);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    catch (e) {
        next(e);
    }
});
router.get("/", function (req, res, next) {
    try {
        var page = parseInt(req.query.page);
        var perPage = parseInt(req.query.perPage);
        if (req.query.name) {
            var name_1 = req.query.name.toString();
            var pokemon = pokedex_json_1.default.find(function (p) {
                return p.name.english.toLowerCase() === name_1.toLowerCase() ||
                    p.name.french.toLowerCase() === name_1.toLowerCase();
            });
            res.status(200).json(pokemon);
            return;
        }
        else if (page < 1 || perPage < 1) {
            res.status(400).json({ message: "Invalid query parameters" });
            return;
        }
        res.status(200).json(pokedex_json_1.default.slice((page - 1) * perPage, page * perPage));
    }
    catch (e) {
        next(e);
    }
});
exports.default = router;
