import express from "express";
import multer from "multer";
import { v4 } from "uuid";
import sharp from "sharp";
import { sync } from "mkdirp";
import { unlink } from "fs";

const pendingAvatar = "./uploads/pending/";
const resizedAvatar = "./uploads/avatars/";

const router = express.Router();

router.get("/", (req, res) => {
    res.render("dogs.ejs", { title: "Home" });
});

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, pendingAvatar);
    },
    filename: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
            return callback(new Error("not supported image file"), "");
        }
        const timestamp = new Date().getTime();
        callback(null, v4() + "_" + timestamp + "." + file.originalname.split(".")[1]);
    },
});

const upload = multer({ storage, fileFilter: (req, file, callback) => {
        if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
            callback(null, true);
        } else {
            callback(null, false);
        }
    }
});

router.post("/", (req, res) => {
    sync(pendingAvatar);
    sync(resizedAvatar);
    upload.array("file") (req, res, (err) => {
        if (err instanceof multer.MulterError) {
            res.status(400).json({ message: err.message });
        } else if (err) {
            res.status(400).json({ message: err });
        } else {
            const files = req.files as Express.Multer.File[];
            files.forEach((file) => {
                sharp(file.path)
                    .resize(200, 200)
                    .rotate(90)
                    .toFile(resizedAvatar + file.filename, (err) => {
                        if (err) {
                            console.log(err.message);
                        }
                        unlink(file.path, (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                        });
                    });
            });

            const data = req.body;
            res.send({ ...data });
        }
    });
});

export default router;