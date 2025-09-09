const express = require("express");
const router = express.Router();
const db = require("../database");
const ExcelJS = require("exceljs");
const PDFDocument = require("pdfkit");

// gerar PDF simples
function gerarPDF(res, titulo, colunas, dados) {
  const doc = new PDFDocument({ margin: 30, size: "A4" });
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${titulo}.pdf"`);
  doc.pipe(res);

  doc.fontSize(18).text(titulo, { align: "center" });
  doc.moveDown();

  // tabela simples
  doc.fontSize(10);
  const header = colunas.join(" | ");
  doc.text(header);
  doc.moveDown(0.5);

  dados.forEach((row) => {
    doc.text(row.join(" | "));
  });

  doc.end();
}

// gerar Excel
async function gerarExcel(res, titulo, colunas, dados) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Relatório");

  sheet.addRow(colunas);
  dados.forEach((r) => sheet.addRow(r));

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", `attachment; filename="${titulo}.xlsx"`);
  await workbook.xlsx.write(res);
  res.end();
}

// Vendas
router.get("/vendas/:formato", (req, res) => {
  const formato = req.params.formato;
  db.all(
    `SELECT v.id, v.data, v.tipo_pagamento, c.nome as cliente, v.total
          FROM vendas v LEFT JOIN clientes c ON v.cliente_id = c.id
          ORDER BY v.data DESC`,
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const colunas = ["ID", "Data", "Tipo", "Cliente", "Total"];
      const dados = rows.map((r) => [
        r.id,
        r.data,
        r.tipo_pagamento,
        r.cliente || "-",
        r.total,
      ]);
      if (formato === "pdf")
        gerarPDF(res, "Relatório de Vendas", colunas, dados);
      else if (formato === "excel")
        gerarExcel(res, "Relatório de Vendas", colunas, dados);
      else res.status(400).json({ error: "Formato inválido" });
    }
  );
});

// Clientes
router.get("/clientes/:formato", (req, res) => {
  const formato = req.params.formato;
  db.all(
    "SELECT id, nome, telefone FROM clientes ORDER BY nome",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const colunas = ["ID", "Nome", "Telefone"];
      const dados = rows.map((r) => [r.id, r.nome, r.telefone]);
      if (formato === "pdf")
        gerarPDF(res, "Relatório de Clientes", colunas, dados);
      else if (formato === "excel")
        gerarExcel(res, "Relatório de Clientes", colunas, dados);
      else res.status(400).json({ error: "Formato inválido" });
    }
  );
});

// Estoque
router.get("/estoque/:formato", (req, res) => {
  const formato = req.params.formato;
  db.all(
    "SELECT id, nome, categoria, preco, quantidade FROM produtos ORDER BY nome",
    [],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      const colunas = ["ID", "Produto", "Categoria", "Preço", "Quantidade"];
      const dados = rows.map((r) => [
        r.id,
        r.nome,
        r.categoria || "-",
        r.preco,
        r.quantidade,
      ]);
      if (formato === "pdf")
        gerarPDF(res, "Relatório de Estoque", colunas, dados);
      else if (formato === "excel")
        gerarExcel(res, "Relatório de Estoque", colunas, dados);
      else res.status(400).json({ error: "Formato inválido" });
    }
  );
});

module.exports = router;
