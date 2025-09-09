const jwt = require("jsonwebtoken");
const SECRET = "MERCEARIA_SECRET_2025";

function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ error: "Token não fornecido" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Token inválido" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err)
      return res.status(403).json({ error: "Token expirado ou inválido" });
    req.user = decoded;
    next();
  });
}

module.exports = authMiddleware;
