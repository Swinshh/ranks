// project/scripts/api.js

async function buscarDadosJogador(nomeJogador) {
  try {
    const resposta = await fetch(
      `https://mush.com.br/api/player/${nomeJogador}`
    );
    if (!resposta.ok) {
      throw new Error(`Erro ao buscar dados do jogador: ${resposta.status}`);
    }
    const dados = await resposta.json();
    const enviarDados = await enviarDadosJogador(dados);

    return dados;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
}

async function enviarDadosJogador(dados) {
  try {
    if (
      dados &&
      dados.response &&
      dados.response.stats &&
      dados.response.stats.bedwars
    ) {
      const data = dados.response;
      let fkdr = (
        data.stats.bedwars.final_kills / data.stats.bedwars.final_deaths
      ).toFixed(2);
      let wlr = (data.stats.bedwars.wins / data.stats.bedwars.losses).toFixed(
        2
      );
      let bblr = (
        data.stats.bedwars.beds_broken / data.stats.bedwars.beds_lost
      ).toFixed(2);

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

      const playerRank = rank();

      const stats = {
        final_kills: data.stats.bedwars.final_kills,
        final_deaths: data.stats.bedwars.final_deaths,
        wins: data.stats.bedwars.wins,
        losses: data.stats.bedwars.losses,
        beds_broken: data.stats.bedwars.beds_broken,
        beds_lost: data.stats.bedwars.beds_lost,
        assists: data.stats.bedwars.assists,
        games_played: data.stats.bedwars.games_played,
        fkdr: (
          data.stats.bedwars.final_kills / data.stats.bedwars.final_deaths
        ).toFixed(2),
        wlr: (data.stats.bedwars.wins / data.stats.bedwars.losses).toFixed(2),
        bblr: (
          data.stats.bedwars.beds_broken / data.stats.bedwars.beds_lost
        ).toFixed(2),
        rank: playerRank,
      };

      let colors = {
        clan_color: data.clan && data.clan.tag_color ? data.clan.tag_color : null,
        nick_color: data.profile_tag.color
      };

      const hoje = new Date();
      const formatDate = hoje.toLocaleDateString("pt-BR"); // Formato padrão brasileiro
      
      let skin, hash, slim;

      if (data && data.skin) {
        hash = data.skin.hash;
        slim = data.skin.slim;
      } else {
        hash = "c73bbcd062ce9c2061a71c5d0b857658c8f85d0f46dc30d3b2c2460328b93a3e";
        slim = false;
      }

      skin = {
        hash: hash,
        slim: slim
      }

      if (stats.wins >= 100) {
        const body = {
          account: {
            name: data.account.username,
            reputation: 50,
            tag_clan: data.clan && data.clan.tag ? data.clan.tag : null,
            date: formatDate,
          },
          stats: stats,
          colors: colors,
          skin: skin
        };

        const response = await fetch("https://ranks-api.onrender.com/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        const result = await response.json();
        console.log("Resposta do backend:", result);
        return result;
      }
    }
  } catch (error) {
    console.error("Erro ao enviar dados para o backend:", error);
  }
}

export default buscarDadosJogador;
