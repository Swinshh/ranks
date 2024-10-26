//ainda bem que não usa chave de acesso.
async function buscarDadosJogador(nomeJogador) {
    try {
      const resposta = await fetch(`https://mush.com.br/api/player/${nomeJogador}`);
      if (!resposta.ok) {
        throw new Error(`Erro ao buscar dados do jogador: ${resposta.status}`);
      }
      const dados = await resposta.json();
      
      return dados;
    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  }


export default buscarDadosJogador;