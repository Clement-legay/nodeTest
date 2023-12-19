import {RateLimiter} from "limiter";
import {Request, Response, NextFunction} from "express";

const intervalIter = process.env.LIMITER_INTERVAL ? parseInt(process.env.LIMITER_INTERVAL) : 100;

const iterations: iterationSpecs = {
    "GET": process.env.LIMITER_GET_ITERATIONS ? parseInt(process.env.LIMITER_GET_ITERATIONS) : 1,
    "POST": process.env.LIMITER_POST_ITERATIONS ? parseInt(process.env.LIMITER_POST_ITERATIONS) : 1,
    "PUT": process.env.LIMITER_PUT_ITERATIONS ? parseInt(process.env.LIMITER_PUT_ITERATIONS) : 1,
    "DELETE": process.env.LIMITER_DELETE_ITERATIONS ? parseInt(process.env.LIMITER_DELETE_ITERATIONS) : 1,
    "PATCH": process.env.LIMITER_PATCH_ITERATIONS ? parseInt(process.env.LIMITER_PATCH_ITERATIONS) : 1,
}

type iterationSpecs = {
    "GET": number,
    "POST": number,
    "PUT": number,
    "DELETE": number,
    "PATCH": number,
}

const limiter = new RateLimiter({
    tokensPerInterval: intervalIter,
    interval: "minute",
    fireImmediately: true
})

const CheckLimiter = async (req: Request, res: Response, next: NextFunction) => {
    const method = req.method as keyof iterationSpecs;
    const matchingIterations = iterations[method];
    const remaining = await limiter.removeTokens(matchingIterations);
    if (remaining < 1) {
        const origin = req.headers.origin;
        res.status(429).json({message: "Too many requests", origin});
        return;
    }
    next();
}

export default CheckLimiter;