import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import knex from "knex";
import bcrypt from "bcryptjs";

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
  const users = await db("users").select("*").returning("*");
  res.json(users);
});

app.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;

    const hash = await db("login").select("hash").where("email", "=", email);
    if (bcrypt.compareSync(password, hash[0].hash)) {
      const user = await db("users").select("*").where("email", "=", email);
      res.json(user[0]);
    } else {
      res.status(400).json("wrong password exicts");
    }
  } catch {
    res.status(500).json("email not exicts");
  }
});

// app.get("/profile/:id", (req, res) => {
//   const { id } = req.params;
//   const user = users.find((x) => x.id === id);
//   if (user) {
//     return res.json(user);
//   } else {
//     return res.status(404).json("user not found");
//   }
// });

app.put("/image", async (req, res) => {
  try {
    const { id } = req.body;
    const response = await db("users")
      .where("id", "=", id)
      .increment("entries", 1)
      .returning("entries");
    res.json(response);
  } catch {
    res.status(400).json("failed to update image");
  }
});

app.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  var hash = bcrypt.hashSync(password, 8);

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        hash: hash,
      })
      .into("login")
      .returning("email")
      .then((loginEmail) => {
        return trx("users")
          .returning("*")
          .insert({
            email: loginEmail[0].email,
            name: name,
            joined: new Date(),
          })
          .then((user) => {
            res.json(user[0]);
          });
      })
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch(() => res.status(409).json("user aleady exicts"));
});

app.listen(3001, () => {
  console.log("working");
});
