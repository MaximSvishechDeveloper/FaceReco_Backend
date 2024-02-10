import jwt from "jsonwebtoken";

export const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    res.status(401).json("Unathorized");
  }
  const decoded = await jwt.verify(authorization, process.env.SECRET);
  if (decoded === null) {
    return res.status(400).json("Unathorized");
  }

  return next();
};
