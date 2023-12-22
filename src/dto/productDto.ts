import { WishDtoParameter } from "../Helper/WishDto";

// name, price, description, imagePaths
export const productCreateDto: WishDtoParameter[] = [
    {
        key: "name",
        type: "string",
    },
    {
        key: "price",
        type: "number",
    },
    {
        key: "description",
        type: "string",
    },
    {
        key: "imagePaths",
        type: "string",
    },
];

export const productUpdateDto: WishDtoParameter[] = [
    {
        key: "name",
        type: "string",
    },
    {
        key: "price",
        type: "number",
    },
    {
        key: "description",
        type: "string",
    },
    {
        key: "imagePaths",
        type: "string",
    },
];