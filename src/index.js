"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var dogs_1 = require("./routes/dogs");
var pokemon_1 = require("./routes/pokemon");
var pickle_1 = require("./routes/pickle");
var user_1 = require("./routes/user");
var app = (0, express_1.default)();
var port = 3000;
app.set("view engine", "ejs");
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// app.use(myLogger);
app.use("/dogs", dogs_1.default);
app.use("/pokemon", pokemon_1.default);
app.use("/pickle", pickle_1.default);
app.use("/user", user_1.default);
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
