const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../database");

const SECRET = "secret123";

router.post("/login", (req, res) => {
  const { username, senha } = req.body;
  db.get(
    "SELECT * FROM usuarios WHERE username=? AND senha=?",
    [username, senha],
    (err, row) => {
      if (row) {
        const token = jwt.sign({ id: row.id, username: row.username }, SECRET, {
          expiresIn: "1h",
        });
        res.json({ ok: true, token });
      } else {
        res.json({ ok: false, msg: "Usuário ou senha incorretos" });
      }
    }
  );
});

module.exports = router;
