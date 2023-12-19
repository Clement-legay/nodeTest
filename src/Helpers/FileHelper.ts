import { Response, Request } from "express";
import multer from "multer";
import { v4 } from "uuid";
import sharp from "sharp";
import { sync } from "mkdirp";
import { unlink } from "fs";

const PENDING = "./uploads/pending/";
const DEFAULT_OUTPUT = "./uploads/images/";

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

const checkFolders = (path: string) => {
    sync(PENDING);
    sync(path);
}

type resizedDimensions = {
    width: number,
    height: number | undefined
}

export const SaveImageHelper = (req: Request, res: Response, dimensions: resizedDimensions, outputFolderPath: string = DEFAULT_OUTPUT) => {
    checkFolders(outputFolderPath);
    const imagesPath: string[] = [];
    upload.array("file") (req, res, (err) => {
        console.log("hola");
        if (err instanceof multer.MulterError) {
            res.status(400).json({ message: err.message });
        } else if (err) {
            res.status(400).json({ message: err });
        } else {
            console.log(req.files);
            const files = req.files as Express.Multer.File[];
            files.forEach((file) => {
                console.log(file);
                sharp(file.path)
                    .resize(dimensions.width, dimensions.height)
                    .rotate(90)
                    .toFile(outputFolderPath + file.filename, (err) => {
                        if (err) {
                            throw new Error(err.message);
                        }
                        unlink(file.path, (err) => {
                            if (err) {
                                throw new Error(err.message);
                            }
                        });
                        imagesPath.push(outputFolderPath + file.filename);
                    });
            });
        }
    });
    const data = req.body;
    return { ...data, imagesPath };
}