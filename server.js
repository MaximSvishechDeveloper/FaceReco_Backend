import express from "express";
import bodyParser from "body-parser";
import { users, validateLogin, validateRegister } from "./users.js";
import cors from 'cors'

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json(users);
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  if (validateLogin(email, password)) {
    const user = users.find(x => x.email === email && password === password)
    const { password:userPassword, ...newUser } = user;
    res.json(newUser);
  } else {
    res.status(404).json("user not found");
  }
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  const user = users.find((x) => x.id === id);
  if (user) {
    return res.json(user);
  } else {
    return res.status(404).json("user not found");
  }
});

app.put('/image',(req,res)=> {
  const {id} = req.body;
  const user = users.find((x) => x.id === id);
  if (user) {
    user.entiries++
    return res.json(user.entiries);
}else{
  return res.status(404).json("user not found");
}})

app.post("/register", (req, res) => {
  const { name, email } = req.body;

  const user = {
    id: (users.length + 1).toString(),
    name: name,
    email: email,
    entiries: 0,
    joined: new Date(),
  };

  if (validateRegister(email)) {
    users.push(user);
    res.json(user);
  } else {
    res.status(409).json("user aleady exicts");
  }
});

app.listen(3001, () => {
  console.log("working");
});
