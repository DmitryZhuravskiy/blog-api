import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";

mongoose
  .connect(
    "mongodb+srv://admin:123qwe@cluster0.hcqxx8q.mongodb.net/blog?retryWrites=true&w=majority"
  )
  .then(() => console.log("DB is working"))
  .catch((err) => console.log("DB is error", err));

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dobro poshalovat!");
});

app.post("/auth/register", registerValidation, UserController.register);

app.post("/auth/login", UserController.login);

app.get("/auth/me", checkAuth, UserController.getMe);

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("Sever is working");
});
