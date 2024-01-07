export const handleSignIn = async (req,res,bcrypt,db) => {
    try {
      const { email, password } = req.body;
  
      const hash = await db("login").select("hash").where("email", "=", email);
      if (bcrypt.compareSync(password, hash[0].hash)) {
        const user = await db("users").select("*").where("email", "=", email);
        res.json(user[0]);
      } else {
        res.status(400).json("wrong password entered");
      }
    } catch {
      res.status(500).json("email not exicts");
    }
  }