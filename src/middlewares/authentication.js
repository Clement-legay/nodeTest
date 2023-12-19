"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var authentication = function (req, res, next) {
    if (req.cookies) {
        var tokenCookie = Object.keys(req.cookies).find(function (key) { return key === "dG9rZW4"; });
        if (tokenCookie) {
            var token = req.cookies[tokenCookie];
            var decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (decoded) {
                req.body.user = decoded;
                next();
                return;
            }
        }
    }
    res.status(401).json({ message: "Unauthorized" });
};
exports.default = authentication;
