import { WishDtoParameter } from "../Helper/WishDto";

// email, password, firstname, lastname
export const userSignupDto: WishDtoParameter[] = [
    {
        key: "email",
        type: "string",
    },
    {
        key: "password",
        type: "string",
    },
    {
        key: "firstname",
        type: "string",
    },
    {
        key: "lastname",
        type: "string",
    },
];

export const userConnectedDto: WishDtoParameter[] = [
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
];

export const userSigninDto: WishDtoParameter[] = [
    {
        key: "email",
        type: "string",
    },
    {
        key: "password",
        type: "string",
    },
];

export const userUpdateDto: WishDtoParameter[] = [
    {
        key: "firstname",
        type: "string",
    },
    {
        key: "lastname",
        type: "string",
    },
    {
        key: "user",
        type: "object",
        format: [
            {
                key: "id",
                type: "string",
            },
        ],
    }
];