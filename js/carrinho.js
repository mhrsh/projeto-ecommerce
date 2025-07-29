/*
Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
    parte 1- vamos adicionar +1 no ícone do carrinho 
        passo 1- pegar botões de adicionar ao carrinho de html 
        passo 2 - adicionar um evento de escuta nesses botões pra quando clicar disparar uma ação
        passo 3 - pega as informações do produto clicado e adicionar no localstorage
        passo 4 - atualizar o contador do carrinho de compras
        passo 5 - renderizar a tabela do carrinho de compras

Objetivo 2 - remover produtos do carrinho passo 1 - pegar o botão de deletar html Passo 2 - adicionar evento de escuta no botão
    passo 1 - pegar o botão de deletar html
    passo 2 - adicionar evento de escuta no tbody
    passo 3 - remover o produto do localstorage
    passo 4 - atualizar o html do carrinho retirando o produto

Objetivo 3 - Atualizar os valores do carrinho
    passo 1 - adicionar evento de escuta no input no tbody
    passo 2 - atualizar o valor total do produto 
    passo 3 - atualizar o valor total do carrinho
*/

// Objetivo 1 - quando clicar no botao de adicionar ao carrinho temos que atualizar o contador, adicionar o produto no localStorage e atualizar o html do carrinho
//     parte 1- vamos adicionar +1 no ícone do carrinho 
//         passo 1- pegar botões de adicionar ao carrinho de html 

// Refatoração: extraída função para obter dados do produto e evitar repetição de código.
const botoesAdicionarAoCarrinho = document.querySelectorAll('.adicionar-ao-carrinho');
botoesAdicionarAoCarrinho.forEach(botao => {
    botao.addEventListener('click', (evento) => {
        const elementoProduto = evento.target.closest('.produto');
        const produto = obterDadosProduto(elementoProduto);
        adicionarProdutoAoCarrinho(produto);
        atualizarCarrinhoETabela();
    });
});

// Função extraída para obter dados do produto do DOM
function obterDadosProduto(elementoProduto) {
    return {
        id: elementoProduto.dataset.id,
        nome: elementoProduto.querySelector('.nome').textContent,
        imagem: elementoProduto.querySelector('img').getAttribute('src'),
        preco: parseFloat(elementoProduto.querySelector('.preco').textContent.replace('R$', '').replace('.', '').replace(',', '.')),
        quantidade: 1
    };
}

// Função extraída para adicionar produto ao carrinho, incrementando se já existir
function adicionarProdutoAoCarrinho(produtoNovo) {
    const carrinho = obterProdutosDoCarrinho();
    const produtoExistente = carrinho.find(produto => produto.id === produtoNovo.id);
    if (produtoExistente) {
        produtoExistente.quantidade += 1;
    } else {
        carrinho.push(produtoNovo);
    }
    salvarProdutosNoCarrinho(carrinho);
}

function salvarProdutosNoCarrinho(carrinho) {
    localStorage.setItem("carrinho", JSON.stringify(carrinho));
}

function obterProdutosDoCarrinho() {
    const produtos = localStorage.getItem("carrinho");
    return produtos ? JSON.parse(produtos) : [];
}

// passo 4 - atualizar o contador do carrinho de compras
function atualizarContadorCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    let total = 0;

    produtos.forEach(produto => {
        total += produto.quantidade;
    });

    document.getElementById('contador-carrinho').textContent = total;
}

// passo 5 - renderizar a tabela do carrinho de compras
function renderizarTabelaDoCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    const corpoTabela = document.querySelector('#modal-1-content table tbody');

    corpoTabela.innerHTML = ""; // Limpar tabela antes de renderizar

    produtos.forEach(produto => {
        const tr = document.createElement("tr");
        // Corrigido erro de markup em <td> do nome do produto
        tr.innerHTML = `
            <td class="td-produto">
                <img src="${produto.imagem}" alt="${produto.nome}">
            </td>
            <td>${produto.nome}</td>
            <td class="td-preco-unitario">R$ ${produto.preco.toFixed(2).replace(".", ",")}</td>
            <td class="td-quantidade">
                <input type="number" class="input-quantidade" data-id="${produto.id}" value="${produto.quantidade}" min="1">
            </td>
            <td class="td-preco-total">R$ ${(produto.preco * produto.quantidade).toFixed(2).replace(".", ",")}</td>
            <td><button class="btn-remover" data-id="${produto.id}" id="deletar"></button></td>
        `;
        corpoTabela.appendChild(tr);
    });
}


// Objetivo 2 - remover produtos do carrinho passo 1 - pegar o botão de deletar html Passo 2 - adicionar evento de escuta no botão
//     passo 1 - pegar o botão de deletar html

const corpoTabela = document.querySelector('#modal-1-content table tbody');

//    passo 2 - adicionar evento de escuta no tbody
corpoTabela.addEventListener('click', evento => {
    if (evento.target.classList.contains('btn-remover')) {
        const id = evento.target.dataset.id;
        //    passo 3 - remover o produto do localstorage
        removerProdutoDoCarrinho(id);
    }
})

// //Objetivo 3 - Atualizar os valores do carrinho
//     passo 1 - adicionar evento de escuta no input no tbody
// Refatoração: validação para evitar quantidade inválida e garantir mínimo 1
corpoTabela.addEventListener('input', evento => {
    if (evento.target.classList.contains('input-quantidade')) {
        const produtos = obterProdutosDoCarrinho();
        const produto = produtos.find(produto => produto.id === evento.target.dataset.id);
        let novaQuantidade = Math.max(1, parseInt(evento.target.value) || 1); // Garante mínimo 1
        if (produto) {
            produto.quantidade = novaQuantidade;
        }
        salvarProdutosNoCarrinho(produtos);
        atualizarCarrinhoETabela();
    }
});

//passo 4 - atualizar o html do carrinho retirando o produto
// Refatoração: função simplificada e comentário explicativo
function removerProdutoDoCarrinho(id) {
    const produtos = obterProdutosDoCarrinho();
    // Remove o produto pelo id e atualiza o carrinho
    const carrinhoAtualizado = produtos.filter(produto => produto.id !== id);
    salvarProdutosNoCarrinho(carrinhoAtualizado);
    atualizarCarrinhoETabela();
}

// passo 3 - atualizar o valor total do carrinho
function atualizarValorTotalCarrinho() {
    const produtos = obterProdutosDoCarrinho();
    // Refatoração: uso de reduce para somar total de forma mais funcional
    const total = produtos.reduce((soma, produto) => soma + produto.preco * produto.quantidade, 0);
    document.querySelector('#total-carrinho').textContent = `Total: R$ ${total.toFixed(2).replace(".", ",")}`;
}

// Refatoração: função central para atualizar UI do carrinho
function atualizarCarrinhoETabela() {
    atualizarContadorCarrinho();
    renderizarTabelaDoCarrinho();
    atualizarValorTotalCarrinho();
}

atualizarCarrinhoETabela();