import buscarDadosJogador from './scripts/api.js'; // importa dados da api
import animations from './scripts/animations.js'; // importa animações de tela
import graphic from './scripts/graph.js'; // importa um sistema de gráficos.
import theme from './scripts/theme.js'; // importa um sistema pra tema

let resultsPainel = document.getElementsByClassName('results')[0]; // pegar painel
let fix_skin_size = 72 // Valor original



// Variável para status de atualização
let isUpdating = false; // Inicia como falso

animations(); // Roda as animação de './scripts/animations.js'.


// adiciona um evento que indetifica a tela mudando
window.addEventListener('resize', () => {
  const chart = document.getElementById('triangleChart'); // Pega o gráfico 
  chart.width = chart.parentElement.clientWidth;
  chart.height = chart.parentElement.clientWidth;
});

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
      const erroDisplay = document.getElementById('errorDisplay')
      const result = document.getElementById('result');
      const wlrate = document.getElementById('wlrate');
      const bblRATE = document.getElementById('bblRATE');
      const rankDisplay = document.getElementById('rankDisplay');
      const comment = document.getElementById('comment');
      const headMine = document.getElementById('headMine'); 
      const rankTitle = document.getElementsByClassName('rankTitle')[0];
      const rankIcon = document.getElementById('rankIcon');
      const bwStats = dados.response.stats.bedwars;
      const clanName = dados.response.clan ? dados.response.clan.tag : null; // Define "clanName"

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
            comments = "Jogador excepcional, capaz de dominar qualquer partida com grande habilidade.";
            rankColor = '#FF5500';
            rankIcos = './assets/icos/Rank Divine.png';
            break;
          case 'SS':
            comments = "Um adversário impressionante, muito estratégico e com grandes chances de vitória.";
            rankColor = '#FFC700';
            rankIcos = './assets/icos/Rank SS.png';
            break;
          case 'S':
            comments = "Um dos melhores do servidor, um desafio que merece respeito.";
            rankColor = '#795E00';
            rankIcos = './assets/icos/Rank S.png';
            break;
          case 'A':
            comments = "Jogador consistente, com bastante habilidade e boas chances de vencer.";
            rankColor = '#0038C8';
            rankIcos = './assets/icos/Rank A.png';
            break;
          case 'B':
            comments = "Gosta de um bom ritmo e mantém uma jogabilidade equilibrada.";
            rankColor = '#455E8D';
            rankIcos = './assets/icos/Rank B.png';
            break;
          case 'C':
            comments = "Jogador esforçado, com boas habilidades e potencial para crescer.";
            rankColor = '#8E6262';
            rankIcos = './assets/icos/Rank C.png';
            break;
          case 'D':
            comments = "Pode não ganhar todas, mas continua jogando e aprendendo a cada partida.";
            rankColor = '#969696';
            rankIcos = './assets/icos/Rank D.png';
            break;
          case 'E':
            comments = "No começo da jornada, mas cada partida é uma nova chance para evoluir.";
            rankColor = '#4B3621';
            rankIcos = './assets/icos/Rank E.png';
            break;
          default:
            comments = "erro";
            break;
        }
        

        graphic(fkdr, wlr, bblr, rankColor); 
        comment.innerHTML = comments;
        
        if (clanName) {
          nick.innerHTML = `${player} [${clanName}]`;
          console.log('tem clan');
        } else {
          nick.innerHTML = `${player}`;
          console.log('não tem clan');
        }
        headMine.src = 'https://mineskin.eu/armor/body/' + player + '/' + fix_skin_size.toString() +'.png';
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
