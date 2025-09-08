const express = require("express");
const router = express.Router();
const { db } = require("../database");

function checkAuth(req, res, next) {
  const h = req.headers["authorization"] || "";
  if (h === "Bearer admin-token") return next();
  return res.status(401).json({ error: "Não autorizado" });
}

router.use(checkAuth);

// Registrar venda
router.post("/", (req, res) => {
  const { cliente_id, tipo_pagamento, itens } = req.body; // itens = [{produto_id, quantidade, preco_unitario}, ...]
  const total = itens.reduce((s, i) => s + i.quantidade * i.preco_unitario, 0);
  const data = new Date().toISOString();

  db.run(
    "INSERT INTO vendas (cliente_id, tipo_pagamento, total, data) VALUES (?, ?, ?, ?)",
    [cliente_id || null, tipo_pagamento, total, data],
    function (err) {
      if (err) return res.status(500).json({ error: "Erro ao inserir venda" });
      const vendaId = this.lastID;

      const stmt = db.prepare(
        "INSERT INTO itens_venda (venda_id, produto_id, quantidade, preco_unitario) VALUES (?, ?, ?, ?)"
      );
      itens.forEach((i) => {
        stmt.run(vendaId, i.produto_id, i.quantidade, i.preco_unitario);
        // decrementar estoque
        db.run("UPDATE produtos SET quantidade = quantidade - ? WHERE id = ?", [
          i.quantidade,
          i.produto_id,
        ]);
      });
      stmt.finalize(() => res.json({ id: vendaId }));
    }
  );
});

// Listar vendas simples
router.get("/", (req, res) => {
  db.all("SELECT * FROM vendas ORDER BY data DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: "Erro no DB" });
    res.json(rows);
  });
});

module.exports = router;
