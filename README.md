## 📄 README.md para GitHub

A continuación, el contenido del archivo `README.md` en español, listo para ser copiado.

```markdown
# 🛡️ NEXUS HUD — Interfaz de Información en Tiempo Real

Interfaz inmersiva estilo HUD (Heads-Up Display) construida con tecnologías web nativas. Combina un efecto parallax sensible al movimiento del ratón con widgets de datos financieros, noticias tecnológicas y marcadores de eSports. Todo sin dependencias externas.

![Preview](screenshot.png) <!-- Puedes agregar una captura luego -->

## ✨ Características

- 🎮 **Efecto 3D Parallax** que simula seguimiento de cabeza según la posición del cursor.
- 🕒 **Reloj digital** central con actualización cada segundo.
- 📈 **Widget de Criptomonedas** (`<nexus-finance>`)  
  - Precios en USD de Bitcoin, Ethereum, Solana y Polkadot.  
  - Variación en 24 horas con indicación visual de positivos/negativos.  
  - Datos en vivo desde la API pública de [CoinGecko](https://www.coingecko.com/).  
- 📰 **Widget de Noticias** (`<nexus-news>`)  
  - Últimas noticias tecnológicas/de negocios desde [Hacker News](https://news.ycombinator.com/).  
  - Sin clickbait, solo información de alta calidad.  
  - Abre el artículo en una nueva pestaña al hacer clic.  
- 🎮 **Widget de eSports** (`<nexus-esports>`)  
  - Resultados de torneos de Pokémon Unite, Mobile Legends y Wild Rift.  
  - Datos simulados; fácilmente adaptable a una API real de competiciones.  
- 🧩 **Web Components nativos** → encapsulación lógica, reutilizables en cualquier proyecto HTML.

## 🚀 Cómo usar

1. Clona el repositorio o copia los archivos en tu servidor local.
2. Abre el archivo `index.html` en un navegador moderno (Chrome, Firefox, Edge).
3. ¡Listo! Los widgets se cargan automáticamente al estar definidos como elementos personalizados.

**Estructura esperada del proyecto:**
```
nexus-hud/
├── index.html         # Estructura y estilos CSS del HUD
├── app.js             # Lógica JavaScript (el código analizado)
└── README.md
```

> **Nota:** El código mostrado aquí es la parte JavaScript. Para que la interfaz funcione, debes complementarlo con un archivo HTML que contenga el contenedor `#hud-scene`, el `<div id="clock">` y las etiquetas de los widgets (`<nexus-finance>`, etc.) con el CSS necesario para el efecto parallax (perspectiva, capas, variables de color como `--hud-alert`). Los estilos base no están incluidos en este snippet, pero puedes adaptarlos libremente.

## 🛠️ Personalización

- **Cambiar monedas**  
  En `NexusFinance.fetchData`, modifica los parámetros `ids` de la URL. Consulta la [documentación de CoinGecko](https://www.coingecko.com/en/api) para los identificadores disponibles.

- **Más noticias**  
  Ajusta el `slice(0, 4)` en `NexusNews.fetchNews` para mostrar más artículos.

- **Conectar eSports a API real**  
  Sustituye el arreglo estático `tournamentData` por una llamada `fetch` a servicios como [PandaScore](https://pandascore.co/) o tu backend propio.

- **Intervalos de actualización**  
  El widget financiero se actualiza cada 60 segundos. Cambia el valor en `setInterval` dentro del `connectedCallback` de `NexusFinance`.

## 🌐 APIs utilizadas

| Servicio        | Propósito                        | Endpoint documentado                          |
|-----------------|----------------------------------|-----------------------------------------------|
| CoinGecko       | Precios de criptomonedas en USD  | `api.coingecko.com/api/v3/simple/price`       |
| Hacker News     | Noticias tecnológicas            | `hacker-news.firebaseio.com/v0/topstories`    |

Ambas son gratuitas y no requieren clave de API.

## 📦 Tecnologías

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
- **Web Components** (Custom Elements)
- **CSS 3D Transforms**
- **Fetch API**

## 🤖 Instalación técnica

No se requiere ningún paso de compilación. Basta con servir los archivos estáticos.

Si deseas ejecutarlo con un servidor local (recomendado para evitar restricciones CORS en algunas APIs):
```bash
# Con Python 3
python -m http.server 8000

# O con Node.js (npx)
npx serve
```
Luego visita `http://localhost:8000`.

## 📜 Licencia

Este proyecto se distribuye bajo la licencia MIT. Puedes usarlo, modificarlo y compartirlo libremente.

---

**Hecho con ⚡ por [Mizu Legends / Nexus Corp]**
