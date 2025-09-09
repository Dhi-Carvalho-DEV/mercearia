const express = require("express");
const router = express.Router();
const db = require("../database");

// POST /api/vendas - registrar venda e decrementar estoque
router.post("/", (req, res) => {
  const { itens, tipo, cliente, total } = req.body;
  if (!Array.isArray(itens) || itens.length === 0)
    return res.status(400).json({ error: "Itens inválidos" });

  db.run(
    'INSERT INTO vendas (cliente_id, tipo_pagamento, total, data) VALUES (?, ?, ?, datetime("now"))',
    [cliente || null, tipo || "dinheiro", total || 0],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      const vendaId = this.lastID;
      const stmt = db.prepare(
        "INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)"
      );

      itens.forEach((item) => {
        stmt.run([vendaId, item.id, item.quantidade, item.preco]);

        // Decrementar estoque (não verifica negativo aqui — poderia acrescentar validação)
        db.run("UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?", [
          item.quantidade,
          item.id,
        ]);
      });

      stmt.finalize((err2) => {
        if (err2) return res.status(500).json({ error: err2.message });
        res.json({ ok: true, vendaId });
      });
    }
  );
});

// GET /api/vendas - listar vendas simples
router.get("/", (req, res) => {
  db.all("SELECT * FROM vendas ORDER BY data DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

module.exports = router;
