const clienteForm = document.getElementById("clienteForm");
const clientesTable = document.querySelector("#clientesTable tbody");
const errorMsgCliente = document.getElementById("errorMsg");

let editClienteId = null;

async function carregarClientes() {
  const res = await fetch("/api/clientes", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const clientes = await res.json();
  clientesTable.innerHTML = "";
  clientes.forEach((c) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${c.id}</td>
      <td>${c.nome}</td>
      <td>${c.telefone || ""}</td>
      <td>
        <button onclick="editarCliente(${c.id}, '${c.nome}', '${
      c.telefone || ""
    }')">Editar</button>
        <button onclick="deletarCliente(${c.id})">Excluir</button>
      </td>
    `;
    clientesTable.appendChild(tr);
  });
}

function editarCliente(id, nome, telefone) {
  document.getElementById("clienteId").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("telefone").value = telefone;
  editClienteId = id;
}

async function deletarCliente(id) {
  if (!confirm("Deseja realmente excluir?")) return;
  await fetch(`/api/clientes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  carregarClientes();
}

clienteForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const telefone = document.getElementById("telefone").value;

  const body = { nome, telefone };
  const url = editClienteId
    ? `/api/clientes/${editClienteId}`
    : "/api/clientes";
  const method = editClienteId ? "PUT" : "POST";

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (res.ok) {
    clienteForm.reset();
    editClienteId = null;
    carregarClientes();
  } else {
    errorMsgCliente.textContent = data.error;
  }
});

carregarClientes();
