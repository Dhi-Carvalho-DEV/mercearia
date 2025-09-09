const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/auth", require("./routes/auth"));
app.use("/api/produtos", require("./routes/produtos"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/vendas", require("./routes/vendas"));
app.use("/api/relatorios", require("./routes/relatorios"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.listen(PORT, () =>
  console.log(`Servidor rodando em http://localhost:${PORT}`)
);
