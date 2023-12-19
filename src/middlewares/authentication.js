"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var authentication = function (req, res, next) {
    if (req.headers.authorization) {
        next();
    }
    else {
        res.status(401).json({ message: "Unauthorized" });
    }
};
exports.default = authentication;
