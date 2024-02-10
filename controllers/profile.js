export const handleGetProfile = async (req, res, db) => {
  const { id } = req.params;

  try {
    const user = await db("users").where("id", id);
    console.log(user);
    res.json(user[0]);
  } catch {
    res.status(404).json("User Not Found");
  }
};

export const handleProfileUpdate = async (req, res, db) => {
  const { id } = req.params;

  const { name, age, pet } = req.body;

  try {
    await db("users")
      .where("id", id)
      .update({ name: name, age: age, pet: pet });
    res.json("Success");
  } catch (error) {
    res.status(400).json(error.message);
  }
};
