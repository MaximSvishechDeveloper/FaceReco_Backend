import jwt from "jsonwebtoken";

const handleSignIn = async (req, res, bcrypt, db) => {
  try {
    const { email, password } = req.body;

    const hash = await db("login").select("hash").where("email", "=", email);
    if (bcrypt.compareSync(password, hash[0].hash)) {
      const user = await db("users").select("*").where("email", "=", email);
      return user[0];
    } else {
      return Promise.reject("wrong password entered");
    }
  } catch {
    return Promise.reject("email not exicts");
  }
};

const getAuthTokenId = async (req, res) => {
  const { authorization } = req.headers;
  console.log(authorization);
  try {
    const decoded = await jwt.verify(authorization, process.env.SECRET);
    console.log("DECODE", decoded);
    if (decoded === null) {
      return res.status(400).json("Unathorized");
    }
    return res.json({ userId: decoded.id });
  } catch {
    return res.status(400).json("Unathorized");
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
    return { success: "true", userId: id, token };
  } catch {
    return Promise.reject("Couldnt create Session");
  }
};

export const signInAuthentication = (req, res, bcrypt, db) => {
  const { authorization } = req.headers;
  return authorization
    ? getAuthTokenId(req, res)
    : handleSignIn(req, res, bcrypt, db)
        .then((data) => createSessions(data))
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};
