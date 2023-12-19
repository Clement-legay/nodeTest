"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var errorHandlerMiddleware = function (err, req, res, next) {
    console.log('Executing error handling middleware');
    console.log(err.message);
    res.status(500).json({ error: 'Internal Server Error' });
};
exports.default = errorHandlerMiddleware;
