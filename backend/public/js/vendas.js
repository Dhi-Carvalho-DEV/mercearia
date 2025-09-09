// vendas.js - adicionar itens, calcular total, troco, validar e finalizar venda
const API = "/api";

const selectProduto = document.getElementById("produto");
const inputQtd = document.getElementById("quantidade");
const btnAddProduto = document.getElementById("btnAddProduto");
const tabelaItens = document.getElementById("itens");
const totalSpan = document.getElementById("total");
const inputValorRecebido = document.getElementById("valorRecebido");
const trocoSpan = document.getElementById("troco");
const selectTipo = document.getElementById("tipo");
const selectCliente = document.getElementById("cliente");
const btnFinalizar = document.getElementById("btnFinalizar");

let produtos = [];
let itensVenda = [];
let produtosEstoque = {};
let total = 0;

async function carregarProdutos() {
  try {
    const res = await fetch(API + "/produtos");
    produtos = await res.json();
    produtosEstoque = {};
    selectProduto.innerHTML = produtos
      .map((p) => {
        produtosEstoque[p.id] = p.quantidade;
        const low = p.quantidade <= 5 && p.quantidade > 0;
        const out = p.quantidade === 0;
        const cls = out ? "out-of-stock" : low ? "low-stock" : "";
        const disabled = out ? "disabled" : "";
        return `<option value="${p.id}" data-preco="${p.preco}" class="${cls}" ${disabled}>${p.nome} (Qtd: ${p.quantidade})</option>`;
      })
      .join("");
  } catch (err) {
    console.error("Erro ao carregar produtos:", err);
  }
}

async function carregarClientes() {
  try {
    const res = await fetch(API + "/clientes");
    const clientes = await res.json();
    selectCliente.innerHTML =
      '<option value="">(Nenhum)</option>' +
      clientes
        .map((c) => `<option value="${c.id}">${c.nome}</option>`)
        .join("");
  } catch (err) {
    console.error("Erro ao carregar clientes:", err);
  }
}

btnAddProduto.addEventListener("click", () => {
  const id = selectProduto.value;
  if (!id) return alert("Selecione um produto");
  const preco = parseFloat(selectProduto.selectedOptions[0].dataset.preco);
  const qtd = parseInt(inputQtd.value);
  if (!qtd || qtd <= 0) return alert("Informe a quantidade");
  if (qtd > (produtosEstoque[id] || 0))
    return alert("Quantidade indisponível em estoque");

  const nome = selectProduto.selectedOptions[0].text.split(" (")[0];
  itensVenda.push({ id, nome, preco, quantidade: qtd });

  // reduzir estoque localmente
  produtosEstoque[id] -= qtd;
  atualizarTabela();
  atualizarSelectComEstoque();
  inputQtd.value = "";
});

function atualizarTabela() {
  tabelaItens.innerHTML = itensVenda
    .map(
      (i) =>
        `<tr><td>${i.nome}</td><td>${i.quantidade}</td><td>R$ ${(
          i.preco * i.quantidade
        ).toFixed(2)}</td></tr>`
    )
    .join("");
  total = itensVenda.reduce((s, it) => s + it.preco * it.quantidade, 0);
  totalSpan.textContent = total.toFixed(2);
  calcularTroco();
}

function atualizarSelectComEstoque() {
  for (let i = 0; i < selectProduto.options.length; i++) {
    const opt = selectProduto.options[i];
    const id = opt.value;
    const qtd = produtosEstoque[id] !== undefined ? produtosEstoque[id] : 0;
    opt.text = `${opt.text.split(" (")[0]} (Qtd: ${qtd})`;
    opt.classList.remove("low-stock", "out-of-stock");
    opt.disabled = false;
    if (qtd === 0) {
      opt.classList.add("out-of-stock");
      opt.disabled = true;
    } else if (qtd <= 5) {
      opt.classList.add("low-stock");
    }
  }
}

inputValorRecebido.addEventListener("input", calcularTroco);
function calcularTroco() {
  const recebido = parseFloat(inputValorRecebido.value) || 0;
  const troco = recebido - total;
  trocoSpan.textContent = troco >= 0 ? troco.toFixed(2) : "0.00";
}

btnFinalizar.addEventListener("click", async () => {
  if (itensVenda.length === 0) return alert("Adicione produtos à venda");
  const tipo = selectTipo.value;
  const cliente = selectCliente.value || null;
  const recebido = parseFloat(inputValorRecebido.value) || 0;

  if (tipo === "dinheiro" && recebido < total)
    return alert("Valor recebido insuficiente para pagamento em dinheiro");

  try {
    const body = { itens: itensVenda, tipo, cliente, total };
    const res = await fetch(API + "/vendas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (res.ok && data.ok) {
      const troco = recebido - total;
      if (tipo === "dinheiro")
        alert(`Venda registrada! Troco: R$ ${troco.toFixed(2)}`);
      else alert("Venda registrada!");
      // limpar sem recarregar
      itensVenda = [];
      total = 0;
      tabelaItens.innerHTML = "";
      totalSpan.textContent = "0.00";
      inputValorRecebido.value = "";
      trocoSpan.textContent = "0.00";
      // recarregar produtos e clientes para atualizar estoque
      await carregarProdutos();
      await carregarClientes();
    } else {
      alert("Erro ao registrar venda");
      console.error("Resposta vendas:", data);
    }
  } catch (err) {
    console.error("Erro ao finalizar venda:", err);
    alert("Erro ao finalizar venda");
  }
});

// inicialização
(async function init() {
  await carregarProdutos();
  await carregarClientes();
})();
