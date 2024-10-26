// project/scripts/theme.js

let light = "Light 🌞"; // ícone para light
let dark = "Dark 🌛"; // ícone para dark
let darkActived = false; // verifica se o dark foi ativado

// Função para alternar e aplicar o tema
function theme(themeButton) {
    try {
        // Carregar o tema salvo no localStorage (se houver)
        const savedTheme = localStorage.getItem("theme");

        // Definir o tema inicial com base no localStorage
        if (savedTheme === "dark") {
            applyDarkTheme(themeButton);
        } else {
            applyLightTheme(themeButton);
        }

        // Alternar tema quando o botão é clicado
        themeButton.addEventListener("click", () => {
            darkActived = !darkActived;
            if (darkActived) {
                applyDarkTheme(themeButton);
                localStorage.setItem("theme", "dark");
            } else {
                applyLightTheme(themeButton);
                localStorage.setItem("theme", "light");
            }
        });
        
        console.log("Tema aplicado com sucesso");

    } catch (error) {
        console.log("Não foi possível executar a função de tema:", error);
    }
}

// Função para aplicar o tema escuro
function applyDarkTheme(themeButton) {
    themeButton.innerHTML = dark;
    document.body.style.backgroundColor = "#1a1a1a"; // Fundo escuro
    themeButton.style.color = "var(--white-color)"
    document.body.style.color = "#f2f2f2"; // Texto claro
}

// Função para aplicar o tema claro
function applyLightTheme(themeButton) {
    themeButton.innerHTML = light;
    themeButton.style.color = "var(--black-text)"
    document.body.style.backgroundColor = "#f4f4f9"; // Fundo claro
    document.body.style.color = "#1a1a1a"; // Texto escuro
}

export default theme;
