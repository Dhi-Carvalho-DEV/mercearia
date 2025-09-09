const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /api/produtos - listar todos
router.get("/", (req, res) => {
  db.all("SELECT * FROM produtos ORDER BY nome", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/produtos - criar
router.post("/", (req, res) => {
  const { nome, categoria, preco, quantidade } = req.body;
  if (!nome || preco == null || quantidade == null)
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  db.run(
    "INSERT INTO produtos (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)",
    [nome, categoria || "", preco, quantidade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nome, categoria, preco, quantidade });
    }
  );
});

// PUT /api/produtos/:id - editar
router.put("/:id", (req, res) => {
  const { nome, categoria, preco, quantidade } = req.body;
  db.run(
    "UPDATE produtos SET nome=?, categoria=?, preco=?, quantidade=? WHERE id=?",
    [nome, categoria, preco, quantidade, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE /api/produtos/:id - excluir
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM produtos WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
