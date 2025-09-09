const token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

const clienteSelect = document.getElementById("clienteSelect");
const itensContainer = document.getElementById("itensContainer");
const addItemBtn = document.getElementById("addItemBtn");
const totalInput = document.getElementById("total");
const valorRecebidoInput = document.getElementById("valorRecebido");
const trocoInput = document.getElementById("troco");
const vendaForm = document.getElementById("vendaForm");
const errorMsg = document.getElementById("errorMsg");

let produtos = [];
let itens = [];

// Buscar clientes e produtos
async function carregarDados() {
  try {
    const resClientes = await fetch("/api/clientes", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const clientes = await resClientes.json();
    clientes.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = c.nome;
      clienteSelect.appendChild(option);
    });

    const resProdutos = await fetch("/api/produtos", {
      headers: { Authorization: `Bearer ${token}` },
    });
    produtos = await resProdutos.json();
  } catch (err) {
    errorMsg.textContent = "Erro ao carregar dados";
  }
}
carregarDados();

// Adicionar item
addItemBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "item";

  const select = document.createElement("select");
  produtos.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.id;
    option.textContent = `${p.nome} (R$ ${p.preco}, Estoque: ${p.quantidade})`;
    select.appendChild(option);
  });

  const quantidade = document.createElement("input");
  quantidade.type = "number";
  quantidade.min = 1;
  quantidade.value = 1;

  const preco = document.createElement("input");
  preco.type = "number";
  preco.readOnly = true;

  select.addEventListener("change", () => {
    const produto = produtos.find((p) => p.id == select.value);
    preco.value = produto.preco;
    atualizarTotal();
  });

  quantidade.addEventListener("input", atualizarTotal);

  div.appendChild(select);
  div.appendChild(quantidade);
  div.appendChild(preco);

  itensContainer.appendChild(div);
  atualizarTotal();
});

// Atualizar total e troco
function atualizarTotal() {
  itens = [];
  let total = 0;
  document.querySelectorAll("#itensContainer .item").forEach((div) => {
    const select = div.querySelector("select");
    const quantidade = parseInt(div.querySelector("input[type=number]").value);
    const produto = produtos.find((p) => p.id == select.value);
    const preco = produto.preco * quantidade;
    total += preco;
    itens.push({ produto_id: produto.id, quantidade, preco: produto.preco });
  });
  totalInput.value = total.toFixed(2);
  atualizarTroco();
}

valorRecebidoInput.addEventListener("input", atualizarTroco);
function atualizarTroco() {
  const total = parseFloat(totalInput.value) || 0;
  const recebido = parseFloat(valorRecebidoInput.value) || 0;
  trocoInput.value = (recebido - total).toFixed(2);
}

// Finalizar venda
vendaForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cliente_id = clienteSelect.value;
  const tipo_pagamento = document.getElementById("tipoPagamento").value;
  const total = parseFloat(totalInput.value);

  try {
    const res = await fetch("/api/vendas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cliente_id, tipo_pagamento, itens, total }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Venda finalizada com sucesso!");
      window.location.reload();
    } else {
      errorMsg.textContent = data.error;
    }
  } catch (err) {
    errorMsg.textContent = "Erro ao finalizar venda";
  }
});
