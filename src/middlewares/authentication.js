"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authentication = (req, res, next) => {
    if (req.headers.authorization) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = authentication;