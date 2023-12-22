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
import cors from "cors";
import helmet from "helmet";
import admin from "./Routes/admin";
import isAdminMiddleware from "./Middlewares/isAdmin";

const app = express();
const port = 3000;

// app.use(helmet());
// app.use(cors({
//     origin: "*", // allow all origins
//     methods: ["GET", "POST", "PUT", "DELETE"], // allow all methods
// }));

app.set("view engine", "ejs");
// app.set("trust proxy", 1);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieParser());
app.use(CheckLimiter);
app.use(errorCatcher)
app.use(myLogger);


app.use("/auth", auth);
app.use("/file", file)

app.use(authentication);
app.use("/admin", isAdminMiddleware, admin);

app.use("/product", product);
app.use("/order", order)
app.use("/account", user);

app.use(errorCatcher);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});