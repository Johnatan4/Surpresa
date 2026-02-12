const canvas = document.getElementById('treeCanvas');
const ctx = canvas.getContext('2d');

// 1. Contador de Tempo
const dataInicio = new Date(2023, 1, 14); // Ajuste sua data aqui

function atualizarRelogio() {
    const agora = new Date();
    const diff = agora - dataInicio;
    const dias = Math.floor(diff / 86400000);
    const horas = Math.floor((diff / 3600000) % 24);
    const mins = Math.floor((diff / 60000) % 60);
    const segs = Math.floor((diff / 1000) % 60);
    
    document.getElementById('clock').innerHTML = 
        `${dias} dias ${horas}h ${mins}m ${segs}s`;
}
setInterval(atualizarRelogio, 1000);
atualizarRelogio();

// 2. Sistema de Corações Preenchidos
const particles = [];
const colors = ['#ff4d6d', '#ff758f', '#c9184a', '#ffb3c1', '#ef233c', '#ff8fa3'];

class HeartParticle {
    constructor() {
        this.reset();
    }

    reset() {
        const t = Math.random() * 2 * Math.PI;
        // u e r fazem o preenchimento de dentro para fora
        const u = Math.random(); 
        const r = 11 * Math.sqrt(u); // Aumenta a densidade no meio
        
        // Equação do formato de coração
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // Centralização no canvas
        this.x = 200 + x * r;
        this.y = 190 + y * r;
        
        this.size = 2 + Math.random() * 3.5;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.opacity = Math.random();
        this.blink = 0.005 + Math.random() * 0.01;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.translate(this.x, this.y);
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-this.size, -this.size, -this.size * 1.5, this.size, 0, this.size * 1.3);
        ctx.bezierCurveTo(this.size * 1.5, this.size, this.size, -this.size, 0, 0);
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.opacity -= this.blink;
        if (this.opacity <= 0) {
            this.reset();
            this.opacity = 1;
        }
    }
}

// 1500 partículas para garantir volume total
for (let i = 0; i < 1500; i++) {
    particles.push(new HeartParticle());
}

function drawTrunk() {
    ctx.fillStyle = "#4e342e";
    ctx.beginPath();
    ctx.moveTo(195, 400); // Base
    ctx.quadraticCurveTo(200, 320, 198, 260); // Sobe afinando
    ctx.lineTo(202, 260);
    ctx.quadraticCurveTo(200, 320, 205, 400); // Desce
    ctx.fill();
}

function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTrunk();
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(loop);
}

loop();