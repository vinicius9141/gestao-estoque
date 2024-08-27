export function renderHome(navigateTo) {
  const appContainer = document.getElementById('app-container');

  appContainer.innerHTML = `
    <div class="flex justify-center gap-8 mt-10">
      <div class="cursor-pointer text-center" id="viewStock">
        <div class="bg-blue-500 text-white p-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          <p class="text-xl font-semibold">Ver Estoque</p>
        </div>
      </div>
      <div class="cursor-pointer text-center" id="addProduct">
        <div class="bg-green-500 text-white p-6 rounded-lg shadow-lg hover:bg-green-600 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="text-xl font-semibold">Cadastrar Novo Produto</p>
        </div>
      </div>
      <div class="cursor-pointer text-center" id="bulkInsert">
        <div class="bg-yellow-500 text-white p-6 rounded-lg shadow-lg hover:bg-yellow-600 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M3 14h18M3 18h18" />
          </svg>
          <p class="text-xl font-semibold">Inserir em Massa</p>
        </div>
      </div>
      <div class="cursor-pointer text-center" id="suggestOrder">
        <div class="bg-red-500 text-white p-6 rounded-lg shadow-lg hover:bg-red-600 transition duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          <p class="text-xl font-semibold">Pedido Sugerido</p>
        </div>
      </div>
    </div>
  `;

  document.getElementById('viewStock').addEventListener('click', () => {
    navigateTo('viewStock');
  });

  document.getElementById('addProduct').addEventListener('click', () => {
    navigateTo('addProduct');
  });

  document.getElementById('bulkInsert').addEventListener('click', () => {
    navigateTo('bulkInsert');
  });

  document.getElementById('suggestOrder').addEventListener('click', () => {
    navigateTo('suggestOrder');
  });
}
