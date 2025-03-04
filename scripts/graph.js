let myChart;

async function graphic(fkdr, wlr, bblr, rankColor) { // Adicione os parâmetros
    try{

        const data = {
            labels: ['FKDR', 'WLR', 'BBLR'], // Os nomes das variáveis
            datasets: [{
                label: 'Estatísticas do Jogador',
                data: [fkdr, wlr, bblr], // Use os parâmetros
                backgroundColor: `${rankColor}50`, // Cor laranja semitransparente
                borderColor: rankColor, // Cor da borda laranja
                borderWidth: 2,
                pointBackgroundColor: rankColor, // Cor dos pontos laranja
                pointHoverBackgroundColor: rankColor,
                pointHoverBorderColor: 'rgba(255, 69, 0, 1)',
            }]
        };
    
        const config = {
            type: 'radar',
            data: data,
            options: {
                responsive: false, // Desativa o comportamento responsivo
                maintainAspectRatio: false, // Permite que o gráfico ignore a razão de aspecto original
                scales: {
                    
                    r: {
                        grid: {
                            color: '#cfcfcf'
                        },
                        angleLines: {
                            color: '#cfcfcf'
                        },
                        ticks: {
                            color: '#cfcfcf',
                            backdropColor: '#2b2b2b',
                            beginAtZero: true,
                            max: 24 // Ajuste o valor máximo de acordo com seus dados
                        },
                        pointLabels: {
                            color: '#cfcfcf'
                        }
                    }
                }
            }
        };
    
        if (myChart) {
            myChart.destroy(); // Destroi o gráfico atual para liberar o canvas
        }
        
        const ctx = document.getElementById('triangleChart').getContext('2d');
        // Cria o gráfico com Chart.js
        myChart = new Chart(ctx, config);
        console.log(config)

    }catch(error){
        console.error(`houve um erro em graph: ${error}`)
    }
}

export default graphic;
