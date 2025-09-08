const express = require("express");
const router = express.Router();
const { db } = require("../database");

router.post("/login", (req, res) => {
  const { username, senha } = req.body;
  db.get(
    "SELECT * FROM usuarios WHERE username = ? AND senha = ?",
    [username, senha],
    (err, row) => {
      if (err) return res.status(500).json({ error: "Erro no servidor" });
      if (!row)
        return res
          .status(401)
          .json({ ok: false, msg: "Credenciais inválidas" });

      return res.json({
        ok: true,
        token: "admin-token",
        username: row.username,
      });
    }
  );
});

module.exports = router;
