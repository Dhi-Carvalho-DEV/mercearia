const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./mercearia.db");

function init() {
  db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      senha TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS produtos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      categoria TEXT,
      preco REAL,
      quantidade INTEGER
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT,
      telefone TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS vendas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER,
      tipo_pagamento TEXT,
      total REAL,
      data TEXT,
      FOREIGN KEY(cliente_id) REFERENCES clientes(id)
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS itens_venda (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      venda_id INTEGER,
      produto_id INTEGER,
      quantidade INTEGER,
      preco_unitario REAL,
      FOREIGN KEY(venda_id) REFERENCES vendas(id),
      FOREIGN KEY(produto_id) REFERENCES produtos(id)
    )`);

    db.get(
      "SELECT * FROM usuarios WHERE username = ?",
      ["admin"],
      (err, row) => {
        if (!row) {
          db.run("INSERT INTO usuarios (username, senha) VALUES (?, ?)", [
            "admin",
            "admin",
          ]);
          console.log("Usuário admin criado: admin / admin");
        }
      }
    );
  });
}

module.exports = { db, init };
