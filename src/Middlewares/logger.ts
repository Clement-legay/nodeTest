import {Response, Request, NextFunction} from "express";

const myLogger = (req: Request, res: Response, next: NextFunction) => {
    const queries = req.query;
    const body = req.body;
    const params = req.params;
    const authorization = req.headers.authorization;
    const cookies = req.cookies;

    console.log("Request received :");
    console.log("    Requested URL:", req.url);
    console.log("    Queries:", queries);
    console.log("    Body:", body);
    console.log("    Params:", params);
    console.log("    Authorization:", authorization);

    next();
}

export default myLogger;