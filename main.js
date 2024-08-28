import { loginUser, registerUser, logoutUser, monitorAuthState } from './auth/auth.js';
import { database } from './app.js';
import { ref, onValue, update, remove, push, set } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js';
import { renderForm } from './components/form.js';
import { renderTable } from './components/table.js';
import { renderBulkInsertForm } from './components/bulkInsert.js';
import { renderHome } from './components/home.js';

// Função para exibir e ocultar o loading
function showLoading() {
  document.getElementById('loadingContainer').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loadingContainer').classList.add('hidden');
}

// Função para calcular o pedido sugerido
function pedidoSugerido(products) {
  const pedido = {};

  Object.values(products).forEach(product => {
    const { team, variation, sizes } = product;

    if (!pedido[team]) {
      pedido[team] = {};
    }
    if (!pedido[team][variation]) {
      pedido[team][variation] = { P: 0, M: 0, G: 0, GG: 0 };
    }

    const tamanhos = ['P', 'M', 'G', 'GG'];
    tamanhos.forEach(tamanho => {
      const quantidadeAtual = sizes[tamanho] || 0;
      if (quantidadeAtual < 2) {
        pedido[team][variation][tamanho] = 2 - quantidadeAtual;
      }
    });
  });

  return pedido;
}

// Função para exibir o pedido sugerido
function exibirPedidoSugerido(pedido) {
  const appContainer = document.getElementById('app-container');
  appContainer.innerHTML = `
    <div class="mb-4 flex justify-between">
      <button id="backButton" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Voltar
      </button>
      <button id="copyButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Copiar Pedido
      </button>
    </div>
    <h2 class="text-2xl font-semibold mb-6">Pedido Sugerido</h2>
    <div id="pedidoContainer" class="space-y-6"></div>
  `;

  let totalPecas = 0;
  let existemPedidos = false;
  let pedidoTextoCompleto = "";

  Object.keys(pedido).forEach(team => {
    Object.keys(pedido[team]).forEach(variation => {
      const tamanhos = pedido[team][variation];
      const total = tamanhos.P + tamanhos.M + tamanhos.G + tamanhos.GG;

      // Se o total for 0, não exibir
      if (total > 0) {
        existemPedidos = true;
        totalPecas += total;

        const pedidoTexto = `
          ${team} - ${variation}\n
          P: ${tamanhos.P}, M: ${tamanhos.M}, G: ${tamanhos.G}, GG: ${tamanhos.GG}\n
          Total de Peças: ${total}\n\n
        `;
        pedidoTextoCompleto += pedidoTexto;

        const pedidoHTML = `
          <div class="p-4 bg-white shadow rounded">
            <h3 class="font-bold text-xl mb-2">${team} - ${variation}</h3>
            <p class="text-gray-700">P: ${tamanhos.P}, M: ${tamanhos.M}, G: ${tamanhos.G}, GG: ${tamanhos.GG}</p>
            <p class="font-semibold text-gray-900 mt-2">Total de Peças: ${total}</p>
          </div>
        `;

        document.getElementById('pedidoContainer').insertAdjacentHTML('beforeend', pedidoHTML);
      }
    });
  });

  // Exibir o total geral de peças se houver pedidos
  if (existemPedidos) {
    const totalResumo = `
      <div class="mt-6 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
        <p class="font-bold text-xl">Total Geral de Peças: ${totalPecas}</p>
      </div>
    `;
    pedidoTextoCompleto += `Total Geral de Peças: ${totalPecas}\n`;
    document.getElementById('pedidoContainer').insertAdjacentHTML('beforeend', totalResumo);
  } else {
    // Caso não existam pedidos sugeridos
    document.getElementById('pedidoContainer').innerHTML = `
      <div class="p-4 bg-green-100 border-l-4 border-green-500 text-green-700">
        <p class="font-bold text-xl">Nenhuma peça precisa ser reposta.</p>
      </div>
    `;
  }

  // Evento do botão "Voltar"
  document.getElementById('backButton').addEventListener('click', () => {
    navigateTo('home'); // Volta para a tela inicial
  });

  // Evento do botão "Copiar Pedido"
  document.getElementById('copyButton').addEventListener('click', () => {
    copiarParaAreaDeTransferencia(pedidoTextoCompleto);
  });
}

// Função para copiar o texto para a área de transferência
function copiarParaAreaDeTransferencia(texto) {
  const textarea = document.createElement("textarea");
  textarea.value = texto;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  alert("Pedido copiado para a área de transferência!");
}


// Função para habilitar a edição de um produto
function habilitarEdicao(productId, productData) {
  const appContainer = document.getElementById('app-container');

  appContainer.innerHTML = `
    <h2 class="text-xl font-semibold mb-4">Editar Produto</h2>
    <form id="editProductForm">
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="editTeamName">Time</label>
        <input id="editTeamName" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.team}">
      </div>
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2" for="editVariation">Variação</label>
        <input id="editVariation" type="text" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.variation}">
      </div>
      <div class="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="editSizeP">P</label>
          <input id="editSizeP" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.sizes.P}">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="editSizeM">M</label>
          <input id="editSizeM" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.sizes.M}">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="editSizeG">G</label>
          <input id="editSizeG" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.sizes.G}">
        </div>
        <div>
          <label class="block text-gray-700 text-sm font-bold mb-2" for="editSizeGG">GG</label>
          <input id="editSizeGG" type="number" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value="${productData.sizes.GG}">
        </div>
      </div>
      <div class="flex items-center justify-between">
        <button id="saveProductButton" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Salvar</button>
        <button id="cancelEditButton" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Cancelar</button>
      </div>
    </form>
  `;

  document.getElementById('cancelEditButton').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('viewStock'); // Volta para a tela de visualização de estoque
  });

  document.getElementById('editProductForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showLoading();

    const updatedProductData = {
      team: document.getElementById('editTeamName').value,
      variation: document.getElementById('editVariation').value,
      sizes: {
        P: parseInt(document.getElementById('editSizeP').value) || 0,
        M: parseInt(document.getElementById('editSizeM').value) || 0,
        G: parseInt(document.getElementById('editSizeG').value) || 0,
        GG: parseInt(document.getElementById('editSizeGG').value) || 0
      }
    };

    const productRef = ref(database, `produtos-smart-estoque/${productId}`);
    update(productRef, updatedProductData)
      .then(() => {
        alert('Produto atualizado com sucesso!');
        hideLoading();
        navigateTo('viewStock'); // Volta para a tela de visualização de estoque
      })
      .catch((error) => {
        console.error('Erro ao atualizar o produto:', error);
        hideLoading();
      });
  });
}

