import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js';
import { getDatabase, ref, onValue, push, set } from 'https://www.gstatic.com/firebasejs/9.1.3/firebase-database.js';
import { renderForm } from './components/form.js';
import { renderTable } from './components/table.js';
import { renderHome } from './components/home.js';
import { renderBulkInsertForm } from './components/bulkInsert.js';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDm489cllrXaJu7RbCiFuaewKmfdy052sM",
  authDomain: "dball-d96c5.firebaseapp.com",
  databaseURL: "https://dball-d96c5-default-rtdb.firebaseio.com",
  projectId: "dball-d96c5",
  storageBucket: "dball-d96c5.appspot.com",
  messagingSenderId: "93264723664",
  appId: "1:93264723664:web:89132a42cf571a782728d5",
  measurementId: "G-989WEBGN8H"
};

// Inicializar Firebase usando módulos ES6
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Exportar o database
export { database };

// Função para navegar entre telas
function navigateTo(screen) {
  const appContainer = document.getElementById('app-container');

  if (screen === 'viewStock') {
    appContainer.innerHTML = ''; // Limpa a tela
    renderTable(navigateTo);

    // Carregar o estoque na tabela
    const stockTable = document.getElementById('stockTable');
    if (stockTable) {
      onValue(ref(database, 'produtos-smart-estoque'), (snapshot) => {
        stockTable.innerHTML = ''; // Limpa a tabela antes de carregar os dados
        snapshot.forEach((childSnapshot) => {
          const product = childSnapshot.val();
          const row = `
            <tr>
              <td class="border px-4 py-2">${product.team}</td>
              <td class="border px-4 py-2">${product.variation}</td>
              <td class="border px-4 py-2">${product.sizes.P}</td>
              <td class="border px-4 py-2">${product.sizes.M}</td>
              <td class="border px-4 py-2">${product.sizes.G}</td>
              <td class="border px-4 py-2">${product.sizes.GG}</td>
            </tr>
          `;
          stockTable.insertAdjacentHTML('beforeend', row);
        });
      });
    } else {
      console.error("Elemento 'stockTable' não encontrado.");
    }

  } else if (screen === 'addProduct') {
    appContainer.innerHTML = ''; // Limpa a tela
    renderForm(navigateTo);

    // Evento de envio do formulário
    const productForm = document.getElementById('productForm');
    productForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Captura os valores dos campos
      const teamName = document.getElementById('teamName').value;
      const uniformVariation = document.getElementById('uniformVariation').value;
      const sizeP = document.getElementById('sizeP').value || 0;
      const sizeM = document.getElementById('sizeM').value || 0;
      const sizeG = document.getElementById('sizeG').value || 0;
      const sizeGG = document.getElementById('sizeGG').value || 0;

      // Criando o objeto do produto
      const productData = {
        team: teamName,
        variation: uniformVariation,
        sizes: {
          P: parseInt(sizeP),
          M: parseInt(sizeM),
          G: parseInt(sizeG),
          GG: parseInt(sizeGG)
        }
      };

      // Salvando no Firebase
      const newProductRef = push(ref(database, 'produtos-smart-estoque'));
      set(newProductRef, productData);

      // Limpar o formulário
      productForm.reset();
    });

  } else if (screen === 'bulkInsert') {
    appContainer.innerHTML = ''; // Limpa a tela
    renderBulkInsertForm(navigateTo);
  } else if (screen === 'home') {
    renderHome(navigateTo); // Volta para a tela inicial
  }
}

// Inicializar a aplicação na tela inicial
document.addEventListener('DOMContentLoaded', () => {
  renderHome(navigateTo);
});
