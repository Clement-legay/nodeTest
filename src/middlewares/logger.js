"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const myLogger = (req, res, next) => {
    const queries = req.query;
    const body = req.body;
    const params = req.params;
    const authorization = req.headers.authorization;
    console.log("Request received :");
    console.log("    Requested URL:", req.url);
    console.log("    Queries:", queries);
    console.log("    Body:", body);
    console.log("    Params:", params);
    console.log("    Authorization:", authorization);
    next();
};
exports.default = myLogger;
