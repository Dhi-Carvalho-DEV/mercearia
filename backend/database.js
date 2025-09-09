const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const db = new sqlite3.Database("./mercearia.db");

// Criação de tabelas
db.serialize(() => {
  // Usuário admin
  db.run(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    senha TEXT
  )`);

  // Produtos
  db.run(`CREATE TABLE IF NOT EXISTS produtos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT,
    preco REAL NOT NULL,
    quantidade INTEGER NOT NULL DEFAULT 0
  )`);

  // Clientes
  db.run(`CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT
  )`);

  // Vendas
  db.run(`CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente_id INTEGER,
    tipo_pagamento TEXT,
    total REAL,
    data TEXT
  )`);

  // Itens de venda
  db.run(`CREATE TABLE IF NOT EXISTS itens_venda (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    venda_id INTEGER,
    produto_id INTEGER,
    quantidade INTEGER,
    preco REAL
  )`);

  // Inserir admin padrão
  const senhaAdmin = "admin";
  db.get("SELECT * FROM usuarios WHERE username='admin'", (err, row) => {
    if (!row) {
      bcrypt.hash(senhaAdmin, 10, (err, hash) => {
        db.run("INSERT INTO usuarios (username, senha) VALUES (?, ?)", [
          "admin",
          hash,
        ]);
      });
    }
  });
});

module.exports = db;
