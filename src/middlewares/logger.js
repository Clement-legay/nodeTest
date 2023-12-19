"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var myLogger = function (req, res, next) {
    var queries = req.query;
    var body = req.body;
    var params = req.params;
    var authorization = req.headers.authorization;
    console.log("Request received :");
    console.log("    Requested URL:", req.url);
    console.log("    Queries:", queries);
    console.log("    Body:", body);
    console.log("    Params:", params);
    console.log("    Authorization:", authorization);
    next();
};
exports.default = myLogger;
