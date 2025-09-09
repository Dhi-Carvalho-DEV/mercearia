const express = require("express");
const router = express.Router();
const db = require("../database");
const auth = require("../middleware/authMiddleware");

// GET /api/vendas
router.get("/", auth, (req, res) => {
  const sql = `
    SELECT v.id, v.cliente_id, c.nome AS cliente, v.tipo_pagamento, v.total, v.data
    FROM vendas v
    LEFT JOIN clientes c ON v.cliente_id = c.id
    ORDER BY v.data DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST /api/vendas
router.post("/", auth, (req, res) => {
  const { cliente_id, tipo_pagamento, itens, total } = req.body;
  if (!itens || !Array.isArray(itens) || itens.length === 0)
    return res.status(400).json({ error: "Itens da venda obrigatórios" });
  if (total <= 0) return res.status(400).json({ error: "Total inválido" });

  const data = new Date().toISOString();
  db.run(
    "INSERT INTO vendas (cliente_id, tipo_pagamento, total, data) VALUES (?, ?, ?, ?)",
    [cliente_id || null, tipo_pagamento || "DINHEIRO", total, data],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      const venda_id = this.lastID;

      // Inserir itens da venda e decrementar estoque
      const stmt = db.prepare(
        "INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco) VALUES (?, ?, ?, ?)"
      );
      itens.forEach((item) => {
        if (item.quantidade <= 0) return;
        stmt.run(venda_id, item.produto_id, item.quantidade, item.preco);

        // Decrementa quantidade de produto
        db.run("UPDATE produtos SET quantidade = quantidade - ? WHERE id=?", [
          item.quantidade,
          item.produto_id,
        ]);
      });
      stmt.finalize();

      res.json({ venda_id });
    }
  );
});

module.exports = router;
