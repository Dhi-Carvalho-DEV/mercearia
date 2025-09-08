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
  db.all("SELECT * FROM produntos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro no Banco de Dados" });
    res.json(rows);
  });
});

router.post("/", (req, res) => {
  const { nome, categoria, preco, quantidade } = req.body;
  db.run(
    "INSERT INTO produtos (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)",
    [nome, categoria, preco, quantidade],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Erro ao inserir novo produto" });
      res.json({ id: this.lastID });
    }
  );
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, categoria, preco, quantidade } = req.body;
  db.run(
    "UPDATE produtos SET nome=?, categoria=?, preco=?, quantidade=? WHERE id=?",
    [nome, categoria, preco, quantidade, id],
    function (err) {
      if (err)
        return res.status(500).json({ error: "Erro ao atualizar produto" });
      res.json({ changes: this.changes });
    }
  );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM produtos WHERE id=?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Erro ao deletar produto" });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
