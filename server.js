import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";
import { handleRegister } from "./controllers/register.js";
import { handleSignIn } from "./controllers/signin.js";
import { handleImage, fetchImage } from "./controllers/image.js";

export const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    port: 5432,
    user: "postgres",
    password: "12345",
    database: "smart-brain",
  },
});

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const users = await db("facerecodb").select("*").returning("*");
    res.json(users);
  } catch {
    res.status(404).json("Fail");
  }
});

app.post("/signin", (req, res) => {
  handleSignIn(req, res, bcrypt, db);
});

app.put("/image", (req, res) => {
  handleImage(req, res, db);
});
app.post("/imageUrl", (req, res) => {
  fetchImage(req, res);
});

app.post("/register", (req, res) => {
  handleRegister(req, res, bcrypt, db);
});

app.listen(3001, () => {
  console.log("working");
});
