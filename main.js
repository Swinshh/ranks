import buscarDadosJogador from "./scripts/api.js"; // importa dados da api
import animations from "./scripts/animations.js"; // importa animações de tela
import graphic from "./scripts/graph.js"; // importa um sistema de gráficos.
import renderTable from "./scripts/leaderboard.js";
renderTable();

let resultsPainel = document.getElementsByClassName("results")[0]; // pegar painel

let commentsContainer =
  document.getElementsByClassName("comments-container")[0]; // pegar comments
let fix_skin_size = 100; // valor inicial

window.addEventListener("resize", () => {
  fix_skin_size = window.innerWidth <= 600 ? 48 : 100;
});

// Variável para status de atualização
let isUpdating = false; // Inicia como falso

animations(); // Roda as animação de './scripts/animations.js'.

document.addEventListener("DOMContentLoaded", () => {
  const search = document.getElementById("searchPlayer");
  const button = document.getElementById("searchButton");

  let icon = "./assets/icos/immortal.png";
  document.querySelector("#website-icon").setAttribute("href", icon);
  document.querySelector("#index-title").innerHTML = "Mush Ranks";

  async function script() {
    const player = search.value;

    if (!player) {
      console.error("Nenhum jogador foi informado.");
      return;
    }

    // Ativa o status de atualização e oculta o painel
    isUpdating = true;
    resultsPainel.style.display = "none";
    commentsContainer.style.display = "none";

    try {
      const dados = await buscarDadosJogador(player);
      const nick = document.getElementById("nickname");
      const erroDisplay = document.getElementById("errorDisplay");
      const result = document.getElementById("result");
      const wlrate = document.getElementById("wlrate");
      const bblRATE = document.getElementById("bblRATE");
      const rankResult = document.getElementById("rankResult");
      const rankDisplay = document.getElementById("rankDisplay");
      const comment = document.getElementById("comment");
      const headMine = document.getElementById("headMine");
      const rankTitle = document.getElementsByClassName("rankTitle")[0];
      const rankIcon = document.getElementById("rankIcon");
      const bwStats = dados.response.stats.bedwars;
      const tagClan = document.getElementById("tag_clan");
      const trueName = dados.response.account.username;
      const profileTag = dados.response.profile_tag.color;
      nick.style.color = profileTag;
      const trueClanColor =
        dados.response.clan && dados.response.clan.tag_color
          ? dados.response.clan.tag_color
          : null;
      tagClan.style.color = trueClanColor;
      const clanName = dados.response.clan ? dados.response.clan.tag : null; // Define "clanName"

      // Verifica se a estrutura de resposta é válida
      if (
        dados &&
        dados.response &&
        dados.response.stats &&
        dados.response.stats.bedwars
      ) {
        let finalKills = bwStats && bwStats.final_kills ? parseInt(bwStats.final_kills) : 0;
        let finalDeaths = parseInt(bwStats.final_deaths);
        let fkdr = parseFloat((finalKills / finalDeaths).toFixed(2));

        let Wins = bwStats && bwStats.wins ? parseInt(bwStats.wins) : 0;
        let Losses = bwStats && bwStats.losses ? parseInt(bwStats.losses) : 0;
        let wlr = parseFloat((Wins / Losses).toFixed(2));

        let bedsBroken = bwStats && bwStats.beds_broken ? parseInt(bwStats.beds_broken) : 0;
        let bedsLost = bwStats && bwStats.beds_lost ? parseInt(bwStats.beds_lost) : 0;
        let bblr = parseFloat((bedsBroken / bedsLost).toFixed(2));

        const ranks = [
          { rank: "immortal", fkdr: 20, wlr: 12, bblr: 8 },
          { rank: "Divine", fkdr: 16, wlr: 8, bblr: 6 },
          { rank: "SS", fkdr: 12, wlr: 6, bblr: 4 },
          { rank: "S", fkdr: 8, wlr: 4, bblr: 2 },
          { rank: "A", fkdr: 4, wlr: 2, bblr: 1 },
          { rank: "B", fkdr: 2, wlr: 1, bblr: 0.5 },
          { rank: "C", fkdr: 1, wlr: 0.5, bblr: 0.2 },
          { rank: "D", fkdr: 0, wlr: 0, bblr: 0 },
        ];

        function rank() {
          for (const r of ranks) {
            if (fkdr >= r.fkdr && wlr >= r.wlr && bblr >= r.bblr) {
              return r.rank;
            }
          }
          return "E";
        }

        function progressToNextRank(fkdr, wlr, bblr) {
          const currentRankIndex = ranks.findIndex(
            (r) => r.rank === playerRank
          );
          const nextRank = ranks[currentRankIndex - 1];

          if (!nextRank) return { fkdr: 100, wlr: 100, bblr: 100, total: 100 }; // Caso o jogador já esteja no rank máximo

          const fkdrProgress = Math.min((fkdr / nextRank.fkdr) * 100, 100);
          const wlrProgress = Math.min((wlr / nextRank.wlr) * 100, 100);
          const bblrProgress = Math.min((bblr / nextRank.bblr) * 100, 100);
          const totalProgress = parseFloat(
            (fkdrProgress + wlrProgress + bblrProgress) / 3
          ).toFixed(2);

          return {
            fkdr: fkdrProgress.toFixed(2),
            wlr: wlrProgress.toFixed(2),
            bblr: bblrProgress.toFixed(2),
            total: totalProgress,
          };
        }

        function whatImprove() {
          const currentRankIndex = ranks.findIndex(
            (rank) => fkdr >= rank.fkdr && wlr >= rank.wlr && bblr >= rank.bblr
          );
        
          if (currentRankIndex === -1 || currentRankIndex === 0) {
            // Já no rank mais alto ou nenhum rank encontrado
            return "Parabéns! Você já está no rank mais alto.";
          }
        
          const nextRank = ranks[currentRankIndex - 1];
          let finalKillsImprove = 0;
          let winsImprove = 0;
          let bedsBrokenImprove = 0;
        
          // Calcular quantas kills finais são necessárias
          if (fkdr < nextRank.fkdr) {
            let tempKills = finalKills;
            while (tempKills / finalDeaths < nextRank.fkdr) {
              tempKills++;
            }
            finalKillsImprove = tempKills - finalKills;
          }
        
          // Calcular quantas vitórias são necessárias
          if (wlr < nextRank.wlr) {
            let tempWins = Wins;
            while (tempWins / Losses < nextRank.wlr) {
              tempWins++;
            }
            winsImprove = tempWins - Wins;
          }
        
          // Calcular quantas camas quebradas são necessárias
          if (bblr < nextRank.bblr) {
            let tempBeds = bedsBroken;
            while (tempBeds / bedsLost < nextRank.bblr) {
              tempBeds++;
            }
            bedsBrokenImprove = tempBeds - bedsBroken;
          }
        
          const tips = [];
          if (finalKillsImprove > 0) {
            tips.push(
              `Você precisa matar mais ${finalKillsImprove.toLocaleString("pt-BR")} inimigos para subir ao próximo rank.`
            );
          }
          if (winsImprove > 0) {
            tips.push(
              `Você precisa ganhar mais ${winsImprove.toLocaleString("pt-BR")} partidas para subir ao próximo rank.`
            );
          }
          if (bedsBrokenImprove > 0) {
            tips.push(
              `Você precisa quebrar mais ${bedsBrokenImprove.toLocaleString("pt-BR")} camas para subir ao próximo rank.`
            );
          }
        
          return tips.length > 0 ? tips.join(" ") : "Você já está próximo do próximo rank!";
        }
          
       const dicas = whatImprove();
      


        
        const playerRank = rank();

        const progressData = progressToNextRank(fkdr, wlr, bblr);
        let comments, rankColor, rankIcos;

        function updateProgressBar() {
          try {
            // Seleciona os elementos
            const statsContainer = document.querySelector(".stats");
            const actualRankImg = document.querySelector(".actual-rank");
            const nextRankImg = document.querySelector(".next-rank");
            const barTotalProgress = document.querySelector(
              ".bar-total-progress"
            );
            const progressTextPercent =
              document.querySelector(".progress-percent");
            const progressContainer = document.querySelector(
              ".progress-container"
            );
            const selectorsContainer = document.querySelector(".selectors");
            const selectedStyle = document.querySelector(".selected");

            // Função para definir a seleção de tipo de dados
            function toggleSelected(element, isSelected, rankColor) {
              element.classList.toggle("selected", isSelected);
              element.style.backgroundColor = isSelected ? rankColor : "";
            }

            // Função para atualizar o texto e a barra de progresso
            function updateProgressDisplay(type) {
              const progressValue = progressData[type];
              progressTextPercent.textContent = `Progresso ${type}: ${progressValue}%`;
              barTotalProgress.style.width = `${progressValue}%`; // Atualiza a largura da barra de acordo com o tipo
            }

            // Função para adicionar ouvintes aos tipos de dados
            function initSelectorListeners(rankColor) {
              const types = ["total", "fkdr", "wlr", "bblr"];
              Array.from(selectorsContainer.children).forEach(
                (child, index) => {
                  child.addEventListener("click", () => {
                    // Limpa a seleção anterior e atualiza o display do progresso
                    Array.from(selectorsContainer.children).forEach((el) =>
                      toggleSelected(el, false)
                    );
                    toggleSelected(child, true, rankColor);
                    updateProgressDisplay(types[index]);
                  });
                }
              );
            }

            // Inicia o sistema de seleção
            initSelectorListeners(rankColor);

            // Define a imagem atual e a próxima imagem do rank
            if (playerRank !== "DIVINE") {
              actualRankImg.src = `./assets/icos/${playerRank}.png`;
              const nextRank = ranks.find(
                (r, i) => r.rank === playerRank && ranks[i - 1]
              )?.rank;
              // Define a cor inicial e o tamanho da barra de progresso baseado no total
              barTotalProgress.style.width = `${progressData.total}%`;
              barTotalProgress.style.backgroundColor = rankColor;
              progressTextPercent.textContent = `Progresso total: ${progressData.total}%`; // Define o valor inicial
              if (nextRank)
                nextRankImg.src = `./assets/icos/${
                  ranks[ranks.findIndex((r) => r.rank === playerRank) - 1].rank
                }.png`;
              progressContainer.style.display = "flex";
            } else {
              progressContainer.destroy();
              progressContainer.style.display = "none";
            }

            toggleSelected(selectedStyle, false, rankColor);
          } catch (error) {
            console.error("Algo deu errado", error);
          }
        }

        switch (playerRank) {
          case "immortal":
            rankColor = "#FF0000";
            rankIcos = "./assets/icos/immortal.png";
            comments = dicas;

            break;
          case "Divine":
            rankColor = "#8500DD";
            rankIcos = "./assets/icos/Divine.png";
            comments = dicas;
            break;
          case "SS":
            rankColor = "#007C25";
            rankIcos = "./assets/icos/SS.png";
            comments = dicas;
            break;
          case "S":
            rankColor = "#007C25";
            rankIcos = "./assets/icos/S.png";
            comments = dicas;
            break;
          case "A":
            rankColor = '#0038C8';
            rankIcos = "./assets/icos/A.png";
            comments = dicas;
            break;
          case "B":
            rankColor = "#455E8D";
            rankIcos = "./assets/icos/B.png";
            comments = dicas;
            break;
          case "C":
            rankColor = "#8E6262";
            rankIcos = "./assets/icos/C.png";
            comments = dicas;
            break;
          case "D":
            rankColor = "#969696";
            rankIcos = "./assets/icos/D.png";
            comments = dicas;
            break;
          case "E":
            rankColor = "#4B3621";
            rankIcos = "./assets/icos/E.png";
            comments = dicas;
            break;
          default:
            comments = "erro";
            break;
        }

        updateProgressBar();

        graphic(fkdr, wlr, bblr, rankColor);
        comment.innerHTML = comments;

        if (clanName) {
          nick.innerHTML = `${trueName}`;
          tagClan.innerHTML = ` [${clanName}]`;
          console.log("tem clan");
        } else {
          nick.innerHTML = `${trueName}`;
          console.log("não tem clan");
        }

        try {
          headMine.src =
            "https://mineskin.eu/armor/body/" +
            player +
            "/" +
            fix_skin_size.toString() +
            ".png";
          rankIcon.src = rankIcos;
          result.innerHTML = fkdr.toString();
          wlrate.innerHTML = wlr.toString();
          bblRATE.innerHTML = bblr.toString();
          rankDisplay.innerHTML = playerRank;
          rankTitle.style.color = rankColor;
          document
            .getElementById("website-icon")
            .setAttribute("href", `https://mineskin.eu/helm/${player}`);
          document.querySelector("#index-title").innerHTML = trueName;
        } catch (error) {
          console.error(error);
        }

        isUpdating = false; // Finaliza o status de atualização
        resultsPainel.style.display = "flex"; // Mostra o painel com dados prontos
        commentsContainer.style.display = "flex";
      } else {
        console.log("Dados de Bedwars não encontrados para esse jogador.");
      }
    } catch (error) {
      console.error("Erro ao buscar dados:", error);

      isUpdating = false; // Define como falso em caso de erro
    }
  }

  button.addEventListener("click", script);
  search.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      script();
    }
  });
});

//sim.
