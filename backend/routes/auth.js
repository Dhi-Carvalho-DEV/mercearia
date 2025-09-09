const express = require("express");
const router = express.Router();
const db = require("../database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const SECRET = "MERCEARIA_SECRET_2025"; // pode ser variável de ambiente

// POST /api/auth/login
router.post("/login", (req, res) => {
  const { username, senha } = req.body;
  if (!username || !senha)
    return res.status(400).json({ error: "Campos obrigatórios" });

  db.get("SELECT * FROM usuarios WHERE username=?", [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: "Usuário não encontrado" });

    bcrypt.compare(senha, user.senha, (err, match) => {
      if (!match) return res.status(401).json({ error: "Senha incorreta" });
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET, {
        expiresIn: "8h",
      });
      res.json({ token, username: user.username });
    });
  });
});

module.exports = router;
