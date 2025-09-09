const express = require("express");
const router = express.Router();
const db = require("../database");
const auth = require("../middleware/authMiddleware");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// GET /api/relatorios/vendas
router.get("/vendas", auth, async (req, res) => {
  db.all("SELECT * FROM vendas", [], async (err, vendas) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Vendas");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Cliente", key: "cliente_id", width: 20 },
      { header: "Tipo Pagamento", key: "tipo_pagamento", width: 15 },
      { header: "Total", key: "total", width: 10 },
      { header: "Data", key: "data", width: 20 },
    ];

    vendas.forEach((v) => sheet.addRow(v));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=vendas.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  });
});

// GET /api/relatorios/clientes
router.get("/clientes", auth, async (req, res) => {
  db.all("SELECT * FROM clientes", [], async (err, clientes) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Clientes");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nome", key: "nome", width: 30 },
      { header: "Telefone", key: "telefone", width: 20 },
    ];

    clientes.forEach((c) => sheet.addRow(c));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=clientes.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  });
});

// GET /api/relatorios/estoque
router.get("/estoque", auth, async (req, res) => {
  db.all("SELECT * FROM produtos", [], async (err, produtos) => {
    if (err) return res.status(500).json({ error: err.message });

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Estoque");

    sheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Nome", key: "nome", width: 30 },
      { header: "Categoria", key: "categoria", width: 20 },
      { header: "Preço", key: "preco", width: 10 },
      { header: "Quantidade", key: "quantidade", width: 10 },
    ];

    produtos.forEach((p) => sheet.addRow(p));

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader("Content-Disposition", "attachment; filename=estoque.xlsx");
    await workbook.xlsx.write(res);
    res.end();
  });
});

module.exports = router;
