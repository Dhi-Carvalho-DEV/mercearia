const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { init } = require("./database");

const app = express();
app.use(cors());
app.use(bodyParser.json());

init();

app.use("/api/auth", require("./routes/auth"));
app.use("/api/produtos", require("./routes/produtos"));
app.use("/api/clientes", require("./routes/clientes"));
app.use("/api/vendas", require("./routes/vendas"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
