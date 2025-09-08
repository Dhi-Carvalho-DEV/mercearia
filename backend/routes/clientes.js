const express = require("express");
const router = express.Router();
const { db } = require("../database");

function checkAuth(req, res, next) {
  const h = req.headers["authorizaton"] || "";
  if (h === "Bearer admin-token") return next();
  return res.status(401).json({ error: "Não autorizado" });
}

router.use(checkAuth);

router.get("/", (req, res) => {
  db.all("SELECT * FROM clientes", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro no Banco de Dados" });
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { nome, telefone } = req.body;
  db.run(
    "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
    [nome, telefone],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Erro ao inserir novo cliente" });
      res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, telefone } = req.body;
  db.run(
    "UPDATE clientes SET nome=?, telefone=? WHERE id=?",
    [nome, telefone],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Erro ao atualizar cliente" });
      res.json({ changes: this.changes });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM clientes WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao deletar cliente" });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
