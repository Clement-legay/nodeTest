"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dogs_1 = __importDefault(require("./routes/dogs"));
const pokemon_1 = __importDefault(require("./routes/pokemon"));
const pickle_1 = __importDefault(require("./routes/pickle"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
const port = 3000;
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use(myLogger);
app.use("/dogs", dogs_1.default);
app.use("/pokemon", pokemon_1.default);
app.use("/pickle", pickle_1.default);
app.use("/user", user_1.default);
app.get("/ping", (req, res) => {
    res.status(200).json({ message: "pong" });
});
app.post("/round", (req, res) => {
    const body = req.body;
    if (body.number) {
        res.status(200).json({ numberRounded: Math.round(body.number) });
    }
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
