import { onMounted, onUnmounted } from 'vue'

export function useTilt(elementRef, options = { max: 3, perspective: 1200, glare: true }) {
  let cleanup = () => {}

  onMounted(() => {
    const el = elementRef.value
    if (!el) return
    
    // Disable on mobile/touch devices
    const isMobile = window.matchMedia('(max-width: 768px)').matches || window.matchMedia('(pointer: coarse)').matches
    if (isMobile) return

    el.style.transformStyle = 'preserve-3d'
    el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    
    let glareEl = null
    if (options.glare) {
      glareEl = document.createElement('div')
      glareEl.style.position = 'absolute'
      glareEl.style.inset = '0'
      glareEl.style.pointerEvents = 'none'
      glareEl.style.background = 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 60%)'
      glareEl.style.opacity = '0'
      glareEl.style.transition = 'opacity 0.5s'
      glareEl.style.zIndex = '10'
      glareEl.style.borderRadius = getComputedStyle(el).borderRadius || 'inherit'
      if (getComputedStyle(el).position === 'static') {
        el.style.position = 'relative'
      }
      el.appendChild(glareEl)
    }

    const onMouseMove = (e) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const centerX = rect.width / 2
      const centerY = rect.height / 2
      
      const rotateX = ((y - centerY) / centerY) * -options.max
      const rotateY = ((x - centerX) / centerX) * options.max
      
      el.style.transition = 'none'
      el.style.transform = `perspective(${options.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      
      if (glareEl) {
        glareEl.style.transition = 'none'
        glareEl.style.opacity = '1'
        glareEl.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 50%)`
      }
    }
    
    const onMouseLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
      el.style.transform = `perspective(${options.perspective}px) rotateX(0deg) rotateY(0deg)`
      
      if (glareEl) {
        glareEl.style.transition = 'opacity 0.5s'
        glareEl.style.opacity = '0'
      }
    }
    
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    
    cleanup = () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
      if (glareEl && glareEl.parentNode) {
        glareEl.parentNode.removeChild(glareEl)
      }
    }
  })

  onUnmounted(() => {
    cleanup()
  })
}
