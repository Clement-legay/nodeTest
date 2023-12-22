import { Request, Response, NextFunction } from "express";
import multer from "multer";
import { v4 } from "uuid";
import sharp from "sharp";
import { sync } from "mkdirp";
import { unlink } from "fs";

const PENDING = "./uploads/pending/";
const DEFAULT = "./uploads/default/";

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, PENDING);
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

const checkFolder = (path: string) => {
    sync(PENDING);
    sync(path);
}

const FileHelper = (req: Request, res: Response, next: NextFunction) => {
    try {
        const previousData = req.body;
        checkFolder(DEFAULT)
        const imagePaths: string[] = [];
        upload.array("file") (req, res, (err) => {
            if (err) {
                next(err);
            } else {
                const files = req.files as Express.Multer.File[];
                files.forEach((file) => {
                    sharp(file.path)
                        .resize(200, 200)
                        .toFile(DEFAULT + file.filename, (err) => {
                            if (err) {
                                console.log(err.message);
                            }
                            unlink(file.path, (err) => {
                                if (err) {
                                    console.log(err.message);
                                }
                            });
                        });
                    imagePaths.push(DEFAULT + file.filename);
                });

                req.body.imagePaths = imagePaths;
                req.body = { ...previousData, ...req.body };
                next()
            }
        });
    } catch (e: any) {
        next(e);
    }
}

export default FileHelper;