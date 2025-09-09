const express = require("express");
const router = express.Router();
const db = require("../database");

// GET /api/clientes
router.get("/", (req, res) => {
  db.all("SELECT * FROM clientes ORDER BY nome", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/clientes
router.post("/", (req, res) => {
  const { nome, telefone } = req.body;
  if (!nome) return res.status(400).json({ error: "Nome é obrigatório" });
  db.run(
    "INSERT INTO clientes (nome, telefone) VALUES (?, ?)",
    [nome, telefone || ""],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, nome, telefone });
    }
  );
});

// PUT /api/clientes/:id
router.put("/:id", (req, res) => {
  const { nome, telefone } = req.body;
  db.run(
    "UPDATE clientes SET nome=?, telefone=? WHERE id=?",
    [nome, telefone, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE /api/clientes/:id
router.delete("/:id", (req, res) => {
  db.run("DELETE FROM clientes WHERE id=?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ deleted: this.changes });
  });
});

module.exports = router;
