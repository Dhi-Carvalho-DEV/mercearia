// clientes.js - gerencia clientes
const API = "/api";

const nomeCli = document.getElementById("nome");
const telefoneCli = document.getElementById("telefone");
const btnAddCliente = document.getElementById("btnAddCliente");
const listaClientes = document.getElementById("listaClientes");

async function carregarClientes() {
  try {
    const res = await fetch(API + "/clientes");
    const clientes = await res.json();
    listaClientes.innerHTML = clientes
      .map(
        (c) => `
      <tr>
        <td>${c.nome}</td>
        <td>${c.telefone || ""}</td>
        <td>
          <button onclick="editarCliente(${c.id})">Editar</button>
          <button onclick="deletarCliente(${c.id})">Excluir</button>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

btnAddCliente.addEventListener("click", async () => {
  const nome = nomeCli.value.trim();
  const telefone = telefoneCli.value.trim();
  if (!nome) return alert("Nome é obrigatório");
  try {
    await fetch(API + "/clientes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, telefone }),
    });
    nomeCli.value = telefoneCli.value = "";
    carregarClientes();
  } catch (err) {
    console.error("Erro ao adicionar cliente:", err);
  }
});

window.editarCliente = async function (id) {
  try {
    const res = await fetch(API + "/clientes");
    const clientes = await res.json();
    const c = clientes.find((x) => x.id === id);
    if (!c) return alert("Cliente não encontrado");
    const novoNome = prompt("Nome:", c.nome);
    if (novoNome === null) return;
    const novoTel = prompt("Telefone:", c.telefone || "");
    await fetch(API + "/clientes/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: novoNome, telefone: novoTel }),
    });
    carregarClientes();
  } catch (err) {
    console.error("Erro ao editar cliente:", err);
  }
};

window.deletarCliente = async function (id) {
  if (!confirm("Excluir cliente?")) return;
  try {
    await fetch(API + "/clientes/" + id, { method: "DELETE" });
    carregarClientes();
  } catch (err) {
    console.error("Erro ao deletar cliente:", err);
  }
};

carregarClientes();
