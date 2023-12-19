import express from 'express';
import pokemon from "./Routes/pokemon";
import myLogger from "./Middlewares/logger";
import authentication from "./Middlewares/authentication";
import pickle from "./Routes/pickle";
import user from "./Routes/user";
import auth from "./Routes/auth";
import errorCatcher from "./Middlewares/errorCatcher";
import cookieParser from "cookie-parser";
import post from "./Routes/post";
import CheckLimiter from "./Middlewares/rateLimiter";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser());

app.use(CheckLimiter);

app.use(errorCatcher)
app.use(myLogger);


app.use("/auth", auth);

app.use(authentication);

app.use("/pokemon", pokemon);
app.use("/pickle", pickle);
app.use("/user", user);
app.use("/post", post);

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