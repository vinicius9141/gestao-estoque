export function renderTable(navigateTo) {
  const appContainer = document.getElementById('app-container');

  // Estrutura básica da tabela com o botão "Voltar"
  appContainer.innerHTML = `
    <div class="mb-4">
      <button id="backButton" class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Voltar
      </button>
    </div>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white">
        <thead>
          <tr>
            <th class="py-2 px-2 sm:px-4 border-b">Time</th>
            <th class="py-2 px-2 sm:px-4 border-b">Variação</th>
            <th class="py-2 px-2 sm:px-4 border-b">P</th>
            <th class="py-2 px-2 sm:px-4 border-b">M</th>
            <th class="py-2 px-2 sm:px-4 border-b">G</th>
            <th class="py-2 px-2 sm:px-4 border-b">GG</th>
            <th class="py-2 px-2 sm:px-4 border-b">Ações</th> <!-- Coluna de Ações -->
          </tr>
        </thead>
        <tbody id="stockTable"></tbody>
      </table>
    </div>
  `;

  // Evento do botão "Voltar"
  document.getElementById('backButton').addEventListener('click', () => {
    navigateTo('home'); // Volta para a tela inicial
  });
}
