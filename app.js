/**
 * ============================================================
 * 🌦️ PROJETO: CLIMADEV
 * Conceitos: APIs Aninhadas (Chaining), Geocodificação, CSS Dinâmico
 * ============================================================
 */

async function buscarCidade() {
    // 1. CAPTURA
    const inputCidade = document.getElementById("input-cidade");
    const cidade = inputCidade.value;

    // Validação simples para não buscar vazio
    if (!cidade) return;

    try {
        // 2. GEOCODIFICAÇÃO (Descobrir Lat/Lon da cidade)
        // A API do Open-Meteo precisa de coordenadas, não de nomes.
        const respostaGeo = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${cidade}&count=1&language=pt`);
        const dadosGeo = await respostaGeo.json();

        // Se a lista de resultados estiver vazia, a cidade não existe.
        if (!dadosGeo.results) {
            alert("Cidade não encontrada!");
            return;
        }

        const cidadeEncontrada = dadosGeo.results[0]; // Pega a primeira opção
        const lat = cidadeEncontrada.latitude;
        const lon = cidadeEncontrada.longitude;

        // 3. BUSCA DO CLIMA (Usando as coordenadas)
        const respostaClima = await fetch(`https://api.open-meteo.com/v1/forecast?current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&latitude=${lat}&longitude=${lon}&timezone=auto`);
        const dadosClima = await respostaClima.json();

        console.log(dadosClima); // Debug

        // 4. PINTAR A TELA (DOM)
        // Mostra a caixa de resultados que estava oculta
        document.getElementById("info-clima").style.display = "block";

        // Seleciona os elementos
        const elementoCidade = document.getElementById("cidade");
        const elementoTemp = document.getElementById("temperatura");
        const elementoVento = document.getElementById("vento");
        const elementoUmidade = document.getElementById("umidade");
        const elementoDescricao = document.getElementById("descricao");

        // Preenche os dados
        elementoCidade.innerText = `${cidadeEncontrada.name}, ${cidadeEncontrada.country_code}`;
        elementoTemp.innerText = `${dadosClima.current.temperature_2m}°C`;
        elementoVento.innerText = `${dadosClima.current.wind_speed_10m} km/h`;
        elementoUmidade.innerText = `${dadosClima.current.relative_humidity_2m}%`;

        // 5. ESTILO DINÂMICO (O Camaleão)
        // O código WMO diz se é sol (0-1), nublado (2-3) ou chuva/neve (>3).
        const codigo = dadosClima.current.weather_code;

        if (codigo <= 1) {
            // SOL
            elementoDescricao.innerText = "Ensolarado ☀️";
            document.body.style.background = "linear-gradient(to bottom, #4facfe, #00f2fe)";
        } else if (codigo <= 3) {
            // NUBLADO
            elementoDescricao.innerText = "Nublado ☁️";
            document.body.style.background = "linear-gradient(to bottom, #bdc3c7, #2c3e50)";
        } else {
            // CHUVA / TEMPESTADE / NEVE
            elementoDescricao.innerText = "Chuvoso 🌧️";
            document.body.style.background = "linear-gradient(to bottom, #373B44, #4286f4)";
        }

    } catch (erro) {
        console.error("Deu erro na busca:", erro);
        alert("Erro ao buscar dados. Tente novamente.");
    }
}