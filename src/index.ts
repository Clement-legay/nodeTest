import express from 'express';
import myLogger from "./Middlewares/logger";
import authentication from "./Middlewares/authentication";
import user from "./Routes/user";
import auth from "./Routes/auth";
import errorCatcher from "./Middlewares/errorCatcher";
import cookieParser from "cookie-parser";
import file from "./Routes/file";
import CheckLimiter from "./Middlewares/rateLimiter";
import product from "./Routes/product";
import order from "./Routes/order";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(CheckLimiter);
app.use(errorCatcher)
app.use(myLogger);


app.use("/auth", auth);
app.use("/file", file)

app.use(authentication);
app.use("/product", product);
app.use("/order", order)
app.use("/user", user);

app.use(errorCatcher);

app.get("/ping", (req: express.Request, res: express.Response) => {
    res.status(200).json({ message: "pong" });
});

app.post("/round", (req: express.Request, res: express.Response) => {
    const body = req.body;
    if (body.number) {
        res.status(200).json({ numberRounded: Math.round(body.number) });
    }
})

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});