import { Response } from 'express';
import {Prisma} from "@prisma/client";

export const safeExecutionWrapper = async <T>(res: Response, fn: () => Promise<T>): Promise<void> => {
    try {
        await fn();
    } catch (e: any) {
        res.status(500).json({message: parsePrismaError(e)});
    }
}

const parsePrismaError = (e: any): string => {
    const error = e as Prisma.PrismaClientKnownRequestError;
    switch (error.code) {
        case "P2002":
            return "Unique constraint failed";
        case "P2025":
            return "Foreign key constraint failed";
        default:
            return "Unknown error";
    }
}