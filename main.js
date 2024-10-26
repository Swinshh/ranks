import buscarDadosJogador from './scripts/api.js';
import animations from './scripts/animations.js';
import graphic from './scripts/graph.js';
import theme from './scripts/theme.js';

let resultsPainel = document.getElementsByClassName('results')[0]; // pegar painel

// Variável para status de atualização
let isUpdating = false; // Inicia como falso

animations();

document.addEventListener('DOMContentLoaded', () => {
  const search = document.getElementById('searchPlayer');
  const button = document.getElementById('searchButton');

  async function script() {
    const player = search.value;

    if (!player) {
      console.error('Nenhum jogador foi informado.');
      return;
    }

    // Ativa o status de atualização e oculta o painel
    isUpdating = true;
    resultsPainel.style.display = 'none';

    try {
      const dados = await buscarDadosJogador(player);
      const nick = document.getElementById('nickname');
      const result = document.getElementById('result');
      const wlrate = document.getElementById('wlrate');
      const bblRATE = document.getElementById('bblRATE');
      const rankDisplay = document.getElementById('rankDisplay');
      const comment = document.getElementById('comment');
      const headMine = document.getElementById('headMine'); 
      const rankTitle = document.getElementsByClassName('rankTitle')[0];
      const rankIcon = document.getElementById('rankIcon');
      const bwStats = dados.response.stats.bedwars;
      const clanName = dados.response.clan.tag;

      // Verifica se a estrutura de resposta é válida
      if (dados && dados.response && dados.response.stats && dados.response.stats.bedwars) {
        let finalKills = parseInt(bwStats.final_kills);
        let finalDeaths = parseInt(bwStats.final_deaths);
        let fkdr = parseFloat((finalKills / finalDeaths).toFixed(2));

        let Wins = parseInt(bwStats.wins);
        let Losses = parseInt(bwStats.losses);
        let wlr = parseFloat((Wins / Losses).toFixed(2));

        let bedsBroken = parseInt(bwStats.beds_broken);
        let bedsLost = parseInt(bwStats.beds_lost);
        let bblr = parseFloat((bedsBroken / bedsLost).toFixed(2));

        function rank() {
          const ranks = [
            { rank: 'Divine', fkdr: 16, wlr: 8, bblr: 6 },
            { rank: 'SS', fkdr: 12, wlr: 6, bblr: 4 },
            { rank: 'S', fkdr: 8, wlr: 4, bblr: 2 },
            { rank: 'A', fkdr: 4, wlr: 2, bblr: 1 },
            { rank: 'B', fkdr: 2, wlr: 1, bblr: 0.5 },
            { rank: 'C', fkdr: 1, wlr: 0.5, bblr: 0.2 },
            { rank: 'D', fkdr: 0, wlr: 0, bblr: 0 }
          ];

          for (const r of ranks) {
            if (fkdr >= r.fkdr && wlr >= r.wlr && bblr >= r.bblr) {
              return r.rank;
            }
          }
          return 'E';
        }

        const playerRank = rank();
        let comments, rankColor, rankIcos;
        
        switch (playerRank) {
          case 'Divine':
            comments = "Esse cara é um Deus no jogo, tem grandes chances de ganhar qualquer partida.";
            rankColor = '#FF5500';
            rankIcos = './assets/icos/Rank Divine.png';
            break;
          case 'SS':
            comments = "Esse cara é perigoso, muito inteligente e capaz de ganhar.";
            rankColor = '#FFC700';
            rankIcos = './assets/icos/Rank SS.png';
            break;
          case 'S':
            comments = "Um dos melhores do server, mas não é impossível de ganhar";
            rankColor = '#795E00';
            rankIcos = './assets/icos/Rank S.png';
            break;
          case 'A':
            comments = "Um bom player, mas não ganha todas";
            rankColor = '#0038C8';
            rankIcos = './assets/icos/Rank A.png';
            break;
          case 'B':
            comments = "Provavelmente gosta de ir rápido nas partidas e joga no automático";
            rankColor = '#455E8D';
            rankIcos = './assets/icos/Rank B.png';
            break;
          case 'C':
            comments = "Tem muito a melhorar, mas joga melhor que boa parte";
            rankColor = '#8E6262';
            rankIcos = './assets/icos/Rank C.png';
            break;
          case 'D':
            comments = "Dificilmente ganha alguma partida";
            rankColor = '#969696';
            rankIcos = './assets/icos/Rank D.png';
            break;
          case 'E':
            comments = "Horrível, deve ter começado agora ou joga pouco";
            rankColor = '#4B3621';
            break;
          default:
            comments = "erro";
            break;
        }

        graphic(fkdr, wlr, bblr, rankColor); 
        comment.innerHTML = comments;
        nick.innerHTML = `${player} [${clanName}]`;
        headMine.src = 'https://mineskin.eu/armor/body/' + player + '/100.png';
        rankIcon.src = rankIcos;
        result.innerHTML = fkdr.toString();
        wlrate.innerHTML = wlr.toString();
        bblRATE.innerHTML = bblr.toString();
        rankDisplay.innerHTML = playerRank;
        rankTitle.style.color = rankColor;

        isUpdating = false; // Finaliza o status de atualização
        resultsPainel.style.display = 'flex'; // Mostra o painel com dados prontos

      } else {
        console.log('Dados de Bedwars não encontrados para esse jogador.');
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      isUpdating = false; // Define como falso em caso de erro
    }
  }

  button.addEventListener('click', script);
  search.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        script();
    }
  });
});

//sim.
