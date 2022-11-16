import express from "express";
import mongoose from "mongoose";
import fs from 'fs';
import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";
import { UserController, PostController } from "./controllers/index.js";
import multer from "multer";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import cors from "cors";

mongoose
  .connect(
    "mongodb+srv://admin:123qwe@cluster0.hcqxx8q.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB is working"))
  .catch((err) => console.log("DB is error", err));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.get("/", (req, res) => {
  res.send("Dobro poshalovat!");
});

app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.post("/upload", upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`
  });
});

app.get('/tags', PostController.getLastTags);
app.get("/posts", PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get("/posts/:id", PostController.getOne);
app.post("/posts", checkAuth, handleValidationErrors, PostController.create);
app.delete("/posts/:id", checkAuth, PostController.remove);
app.patch(
  "/posts/:id",
  checkAuth,
  handleValidationErrors,
  PostController.update
);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Sever is working");
});
