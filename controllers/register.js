import jwt from "jsonwebtoken";

const handleRegister = async (req, res, bcrypt, db) => {
  const { name, email, password } = req.body;
  var hash = bcrypt.hashSync(password, 8);

  try {
    return await db.transaction(async (trx) => {
      const loginEmail = await trx
        .insert({
          email: email,
          hash: hash,
        })
        .into("login")
        .returning("email");

      const user = await trx("users").returning("*").insert({
        email: loginEmail[0].email,
        name: name,
        joined: new Date(),
      });

      return user[0];
    });
  } catch (error) {
    throw new Error("User already exists");
  }
};

const signToken = async (email, id) => {
  console.log("Was here");
  const jwtPayLoad = { email, id };
  console.log(jwtPayLoad);
  const token = await jwt.sign(jwtPayLoad, process.env.SECRET, {
    expiresIn: "2 days",
  });

  console.log(token);

  return token;
};

const createSessions = async (user) => {
  try {
    const { email, id } = user;
    const token = await signToken(email, id);
    console.log(token);
    return { success: "true", user, userId: id, token };
  } catch {
    return Promise.reject("Couldnt create Session");
  }
};

export const registerAuthentication = (req, res, bcrypt, db) => {
  handleRegister(req, res, bcrypt, db)
    .then((data) => createSessions(data))
    .then((session) => res.json(session))
    .catch((err) => res.status(400).json(err));
};
