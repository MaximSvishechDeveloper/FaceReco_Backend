export const handleRegister = async (req,res,bcrypt,db) => {
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
          return trx("facerecodb")
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
  }