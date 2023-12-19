"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
// @ts-ignore
var pokedex_json_1 = require("../../data/pokedex.json");
var router = express_1.default.Router();
router.get("/:id", function (req, res) {
    var id = req.params.id;
    var pokemon = pokedex_json_1.default.find(function (pokemon) { return pokemon.id === parseInt(id); });
    if (pokemon) {
        res.status(200).json(pokemon);
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
});
router.get("/", function (req, res) {
    var _a, _b;
    var page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    var perPage = parseInt((_b = req.query.perPage) !== null && _b !== void 0 ? _b : 1);
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
});
exports.default = router;