// Função para excluir um produto
function excluirProduto(productId) {
  if (confirm("Tem certeza de que deseja excluir este produto?")) {
    showLoading();
    const productRef = ref(database, `produtos-smart-estoque/${productId}`);
    remove(productRef)
      .then(() => {
        alert('Produto excluído com sucesso!');
        hideLoading();
        navigateTo('viewStock'); // Atualiza a tabela de estoque após a exclusão
      })
      .catch((error) => {
        console.error('Erro ao excluir o produto:', error);
        hideLoading();
      });
  }
}

// Função para navegar entre telas
function navigateTo(screen) {
  const appContainer = document.getElementById('app-container');

  if (screen === 'viewStock') {
    showLoading();
    appContainer.innerHTML = '';
    renderTable(navigateTo);

    const stockTable = document.getElementById('stockTable');
    if (stockTable) {
      onValue(ref(database, 'produtos-smart-estoque'), (snapshot) => {
        hideLoading();
        const products = snapshot.val();
        stockTable.innerHTML = '';

        if (products) {
          Object.keys(products).forEach(productId => {
            const product = products[productId];
            const row = `
              <tr>
                <td class="border px-4 py-2">${product.team}</td>
                <td class="border px-4 py-2">${product.variation}</td>
                <td class="border px-4 py-2">${product.sizes.P}</td>
                <td class="border px-4 py-2">${product.sizes.M}</td>
                <td class="border px-4 py-2">${product.sizes.G}</td>
                <td class="border px-4 py-2">${product.sizes.GG}</td>
                <td class="border px-4 py-2 flex justify-between">
                  <button class="bg-yellow-500 text-white px-4 py-2 rounded editProductButton" data-id="${productId}">Editar</button>
                  <button class="bg-red-500 text-white px-4 py-2 rounded deleteProductButton" data-id="${productId}">Excluir</button>
                </td>
              </tr>
            `;
            stockTable.insertAdjacentHTML('beforeend', row);
          });

          // Eventos para os botões de edição
          document.querySelectorAll('.editProductButton').forEach(button => {
            button.addEventListener('click', (e) => {
              const productId = e.target.getAttribute('data-id');
              habilitarEdicao(productId, products[productId]);
            });
          });

          // Eventos para os botões de exclusão
          document.querySelectorAll('.deleteProductButton').forEach(button => {
            button.addEventListener('click', (e) => {
              const productId = e.target.getAttribute('data-id');
              excluirProduto(productId);
            });
          });
        } else {
          stockTable.innerHTML = '<p>Estoque vazio.</p>';
        }
      });
    } else {
      console.error("Elemento 'stockTable' não encontrado.");
      hideLoading();
    }

  } else if (screen === 'addProduct') {
    appContainer.innerHTML = '';
    renderForm(navigateTo);

  } else if (screen === 'bulkInsert') {
    appContainer.innerHTML = '';
    renderBulkInsertForm(navigateTo);

  } else if (screen === 'suggestOrder') {
    showLoading();
    onValue(ref(database, 'produtos-smart-estoque'), (snapshot) => {
      hideLoading();
      const products = snapshot.val();
      const pedido = pedidoSugerido(products);
      exibirPedidoSugerido(pedido);
    });
  } else if (screen === 'home') {
    appContainer.innerHTML = '';
    renderHome(navigateTo);
  }
}

// Monitorar o estado de autenticação
monitorAuthState((user) => {
  if (user) {
    document.getElementById('authContainer').style.display = 'none';
    document.getElementById('stockContainer').style.display = 'block';
    navigateTo('home');
  } else {
    document.getElementById('authContainer').style.display = 'block';
    document.getElementById('stockContainer').style.display = 'none';
  }
});

// Lógica para login
document.getElementById('loginButton').addEventListener('click', () => {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  loginUser(email, password).catch((error) => {
    console.error('Erro ao logar:', error);
  });
});

// Lógica para registro
document.getElementById('registerButton').addEventListener('click', () => {
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;
  registerUser(email, password).catch((error) => {
    console.error('Erro ao registrar:', error);
  });
});

// Lógica para alternar entre login e registro
document.getElementById('showRegister').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'none';
  document.getElementById('registerForm').style.display = 'block';
});

document.getElementById('showLogin').addEventListener('click', (e) => {
  e.preventDefault();
  document.getElementById('loginForm').style.display = 'block';
  document.getElementById('registerForm').style.display = 'none';
});

// Lógica para logout
document.getElementById('logoutButton').addEventListener('click', () => {
  logoutUser().catch((error) => {
    console.error('Erro ao deslogar:', error);
  });
});
