  // Função para buscar os dados do backend
  async function fetchRanking() {
    try {
      const response = await fetch('https://ranks-api.onrender.com/api/ranking');
      if (!response.ok) {
        throw new Error('Erro ao buscar o ranking.');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  }

  // Função para renderizar a tabela
  async function renderTable(rankFilter = 'all') {
    try {
      const ranking = await fetchRanking();
      const tableBody = document.querySelector('#ranking-table tbody');
      tableBody.innerHTML = ''; // Limpa qualquer conteúdo existente
  
      let visibleIndex = 1; // Índice baseado na renderização visível
  
      ranking.forEach((player) => {
        if (rankFilter !== 'all' && player.stats.rank.toLowerCase() !== rankFilter.toLowerCase()) return;
  
        const row = document.createElement('tr');
        const playerHeadSkin = `https://mineskin.eu/helm/${player.username}/24`;
        const nameColor = player.colors.nick_color;
        const tagClan = player.tag_clan ? `[${player.tag_clan}]` : "";
        const clanColor = player.tag_clan ? player.colors.clan_color : 'white';
  
        row.classList.add('trStyle');
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
        visibleIndex++; // Incrementa o índice apenas para itens renderizados
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