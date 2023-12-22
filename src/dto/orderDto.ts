import { WishDtoParameter } from "../Helper/WishDto";

export const orderCreateDto: WishDtoParameter[] = [
    {
        key: "user",
        type: "object",
        format: [
            {
                key: "id",
                type: "string",
            },
        ],
    },
    {
        key: "productArray",
        type: "objectArray",
        format: [
            {
                key: "productId",
                type: "string",
            },
            {
                key: "quantity",
                type: "number",
            },
        ],
    },
];

export const orderUpdateDto: WishDtoParameter[] = [
    {
        key: "user",
        type: "object",
        format: [
            {
                key: "id",
                type: "string",
            },
        ],
    },
    {
        key: "productArray",
        type: "object",
        format: [
            {
                key: "productId",
                type: "string",
            },
            {
                key: "quantity",
                type: "number",
            },
        ],
    },
];