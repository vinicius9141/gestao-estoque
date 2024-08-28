export function renderForm(navigateTo) {
  const appContainer = document.getElementById('app-container');

  appContainer.innerHTML = `
    <button id="backButton" class="mb-4 bg-gray-500 text-white px-4 py-2 rounded">Voltar</button>
    <form id="productForm" class="mb-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input type="text" id="teamName" placeholder="Nome do Time" class="p-2 border rounded w-full">
        <input type="text" id="uniformVariation" placeholder="Variação do Uniforme (ex: Nova, Tradicional)" class="p-2 border rounded w-full">
        <input type="number" id="sizeP" placeholder="Quantidade P" class="p-2 border rounded w-full">
        <input type="number" id="sizeM" placeholder="Quantidade M" class="p-2 border rounded w-full">
        <input type="number" id="sizeG" placeholder="Quantidade G" class="p-2 border rounded w-full">
        <input type="number" id="sizeGG" placeholder="Quantidade GG" class="p-2 border rounded w-full">
      </div>
      <button type="submit" class="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Adicionar Produto</button>
    </form>
  `;

  // Adicionar funcionalidade ao botão de "Voltar"
  document.getElementById('backButton').addEventListener('click', () => {
    navigateTo('home'); // Usando a função navigateTo para voltar à tela inicial
  });
}
