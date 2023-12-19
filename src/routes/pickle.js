"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const addQueriesToUrl = (url, queries) => {
    const keys = Object.keys(queries);
    if (keys.length === 0) {
        return url;
    }
    let newUrl = url + "?";
    keys.forEach((key) => {
        newUrl += `${key}=${queries[key]}&`;
    });
    return newUrl.slice(0, -1);
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if req query is not emtpy
    if (Object.keys(req.query).length !== 0) {
        const url = addQueriesToUrl("https://rickandmortyapi.com/api/character/", req.query);
        const response = yield fetch(url);
        if (response.ok) {
            const data = yield response.json();
            res.status(200).json(data.results);
        }
        else {
            res.status(404).json({ message: "Not found" });
        }
    }
    else {
        res.status(400).json({ message: "Invalid query parameters" });
    }
}));
router.get("/getAll", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const page = parseInt((_a = req.query.page) !== null && _a !== void 0 ? _a : 1);
    const response = yield fetch(`https://rickandmortyapi.com/api/character?page=${page}`);
    if (response.ok) {
        const data = yield response.json();
        res.status(200).json(data.results);
    }
    else {
        res.status(404).json({ message: "Not found" });
    }
}));
exports.default = router;
