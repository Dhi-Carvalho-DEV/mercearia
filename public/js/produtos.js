const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const produtoForm = document.getElementById("produtoForm");
const errorMsg = document.getElementById("errorMsg");
const produtosTable = document.querySelector("#produtosTable tbody");

let editId = null;

async function carregarProdutos() {
  const res = await fetch("/api/produtos", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const produtos = await res.json();
  produtosTable.innerHTML = "";
  produtos.forEach((p) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${p.id}</td>
      <td>${p.nome}</td>
      <td>${p.categoria}</td>
      <td>${p.preco.toFixed(2)}</td>
      <td>${p.quantidade}</td>
      <td>
        <button onclick="editarProduto(${p.id}, '${p.nome}', '${
      p.categoria
    }', ${p.preco}, ${p.quantidade})">Editar</button>
        <button onclick="deletarProduto(${p.id})">Excluir</button>
      </td>
    `;
    produtosTable.appendChild(tr);
  });
}

function editarProduto(id, nome, categoria, preco, quantidade) {
  document.getElementById("produtoId").value = id;
  document.getElementById("nome").value = nome;
  document.getElementById("categoria").value = categoria;
  document.getElementById("preco").value = preco;
  document.getElementById("quantidade").value = quantidade;
  editId = id;
}

async function deletarProduto(id) {
  if (!confirm("Deseja realmente excluir?")) return;
  await fetch(`/api/produtos/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });
  carregarProdutos();
}

produtoForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value;
  const categoria = document.getElementById("categoria").value;
  const preco = parseFloat(document.getElementById("preco").value);
  const quantidade = parseInt(document.getElementById("quantidade").value);

  const body = { nome, categoria, preco, quantidade };
  const url = editId ? `/api/produtos/${editId}` : "/api/produtos";
  const method = editId ? "PUT" : "POST";

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
    produtoForm.reset();
    editId = null;
    carregarProdutos();
  } else {
    errorMsg.textContent = data.error;
  }
});

carregarProdutos();
