<template>
  <div class="bg">
    <!-- Base Dark/Urban Color -->
    <div class="bg-base"></div>
    
    <!-- ZZZ High-Contrast Orbs -->
    <div class="orb orb1"></div>
    <div class="orb orb2"></div>
    <div class="orb orb3"></div>
    <div class="orb orb4"></div>
    
    <!-- Smaller, 3D Futuristic Grid -->
    <div class="bg-grid"></div>

    <!-- Data Particles -->
    <canvas ref="canvasRef" class="particles-canvas"></canvas>
    
    <!-- CRT Scanline Overlay -->
    <div class="bg-crt"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useTheme } from '../composables/useTheme.js'

const { isDark } = useTheme()
const canvasRef = ref(null)
let animationId = null
let resizeHandler = null

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  let width, height
  let particles = []

  let colors = ['#e5ff00', '#00ff55', '#ff4400']
  let isLight = false

  watch(isDark, (val) => {
    isLight = !val
    colors = val ? ['#e5ff00', '#00ff55', '#ff4400'] : ['#888888', '#aaaaaa', '#cccccc']
    particles.forEach(p => {
      p.color = colors[Math.floor(Math.random() * colors.length)]
    })
    if (isLight) {
      if (animationId) { cancelAnimationFrame(animationId); animationId = null }
    } else {
      if (!animationId) draw()
    }
  })

  function initParticles() {
    particles = []
    const particleCount = Math.floor((width * height) / 15000) // Density
    for (let i = 0; i < particleCount; i++) {
      particles.push(createParticle())
    }
  }

  function createParticle() {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * -1 - 0.5, // Always float upwards
      size: Math.random() * 2 + 0.5,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.5 + 0.2,
      life: Math.random() * 100
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height)
    
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.5
      
      // Reset if off screen or dead
      if (p.y < 0 || p.x < 0 || p.x > width || p.life <= 0) {
        particles[i] = createParticle()
        particles[i].y = height + 10 // spawn at bottom
        particles[i].life = 100 + Math.random() * 50
      }
      
      let currentAlpha = p.alpha * (p.life / 150) // Fade out
      ctx.globalAlpha = currentAlpha
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fill()
    }

    animationId = requestAnimationFrame(draw)
  }

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width
    canvas.height = height
    initParticles()
  }

  resizeHandler = resize
  window.addEventListener('resize', resize)
  resize()
  draw()
})

onUnmounted(() => {
  if (resizeHandler) window.removeEventListener('resize', resizeHandler)
  if (animationId) cancelAnimationFrame(animationId)
})
</script>

<style scoped>
.bg { position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden; background: #0c0c0c; transition: background 0.5s ease-in-out; }

.bg-base {
  position: absolute; inset: 0;
  /* Deep urban dark grey with a hint of dark green/blue */
  background: radial-gradient(circle at 50% 100%, #1a1b22 0%, #0d0d0f 80%, #000000 100%);
  z-index: 1;
  transition: background 0.5s ease-in-out;
}

/* --- Holographic Orbs with ZZZ Colors --- */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  z-index: 2;
  animation: float 20s infinite ease-in-out alternate;
  will-change: transform;
  transition: opacity 0.5s ease-in-out;
}

.orb1 {
  width: 700px; height: 700px;
  background: rgba(229, 255, 0, 0.12); /* Neon Yellow */
  top: -200px; left: 10%;
  animation-duration: 25s;
}

.orb2 {
  width: 800px; height: 800px;
  background: rgba(0, 255, 85, 0.08); /* Cyber Green */
  bottom: -200px; right: -100px;
  animation-duration: 28s;
  animation-delay: -5s;
}

.orb3 {
  width: 600px; height: 600px;
  background: rgba(255, 68, 0, 0.1); /* Hot Orange */
  top: 20%; right: 30%;
  animation-duration: 22s;
  animation-delay: -10s;
}

.orb4 {
  width: 500px; height: 500px;
  background: rgba(229, 255, 0, 0.08);
  top: 50%; left: -100px;
  animation-duration: 30s;
  animation-delay: -15s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -60px) scale(1.05); }
  66% { transform: translate(-30px, 40px) scale(0.95); }
  100% { transform: translate(50px, 50px) scale(1.1); }
}

/* --- 3D Angled Grid --- */
.bg-grid {
  position: absolute;
  width: 200vw;
  height: 200vh;
  left: -50vw;
  top: -20vh;
  /* ZZZ Neon Yellow Grid */
  background-image:
    linear-gradient(rgba(229, 255, 0, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(229, 255, 0, 0.25) 1px, transparent 1px);
  background-size: 30px 30px; /* Much smaller grid */
  z-index: 3;
  transform: perspective(800px) rotateX(65deg);
  transform-origin: top center;
  mask-image: linear-gradient(to bottom, transparent 0%, black 45%, black 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 45%, black 100%);
  animation: bgGridSlide 2s linear infinite; /* Faster movement */
  transition: all 0.5s ease-in-out;
}

@keyframes bgGridSlide {
  0% { background-position: 0 0; }
  100% { background-position: 0 30px; }
}

/* --- Data Particles --- */
.particles-canvas {
  position: absolute;
  inset: 0;
  z-index: 3; /* Above background and orbs, below CRT lines */
  pointer-events: none;
  transition: opacity 0.5s ease-in-out;
}

/* --- CRT Scanlines & Screen Noise --- */
.bg-crt {
  position: absolute; inset: 0;
  z-index: 4;
  background: 
    linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.15) 50%),
    linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
  background-size: 100% 4px, 3px 100%;
  pointer-events: none;
  opacity: 0.7;
  transition: opacity 0.5s ease-in-out;
}

/* Glitch Overrides */
:global(.glitch-mode .bg-grid) {
  animation: bgGridSlide 0.1s linear infinite !important;
  background-image:
    linear-gradient(rgba(255, 0, 0, 0.5) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 255, 0.5) 1px, transparent 1px);
}
:global(.glitch-mode .orb) {
  animation-duration: 0.5s !important;
  filter: blur(20px) hue-rotate(90deg);
}

/* --- Light Theme --- */
:global(.light-theme .bg) { background: #FFFFFF; }
:global(.light-theme .bg-base) {
  background: #FFFFFF;
}
/* Pet Walk App style dot background */
:global(.light-theme .bg-grid) {
  background-image: radial-gradient(circle, #333333 1.5px, transparent 1.5px);
  background-size: 14px 14px;
  opacity: 0.15;
  mask-image: none;
  -webkit-mask-image: none;
  transform: none;
  animation: lightBgGridSlide 5s linear infinite;
}

@keyframes lightBgGridSlide {
  0% { background-position: 0 0; }
  100% { background-position: 0 14px; }
}
:global(.light-theme .orb1), :global(.light-theme .orb2), :global(.light-theme .orb3), :global(.light-theme .orb4) {
  opacity: 0; /* Clean white look like pet-walk-app, using opacity for transition */
}
:global(.light-theme .bg-crt) { opacity: 0; }
</style>
