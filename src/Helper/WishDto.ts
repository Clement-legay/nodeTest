import {Response} from "express";

export type WishDtoParameter = {
    key: string,
    type: "string" | "number" | "boolean" | "object" | "objectArray",
    format?: WishDtoParameter[],
}

export const WishDto = (parameterList: WishDtoParameter[], requestBody: any, res?: Response): boolean => {
    try {
        parameterList.forEach((parameter: WishDtoParameter) => {
            if (requestBody[parameter.key] === undefined) {
                throw new Error(`Missing parameter: ${parameter.key}`);
            }
            if (parameter.type === "object") {
                if (parameter.format) {
                    if (!WishDto(parameter.format, requestBody[parameter.key])) {
                        throw new Error(`Invalid parameter: ${parameter.key}`);
                    }
                }
            } else if (parameter.type === "objectArray") {
                if (parameter.format) {
                    if (!Array.isArray(requestBody[parameter.key])) {
                        throw new Error(`Invalid parameter: ${parameter.key}`);
                    }
                    requestBody[parameter.key].forEach((object: any) => {
                        if (!WishDto(parameter.format as WishDtoParameter[], object)) {
                            throw new Error(`Invalid parameter: ${parameter.key}`);
                        }
                    });
                }
            } else {
                switch (parameter.type) {
                    case "number":
                        const regexNumber = new RegExp("^[0-9]+$");
                        if (!regexNumber.test(requestBody[parameter.key])) {
                            throw new Error(`Invalid parameter: ${parameter.key}`);
                        }
                        break;
                    case "boolean":
                        const regexBoolean = new RegExp("^(true|false)$");
                        if (!regexBoolean.test(requestBody[parameter.key])) {
                            throw new Error(`Invalid parameter: ${parameter.key}`);
                        }
                        break;
                    default:
                        break;
                }
            }
        });
        return true;
    } catch (e: any) {
        if (res) res.status(400).json({message: e.message});
        return false;
    }
}