import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { registerAuthentication } from "./controllers/register.js";
import { signInAuthentication } from "./controllers/signin.js";
import { handleImage, fetchImage } from "./controllers/image.js";
import {
  handleGetProfile,
  handleProfileUpdate,
} from "./controllers/profile.js";
import { requireAuth } from "./controllers/authorization.js";
import morgan from "morgan";

export const db = knex({
  client: "pg",
  connection: {
    connectString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB,
  },
});

dotenv.config();

const app = express();

app.use(morgan("combined"));

app.use(cors());

app.use(bodyParser.json());

app.get("/", async (req, res) => {
  try {
    const users = await db("users").select("*").returning("*");
    res.json(users);
  } catch {
    res.status(404).json("Fail");
  }
});

app.post("/signin", (req, res) => {
  signInAuthentication(req, res, bcrypt, db);
});

app.post("/profile/:id", requireAuth, (req, res) => {
  handleProfileUpdate(req, res, db);
});

app.get("/profile/:id", requireAuth, (req, res) => {
  handleGetProfile(req, res, db);
});

app.put("/image", requireAuth, (req, res) => {
  handleImage(req, res, db);
});
app.post("/imageUrl", requireAuth, (req, res) => {
  fetchImage(req, res);
});

app.post("/register", (req, res) => {
  registerAuthentication(req, res, bcrypt, db);
});

app.listen(3001, () => {
  console.log("working");
});
