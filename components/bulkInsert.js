import { getDatabase, ref, push, set } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js';

export function renderBulkInsertForm(navigateTo) {
  const appContainer = document.getElementById('app-container');

  appContainer.innerHTML = `
    <button id="backButton" class="mb-4 bg-gray-500 text-white px-4 py-2 rounded">Voltar</button>
    <textarea id="bulkInput" class="w-full h-64 p-4 border rounded mb-4" placeholder="Cole as anotações aqui..."></textarea>
    <button id="processBulkInput" class="bg-blue-500 text-white px-4 py-2 rounded">Processar e Inserir</button>
  `;

  document.getElementById('backButton').addEventListener('click', () => {
    navigateTo('home');
  });

  document.getElementById('processBulkInput').addEventListener('click', () => {
    const bulkInput = document.getElementById('bulkInput').value;
    processBulkInput(bulkInput);
  });
}

function processBulkInput(input) {
  const database = getDatabase();
  const lines = input.split('\n');
  let currentTeam = '';
  let currentVariation = '';

  lines.forEach(line => {
    if (line.trim() === '') return; // Ignora linhas em branco

    if (line.includes('-')) {
      // Processar uma variação com tamanhos
      const [variation, sizes] = line.split('-').map(part => part.trim());
      const sizeData = parseSizes(sizes);

      const productData = {
        team: currentTeam,
        variation: variation,
        sizes: sizeData
      };

      // Salvar no Firebase
      const newProductRef = push(ref(database, 'produtos-smart-estoque'));
      set(newProductRef, productData);

    } else {
      // Atualizar o nome do time
      currentTeam = line.trim();
    }
  });

  alert('Dados inseridos com sucesso!');
}

function parseSizes(sizesString) {
  const sizes = sizesString.split(',').map(size => size.trim());
  const sizeData = { P: 0, M: 0, G: 0, GG: 0 };

  sizes.forEach(size => {
    const match = size.match(/(\d+)([A-Z]+)/);
    if (match) {
      const quantity = match[1];
      const sizeKey = match[2];
      sizeData[sizeKey] = parseInt(quantity);
    }
  });

  return sizeData;
}
