"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var multer_1 = require("multer");
var uuid_1 = require("uuid");
var sharp_1 = require("sharp");
var mkdirp_1 = require("mkdirp");
var fs_1 = require("fs");
var pendingAvatar = "./uploads/pending/";
var resizedAvatar = "./uploads/avatars/";
var router = express_1.default.Router();
router.get("/", function (req, res) {
    res.render("dogs.ejs", { title: "Home" });
});
var storage = multer_1.default.diskStorage({
    destination: function (req, file, callback) {
        callback(null, pendingAvatar);
    },
    filename: function (req, file, callback) {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error("not supported image file"), "");
        }
        var timestamp = new Date().getTime();
        callback(null, (0, uuid_1.v4)() + "_" + timestamp + "." + file.originalname.split(".")[1]);
    },
});
var upload = (0, multer_1.default)({ storage: storage, fileFilter: function (req, file, callback) {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    }
});
router.post("/", function (req, res) {
    (0, mkdirp_1.sync)(pendingAvatar);
    (0, mkdirp_1.sync)(resizedAvatar);
    upload.array("file")(req, res, function (err) {
        if (err instanceof multer_1.default.MulterError) {
            res.status(400).json({ message: err.message });
        }
        else if (err) {
            res.status(400).json({ message: err });
        }
        else {
            var files = req.files;
            files.forEach(function (file) {
                (0, sharp_1.default)(file.path)
                    .resize(200, 200)
                    .rotate(90)
                    .toFile(resizedAvatar + file.filename, function (err) {
                    if (err) {
                        console.log(err.message);
                    }
                    (0, fs_1.unlink)(file.path, function (err) {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });
            });
            var data = req.body;
            res.send(__assign({}, data));
        }
    });
});
exports.default = router;
