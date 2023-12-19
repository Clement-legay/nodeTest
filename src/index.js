"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dogs_1 = __importDefault(require("./routes/dogs"));
var pokemon_1 = __importDefault(require("./routes/pokemon"));
var logger_1 = __importDefault(require("./middlewares/logger"));
var authentication_1 = __importDefault(require("./middlewares/authentication"));
var pickle_1 = __importDefault(require("./routes/pickle"));
var user_1 = __importDefault(require("./routes/user"));
var auth_1 = __importDefault(require("./routes/auth"));
var errorCatcher_1 = __importDefault(require("./middlewares/errorCatcher"));
var cookie_parser_1 = __importDefault(require("cookie-parser"));
var post_1 = __importDefault(require("./routes/post"));
var rateLimiter_1 = __importDefault(require("./middlewares/rateLimiter"));
var app = (0, express_1.default)();
var port = 3000;
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(rateLimiter_1.default);
app.use(errorCatcher_1.default);
app.use(logger_1.default);
app.use("/auth", auth_1.default);
app.use(authentication_1.default);
app.use("/dogs", dogs_1.default);
app.use("/pokemon", pokemon_1.default);
app.use("/pickle", pickle_1.default);
app.use("/user", user_1.default);
app.use("/post", post_1.default);
app.use(errorCatcher_1.default);
app.get("/ping", function (req, res) {
    res.status(200).json({ message: "pong" });
});
app.post("/round", function (req, res) {
    var body = req.body;
    if (body.number) {
        res.status(200).json({ numberRounded: Math.round(body.number) });
    }
});
app.listen(port, function () {
    console.log("Server running at http://localhost:".concat(port));
});
