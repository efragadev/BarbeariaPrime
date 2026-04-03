const botoesAdicionar = document.querySelectorAll(".adicionar");
const listaPedido = document.getElementById("lista-pedido");
const totalElemento = document.getElementById("total");
const botaoFinalizarPedido = document.getElementById("finalizar-pedido");
const mensagemFinalizacao = document.getElementById("mensagem-finalizacao");

let total = 0;
let quantidadeServicos = 0;
let tempoMensagem;

const atualizarTotal = () => {
  totalElemento.textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
};

const mostrarMensagem = (texto, tipo) => {
  clearTimeout(tempoMensagem);

  mensagemFinalizacao.textContent = texto;
  mensagemFinalizacao.className = `mensagem ${tipo} mostrar`;

  tempoMensagem = setTimeout(() => {
    mensagemFinalizacao.className = "mensagem";
  }, 2500);
};

botoesAdicionar.forEach((botao) => {
  botao.addEventListener("click", () => {
    const servico = botao.parentElement;
    const nome = servico.querySelector("h3").textContent;
    const precoTexto = servico.querySelector(".preco").textContent;
    const preco = parseFloat(precoTexto.replace("R$", "").replace(",", "."));
    const itemExistente = listaPedido.querySelector(`[data-nome="${nome}"]`);

    if (botao.classList.contains("selecionado")) {
      if (itemExistente) {
        itemExistente.remove();
      }

      total -= preco;
      total = parseFloat(total.toFixed(2));
      quantidadeServicos--;

      botao.textContent = "Selecionar";
      botao.classList.remove("selecionado");
      servico.classList.remove("selecionado");

      if (quantidadeServicos === 0) {
        listaPedido.innerHTML = "<li>Nenhum servico selecionado.</li>";
      }

      atualizarTotal();
      mostrarMensagem(`${nome} removido do pedido.`, "aviso");
      return;
    }

    if (quantidadeServicos === 0) {
      listaPedido.innerHTML = "";
    }

    const itemPedido = document.createElement("li");
    itemPedido.setAttribute("data-nome", nome);
    itemPedido.textContent = `${nome} - R$ ${preco.toFixed(2).replace(".", ",")}`;
    listaPedido.appendChild(itemPedido);

    total += preco;
    total = parseFloat(total.toFixed(2));
    quantidadeServicos++;

    botao.textContent = "Remover";
    botao.classList.add("selecionado");
    servico.classList.add("selecionado");

    atualizarTotal();
    mostrarMensagem(`${nome} selecionado com sucesso.`, "sucesso");
  });
});

botaoFinalizarPedido.addEventListener("click", () => {
  if (quantidadeServicos === 0) {
    mostrarMensagem("Adicione pelo menos um servico antes de finalizar.", "aviso");
    return;
  }

  const totalAtual = total.toFixed(2).replace(".", ",");

  botaoFinalizarPedido.textContent = "Registrando...";
  botaoFinalizarPedido.disabled = true;
  botoesAdicionar.forEach((botao) => {
    botao.disabled = true;
  });
  mostrarMensagem(`Pedido concluido com sucesso. Total registrado: R$ ${totalAtual}`, "sucesso");

  setTimeout(() => {
    listaPedido.innerHTML = "<li>Nenhum servico selecionado.</li>";
    total = 0;
    quantidadeServicos = 0;
    atualizarTotal();

    botoesAdicionar.forEach((botao) => {
      const servico = botao.parentElement;

      botao.textContent = "Selecionar";
      botao.classList.remove("selecionado");
      servico.classList.remove("selecionado");
      botao.disabled = false;
    });

    botaoFinalizarPedido.textContent = "Finalizar selecao";
    botaoFinalizarPedido.disabled = false;
  }, 1500);
});
