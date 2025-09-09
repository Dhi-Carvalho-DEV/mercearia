// produtos.js - gerencia produtos (list, add, edit, delete)
const API = "/api";

const nomeInput = document.getElementById("nome");
const categoriaInput = document.getElementById("categoria");
const precoInput = document.getElementById("preco");
const quantidadeInput = document.getElementById("quantidade");
const btnAddProduto = document.getElementById("btnAddProduto");
const listaProdutos = document.getElementById("listaProdutos");

async function carregarProdutos() {
  try {
    const res = await fetch(API + "/produtos");
    const produtos = await res.json();
    listaProdutos.innerHTML = produtos
      .map(
        (p) => `
      <tr>
        <td>${p.nome}</td>
        <td>${p.categoria || ""}</td>
        <td>R$ ${Number(p.preco).toFixed(2)}</td>
        <td>${p.quantidade}</td>
        <td>
          <button onclick="editarProduto(${p.id})">Editar</button>
          <button onclick="deletarProduto(${p.id})">Excluir</button>
        </td>
      </tr>
    `
      )
      .join("");
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

btnAddProduto.addEventListener("click", async () => {
  const nome = nomeInput.value.trim();
  const categoria = categoriaInput.value.trim();
  const preco = parseFloat(precoInput.value);
  const quantidade = parseInt(quantidadeInput.value);

  if (!nome || isNaN(preco) || isNaN(quantidade))
    return alert("Preencha os campos corretamente");

  try {
    await fetch(API + "/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome, categoria, preco, quantidade }),
    });
    nomeInput.value =
      categoriaInput.value =
      precoInput.value =
      quantidadeInput.value =
        "";
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
  }
});

window.editarProduto = async function (id) {
  try {
    const res = await fetch(API + "/produtos");
    const produtos = await res.json();
    const p = produtos.find((x) => x.id === id);
    if (!p) return alert("Produto não encontrado");
    const novoNome = prompt("Nome:", p.nome);
    if (novoNome === null) return;
    const novaCat = prompt("Categoria:", p.categoria || "");
    const novoPreco = prompt("Preço:", p.preco);
    const novaQtd = prompt("Quantidade:", p.quantidade);
    await fetch(API + "/produtos/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novoNome,
        categoria: novaCat,
        preco: parseFloat(novoPreco),
        quantidade: parseInt(novaQtd),
      }),
    });
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao editar produto:", err);
  }
};

window.deletarProduto = async function (id) {
  if (!confirm("Excluir produto?")) return;
  try {
    await fetch(API + "/produtos/" + id, { method: "DELETE" });
    carregarProdutos();
  } catch (err) {
    console.error("Erro ao deletar produto:", err);
  }
};

carregarProdutos();
