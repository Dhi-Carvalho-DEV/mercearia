const express = require("express");
const router = express.Router();
const db = require("../database");
const auth = require("../middleware/authMiddleware");

// GET /api/produtos
router.get("/", auth, (req, res) => {
  db.all("SELECT * FROM produtos ORDER BY nome", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/produtos
router.post("/", auth, (req, res) => {
  const { nome, categoria, preco, quantidade } = req.body;
  if (!nome || preco == null || quantidade == null)
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  if (preco <= 0 || quantidade < 0)
    return res.status(400).json({ error: "Valores inválidos" });

  db.run(
    "INSERT INTO produtos (nome, categoria, preco, quantidade) VALUES (?, ?, ?, ?)",
    [nome, categoria || "", preco, quantidade],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nome, categoria, preco, quantidade });
    }
  );
});

// PUT /api/produtos/:id
router.put("/:id", auth, (req, res) => {
  const { nome, categoria, preco, quantidade } = req.body;
  if (!nome || preco == null || quantidade == null)
    return res.status(400).json({ error: "Campos obrigatórios ausentes" });
  if (preco <= 0 || quantidade < 0)
    return res.status(400).json({ error: "Valores inválidos" });

  db.run(
    "UPDATE produtos SET nome=?, categoria=?, preco=?, quantidade=? WHERE id=?",
    [nome, categoria, preco, quantidade, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE /api/produtos/:id
router.delete("/:id", auth, (req, res) => {
  db.run("DELETE FROM produtos WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
