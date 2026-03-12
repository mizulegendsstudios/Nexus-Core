// ==========================================
// 1. MOTOR DE PARALLAX (Seguimiento de cabeza simulado)
// ==========================================
const scene = document.getElementById('hud-scene');

document.addEventListener('mousemove', (e) => {
    // Calcula la posición del ratón respecto al centro de la pantalla
    const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
    
    // Rota toda la escena sutilmente para dar sensación de profundidad
    scene.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
});

// Reloj Central
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').textContent = now.toLocaleTimeString('en-US', { hour12: false });
}, 1000);

// ==========================================
// 2. WEB COMPONENTS (Widgets de Datos)
// ==========================================

// --- WIDGET FINANCIERO (CoinGecko API) ---
class NexusFinance extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `<div style="text-align:center; color: var(--hud-alert)">Estableciendo enlace de datos...</div>`;
        this.fetchData();
        // Actualizar cada 60 segundos
        setInterval(() => this.fetchData(), 60000);
    }

    async fetchData() {
        try {
            // API pública de criptomonedas
            const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,polkadot&vs_currencies=usd&include_24hr_change=true');
            const data = await res.json();
            this.render(data);
        } catch (err) {
            this.innerHTML = `<div class="negative">ERROR DE CONEXIÓN FINANCIERA</div>`;
        }
    }

    render(data) {
        let html = '';
        for (const [coin, stats] of Object.entries(data)) {
            const change = stats.usd_24h_change;
            const changeClass = change >= 0 ? 'positive' : 'negative';
            const sign = change >= 0 ? '+' : '';
            
            html += `
                <div class="data-row">
                    <span style="text-transform: uppercase;">${coin}</span>
                    <span>
                        $${stats.usd.toLocaleString()} 
                        <span class="${changeClass}">(${sign}${change.toFixed(2)}%)</span>
                    </span>
                </div>
            `;
        }
        this.innerHTML = html;
    }
}
customElements.define('nexus-finance', NexusFinance);

// --- WIDGET DE NOTICIAS (Hacker News API - Cero Amarillismo) ---
class NexusNews extends HTMLElement {
    async connectedCallback() {
        this.innerHTML = `<div style="text-align:center; color: var(--hud-alert)">Recopilando reportes...</div>`;
        this.fetchNews();
    }

    async fetchNews() {
        try {
            // Hacker News es ideal: solo hechos de tecnología y negocios, sin clickbait.
            const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json');
            const ids = await res.json();
            
            // Tomamos los primeros 4 artículos
            const top5Ids = ids.slice(0, 4);
            const newsPromises = top5Ids.map(id => 
                fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`).then(r => r.json())
            );
            
            const articles = await Promise.all(newsPromises);
            this.render(articles);
        } catch (err) {
            this.innerHTML = `<div class="negative">INTERFERENCIA EN LA RED DE NOTICIAS</div>`;
        }
    }

    render(articles) {
        this.innerHTML = articles.map(article => `
            <div class="news-item" onclick="window.open('${article.url}', '_blank')">
                <div>> ${article.title}</div>
                <div class="news-meta">Fuente verificada | Puntos: ${article.score}</div>
            </div>
        `).join('');
    }
}
customElements.define('nexus-news', NexusNews);

// --- WIDGET DE ESPORTS COMPETITIVO (Simulación de API Estructurada) ---
class NexusEsports extends HTMLElement {
    connectedCallback() {
        // En un entorno de producción, esto se conectaría a una API de torneos
        // Simulamos un payload JSON recibido de un servidor
        const tournamentData = [
            { league: "Sudamérica Championship", game: "Pokemon Unite", match: "Mizu Squad vs. Eclipse", result: "2 - 1", status: "FINALIZADO" },
            { league: "Global Series", game: "Mobile Legends", match: "Neon Knights vs. Apex", result: "0 - 0", status: "EN JUEGO (Min 12)" },
            { league: "Rift Qualifiers", game: "Wild Rift", match: "Dragons vs. Void", result: "--", status: "PRÓXIMAMENTE" }
        ];

        this.render(tournamentData);
    }

    render(matches) {
        this.innerHTML = matches.map(m => `
            <div class="data-row" style="flex-direction: column; align-items: flex-start; margin-bottom: 0.5rem; border-bottom: none;">
                <div style="font-size: 0.7rem; color: var(--hud-alert);">> ${m.game} | ${m.league}</div>
                <div style="display: flex; justify-content: space-between; width: 100%;">
                    <span>${m.match}</span>
                    <span class="${m.status === 'FINALIZADO' ? 'positive' : ''}">${m.result}</span>
                </div>
            </div>
        `).join('');
    }
}
customElements.define('nexus-esports', NexusEsports);
