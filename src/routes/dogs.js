"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const mkdirp_1 = require("mkdirp");
const fs_1 = require("fs");
const pendingAvatar = "./uploads/pending/";
const resizedAvatar = "./uploads/avatars/";
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res.render("dogs.ejs", { title: "Home" });
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, callback) => {
        callback(null, pendingAvatar);
    },
    filename: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error("not supported image file"), "");
        }
        const timestamp = new Date().getTime();
        callback(null, (0, uuid_1.v4)() + "_" + timestamp + "." + file.originalname.split(".")[1]);
    },
});
const upload = (0, multer_1.default)({ storage, fileFilter: (req, file, callback) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        }
        else {
            callback(null, false);
        }
    }
});
router.post("/", (req, res) => {
    (0, mkdirp_1.sync)(pendingAvatar);
    (0, mkdirp_1.sync)(resizedAvatar);
    upload.array("file")(req, res, (err) => {
        if (err instanceof multer_1.default.MulterError) {
            res.status(400).json({ message: err.message });
        }
        else if (err) {
            res.status(400).json({ message: err });
        }
        else {
            const files = req.files;
            files.forEach((file) => {
                (0, sharp_1.default)(file.path)
                    .resize(200, 200)
                    .rotate(90)
                    .toFile(resizedAvatar + file.filename, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    (0, fs_1.unlink)(file.path, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                    });
                });
            });
            const data = req.body;
            res.send(Object.assign({}, data));
        }
    });
});
exports.default = router;
