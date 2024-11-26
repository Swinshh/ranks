  // Função para buscar os dados do backend
  async function fetchRanking() {
    try {
      const response = await fetch('https://ranks-api.onrender.com/api/ranking');
      if (!response.ok) {
        throw new Error('Erro ao buscar o ranking.');
      }
      return response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }


 // Função para criar um row genérico com placeholders
function createSkeletonRow() {
  const row = document.createElement('tr');
  row.classList.add('trStyle'); // Usa o estilo padrão da tabela
  row.innerHTML = `
    <td style="text-align: center">
      <div class="skeleton-cell" style="width: 16px; height: 16px; margin-right: 8px;"></div>
    </td>
    <td style="display: flex; justify-content: center; align-items: center;">
      <div class="skeleton-cell" style="width: 16px; height: 16px; margin-right: 8px;"></div>
      <div class="skeleton-cell" style="width: 24px; height: 24px; margin-right: 8px;"></div>
      <div class="skeleton-cell" style="width: 100px; height: 16px; margin-right: 8px;"></div>
      <div class="skeleton-cell" style="width: 50px; height: 16px;"></div>
    </td>
    <td style="text-align: center">
      <div class="skeleton-cell" style="width: 40px; height: 16px;"></div>
    </td>
    <td style="text-align: center">
      <div class="skeleton-cell" style="width: 40px; height: 16px;"></div>
    </td>
    <td style="text-align: center">
      <div class="skeleton-cell" style="width: 40px; height: 16px;"></div>
    </td>
  `;
  return row;
}

// Função principal para renderizar a tabela
async function renderTable(rankFilter = 'all') {
  const tableBody = document.querySelector('#ranking-table tbody');
  const loadingElement = document.getElementById('loading');
  const tableElement = document.getElementById('ranking-table');

  // Exibe placeholders enquanto carrega
  tableBody.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    tableBody.appendChild(createSkeletonRow());
  }
  tableElement.style.display = 'table';

  try {
    const ranking = await fetchRanking(); // Busca todos os dados da API
    tableBody.innerHTML = ''; // Limpa os placeholders

    // Aplica filtro por rank, se necessário
    const filteredRanking = ranking.filter((player) =>
      rankFilter === 'all' ? true : player.stats.rank.toLowerCase() === rankFilter.toLowerCase()
    );

    // Mostra no máximo 100 jogadores após o filtro
    const visibleRanking = filteredRanking.slice(0, 100);

    let visibleIndex = 1;
    visibleRanking.forEach((player) => {
      const row = createSkeletonRow();
      const playerHeadSkin = `https://mineskin.eu/helm/${player.username}/24`;
      const nameColor = player.colors.nick_color;
      const tagClan = player.tag_clan ? `[${player.tag_clan}]` : "";
      const clanColor = player.tag_clan ? player.colors.clan_color : 'white';

      row.innerHTML = `
        <td style="text-align: center">${visibleIndex}º</td>
        <td style="display: flex">
          <img src="../assets/icos/${player.stats.rank}.png" alt="${player.username}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 24px;">
          <img src="${playerHeadSkin}" alt="${player.username}" style="width: 24px; height: 24px; vertical-align: middle; margin-right: 8px;">
          <p style="color: ${nameColor}">${player.username}</p>
          <p style="color: ${clanColor}; margin-left: 8px">${tagClan}</p>
        </td>
        <td style="text-align: center">${player.stats.fkdr || 0}</td>
        <td style="text-align: center">${player.stats.wlr || 0}</td>
        <td style="text-align: center">${player.stats.bblr || 0}</td>
      `;

      tableBody.appendChild(row);
      visibleIndex++;
    });
  } catch (error) {
    console.error('Erro ao renderizar a tabela:', error);
  }
}

  
  
  function initRankSelectors() {
    const rankButtons = document.querySelectorAll('.selects button');
  
    rankButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const rankFilter = button.getAttribute('data-rank');
  
        // Atualiza a aparência dos botões selecionados
        rankButtons.forEach((btn) => btn.classList.remove('selected'));
        button.classList.add('selected');
  
        // Atualiza a tabela com base no rank selecionado
        renderTable(rankFilter);
      });
    });
  }
  
  // Inicializa o sistema de seleção e renderiza a tabela com todos os jogadores inicialmente
  initRankSelectors();
  renderTable();
  

  // Chama a função para renderizar a tabela ao carregar a página
  export default renderTable;
