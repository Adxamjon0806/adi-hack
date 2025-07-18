import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import router from "./router.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url); // абсолютный путь к файлу
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
dotenv.config();

app.use(cors());
app.use(bodyParser.json({ limit: "5mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "5mb" }));
app.use("", router);

const dbUri = process.env.MONGO_DB_KEY;

const start = async () => {
  try {
    await mongoose.connect(dbUri);

    app.listen(port, () => {
      console.log(`Сервер работает на http://localhost:${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

export { __dirname };
