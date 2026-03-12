/**
 * NEXUS CORE ARCHITECTURE
 * Implementa Patrón Singleton para el Audio, Patrón Observer para la comunicación de estado,
 * y Web Components nativos para el encapsulamiento visual.
 */

// ==========================================
// 1. EVENT BUS (Observer Pattern)
// ==========================================
class EventBus {
    constructor() {
        this.listeners = {};
    }
    on(event, callback) {
        if (!this.listeners[event]) this.listeners[event] = [];
        this.listeners[event].push(callback);
    }
    emit(event, data) {
        if (this.listeners[event]) {
            this.listeners[event].forEach(cb => cb(data));
        }
    }
}
const sysBus = new EventBus();

// ==========================================
// 2. AUDIO ENGINE (Singleton & Web Audio API)
// ==========================================
class AudioEngine {
    constructor() {
        if (AudioEngine.instance) return AudioEngine.instance;
        this.ctx = null;
        AudioEngine.instance = this;
    }

    init() {
        if (!this.ctx) this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }

    playInteract() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);
        
        osc.start();
        osc.stop(this.ctx.currentTime + 0.1);
    }
}
const audioSys = new AudioEngine();

// ==========================================
// 3. WEB COMPONENTS (Modular UI)
// ==========================================

// A. Panel de Telemetría
class NexusTelemetry extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.dataPoints = 0;
    }

    connectedCallback() {
        this.render();
        // Escucha eventos del sistema global
        sysBus.on('scan-update', (data) => this.updateData(data));
    }

    updateData(data) {
        this.dataPoints = data.val;
        const display = this.shadowRoot.querySelector('.data-display');
        if(display) display.textContent = `${this.dataPoints} T/s`;
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: block; background: rgba(20,22,28,0.7); padding: 1.5rem; border-radius: 16px; border: 1px solid rgba(255,255,255,0.08); }
                h2 { color: #94a3b8; font-family: sans-serif; margin-top: 0; font-size: 1rem; text-transform: uppercase;}
                .data-display { font-size: 3rem; color: #00f0ff; font-weight: bold; }
            </style>
            <h2>Flujo de Datos</h2>
            <div class="data-display">0 T/s</div>
        `;
    }
}
customElements.define('nexus-telemetry-panel', NexusTelemetry);

// B. Visualizador Radar (Canvas API)
class NexusRadar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.angle = 0;
    }

    connectedCallback() {
        this.shadowRoot.innerHTML = `
            <style>
                :host { display: flex; justify-content: center; align-items: center; background: rgba(0,0,0,0.3); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.08); }
                canvas { width: 100%; max-width: 300px; aspect-ratio: 1; }
            </style>
            <canvas id="radarCanvas" width="300" height="300"></canvas>
        `;
        this.ctx = this.shadowRoot.getElementById('radarCanvas').getContext('2d');
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    animate() {
        const width = 300; const height = 300; const center = width/2;
        
        // Efecto de desvanecimiento (trail)
        this.ctx.fillStyle = 'rgba(10, 10, 12, 0.1)';
        this.ctx.fillRect(0, 0, width, height);
        
        // Círculos del radar
        this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.arc(center, center, 100, 0, Math.PI * 2);
        this.ctx.arc(center, center, 140, 0, Math.PI * 2);
        this.ctx.stroke();

        // Línea de barrido
        this.angle += 0.05;
        this.ctx.save();
        this.ctx.translate(center, center);
        this.ctx.rotate(this.angle);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(0, -140);
        this.ctx.strokeStyle = '#00f0ff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
        this.ctx.restore();

        requestAnimationFrame(this.animate);
    }
}
customElements.define('nexus-radar-view', NexusRadar);

// ==========================================
// 4. MAIN CONTROLLER (Command handling)
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    const terminal = document.getElementById('log-output');
    const htmlRoot = document.documentElement;

    // Inicializar motor de audio en la primera interacción
    document.body.addEventListener('click', () => audioSys.init(), { once: true });

    document.querySelectorAll('.btn-cyber').forEach(btn => {
        btn.addEventListener('click', (e) => {
            audioSys.playInteract();
            const action = e.target.dataset.action;
            
            if(action === 'init-scan') {
                terminal.textContent = "> Escaneando sector táctico...\n";
                // Simulación asíncrona enviando datos al Web Component
                let val = 0;
                const interval = setInterval(() => {
                    val += Math.floor(Math.random() * 50);
                    sysBus.emit('scan-update', { val });
                    if(val > 500) {
                        clearInterval(interval);
                        terminal.textContent += "> Escaneo completado.";
                    }
                }, 100);
            }
            
            if(action === 'purge-cache') {
                terminal.textContent = "> Memoria purgada exitosamente.";
                sysBus.emit('scan-update', { val: 0 });
            }

            if(action === 'toggle-theme') {
                const current = htmlRoot.getAttribute('data-theme');
                const next = current === 'dark' ? 'light' : 'dark';
                htmlRoot.setAttribute('data-theme', next);
                terminal.textContent = `> Protocolo visual actualizado a modo: ${next}`;
            }
        });
    });
});
