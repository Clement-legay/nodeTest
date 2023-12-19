import express from 'express';
import dogs from "./routes/dogs";
import pokemon from "./routes/pokemon";
import myLogger from "./middlewares/logger";
import authentication from "./middlewares/authentication";
import pickle from "./routes/pickle";
import user from "./routes/user";

const app = express();
const port = 3000;

app.set("view engine", "ejs");

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use(myLogger);

app.use("/dogs", dogs);
app.use("/pokemon", pokemon);
app.use("/pickle", pickle);
app.use("/user", user);

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