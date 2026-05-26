import { useEffect, useRef, useCallback } from 'react'
import { useDrinkStore } from '../store/drinkStore'

const easeOut = (t) => 1 - Math.pow(1 - t, 3)
const easeInOut = (t) => t < 0.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2
function hexToRgb(hex) {
  const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16)
  return [r,g,b]
}
function lerp(a,b,t){ return a+(b-a)*t }

export default function CupCanvas({ width = 340, height = 420 }) {
  const canvasRef = useRef(null)
  const stateRef = useRef({})
  const animRef = useRef(null)
  const pourRef = useRef({ active: false, particles: [], progress: 0, startTime: 0, steps: [] })
  const store = useDrinkStore()

  const buildLayers = useCallback((s) => {
    const layers = []
    if (s.base) layers.push({ color: s.base.color, dark: s.base.dark || s.base.color, frac: 0.52, label: s.base.label })
    if (s.milk && s.milk.id !== 'none') layers.push({ color: s.milk.color, dark: s.milk.color, frac: 0.28, label: s.milk.label })
    if (s.syrups?.length) {
      s.syrups.forEach(sy => layers.push({ color: sy.color, dark: sy.color, frac: 0.08 / s.syrups.length, label: sy.label }))
    }
    return layers
  }, [])

  useEffect(() => {
    const prev = stateRef.current
    const changed = prev.base?.id !== store.base?.id || prev.milk?.id !== store.milk?.id ||
      JSON.stringify(prev.syrups?.map(x=>x.id)) !== JSON.stringify(store.syrups?.map(x=>x.id)) ||
      JSON.stringify(prev.toppings?.map(x=>x.id)) !== JSON.stringify(store.toppings?.map(x=>x.id))

    stateRef.current = { base: store.base, milk: store.milk, syrups: store.syrups, toppings: store.toppings, temp: store.temp }

    if (changed) {
      pourRef.current = {
        active: true,
        progress: 0,
        startTime: performance.now(),
        duration: 2800,
        particles: [],
        layers: buildLayers(stateRef.current),
        hasFoam: store.milk?.id !== 'none',
        toppings: store.toppings || [],
      }
    }
  }, [store.animTrigger, buildLayers])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const DPR = window.devicePixelRatio || 1
    canvas.width = width * DPR
    canvas.height = height * DPR
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
    ctx.scale(DPR, DPR)

    const W = width, H = height
    const CX = W / 2
    const CUP_TOP_Y = H * 0.18
    const CUP_BOT_Y = H * 0.82
    const CUP_H = CUP_BOT_Y - CUP_TOP_Y
    const TW = W * 0.42, BW = W * 0.3
    const INNER_PAD = 4

    function cupLeftAt(y) {
      const t = (y - CUP_TOP_Y) / CUP_H
      return CX - lerp(TW/2, BW/2, t)
    }
    function cupRightAt(y) {
      const t = (y - CUP_TOP_Y) / CUP_H
      return CX + lerp(TW/2, BW/2, t)
    }
    function liquidTop(frac) { return CUP_BOT_Y - frac * CUP_H }

    function shade(hex, amt) {
      let [r,g,b] = hexToRgb(hex)
      r = Math.max(0,Math.min(255,r+amt)); g = Math.max(0,Math.min(255,g+amt)); b = Math.max(0,Math.min(255,b+amt))
      return `#${[r,g,b].map(v=>v.toString(16).padStart(2,'0')).join('')}`
    }

    function clipCupInner() {
      ctx.beginPath()
      ctx.moveTo(cupLeftAt(CUP_TOP_Y) + INNER_PAD, CUP_TOP_Y + INNER_PAD)
      ctx.lineTo(cupLeftAt(CUP_BOT_Y) + INNER_PAD, CUP_BOT_Y - 2)
      ctx.lineTo(cupRightAt(CUP_BOT_Y) - INNER_PAD, CUP_BOT_Y - 2)
      ctx.lineTo(cupRightAt(CUP_TOP_Y) - INNER_PAD, CUP_TOP_Y + INNER_PAD)
      ctx.closePath()
      ctx.clip()
    }

    function drawSaucer() {
      ctx.save()
      const sy = CUP_BOT_Y + 12
      const g = ctx.createRadialGradient(CX, sy, 5, CX, sy, TW * 0.7)
      g.addColorStop(0, '#3a2a18')
      g.addColorStop(0.6, '#2a1c10')
      g.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = g
      ctx.beginPath()
      ctx.ellipse(CX, sy, TW * 0.68, 14, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.strokeStyle = 'rgba(200,149,92,0.2)'
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.ellipse(CX, sy, TW * 0.6, 10, 0, 0, Math.PI * 2)
      ctx.stroke()
      ctx.restore()
    }

    function drawCupBody() {
      ctx.save()
      ctx.shadowColor = 'rgba(0,0,0,0.6)'
      ctx.shadowBlur = 24
      ctx.shadowOffsetY = 10

      const bodyGrad = ctx.createLinearGradient(CX - TW/2, 0, CX + TW/2, 0)
      bodyGrad.addColorStop(0, '#2e2218')
      bodyGrad.addColorStop(0.15, '#3c2e20')
      bodyGrad.addColorStop(0.5, '#f5ece0')
      bodyGrad.addColorStop(0.85, '#3c2e20')
      bodyGrad.addColorStop(1, '#2e2218')

      ctx.beginPath()
      ctx.moveTo(cupLeftAt(CUP_TOP_Y), CUP_TOP_Y)
      ctx.lineTo(cupLeftAt(CUP_BOT_Y), CUP_BOT_Y)
      ctx.arcTo(CX, CUP_BOT_Y + 6, cupRightAt(CUP_BOT_Y), CUP_BOT_Y, 8)
      ctx.lineTo(cupRightAt(CUP_BOT_Y), CUP_BOT_Y)
      ctx.lineTo(cupRightAt(CUP_TOP_Y), CUP_TOP_Y)
      ctx.closePath()
      ctx.fillStyle = bodyGrad
      ctx.fill()

      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(200,149,92,0.5)'
      ctx.lineWidth = 1.5
      ctx.stroke()
      ctx.restore()
    }

    function drawHandle() {
      ctx.save()
      const hx = cupRightAt(CUP_BOT_Y - CUP_H * 0.35) + 2
      const hy = CUP_BOT_Y - CUP_H * 0.35
      ctx.beginPath()
      ctx.arc(hx + 22, hy, 24, -1.2, 1.2)
      ctx.strokeStyle = '#c8b090'
      ctx.lineWidth = 11
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(hx + 22, hy, 24, -1.2, 1.2)
      ctx.strokeStyle = '#f5ece0'
      ctx.lineWidth = 7
      ctx.stroke()
      ctx.restore()
    }

    function drawRimHighlight() {
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cupLeftAt(CUP_TOP_Y) + 8, CUP_TOP_Y + 6)
      ctx.lineTo(cupRightAt(CUP_TOP_Y) - 8, CUP_TOP_Y + 6)
      ctx.strokeStyle = 'rgba(255,255,255,0.45)'
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    }

    function drawShineLine() {
      ctx.save()
      ctx.globalAlpha = 0.1
      ctx.beginPath()
      ctx.moveTo(cupLeftAt(CUP_TOP_Y) + 12, CUP_TOP_Y + 14)
      ctx.lineTo(cupLeftAt(CUP_BOT_Y) + 10, CUP_BOT_Y - 12)
      ctx.strokeStyle = '#fff'
      ctx.lineWidth = 8
      ctx.lineCap = 'round'
      ctx.stroke()
      ctx.restore()
    }

    function drawLiquidLayer(yTop, yBot, color, darkColor, alpha = 1) {
      const lx = cupLeftAt(yTop) + INNER_PAD, rx = cupRightAt(yTop) - INNER_PAD
      const lxb = cupLeftAt(yBot) + INNER_PAD, rxb = cupRightAt(yBot) - INNER_PAD
      const g = ctx.createLinearGradient(lx, 0, rx, 0)
      g.addColorStop(0, shade(color, -30))
      g.addColorStop(0.2, color)
      g.addColorStop(0.8, darkColor || color)
      g.addColorStop(1, shade(color, -30))
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(lx, yTop)
      ctx.lineTo(lxb, yBot)
      ctx.lineTo(rxb, yBot)
      ctx.lineTo(rx, yTop)
      ctx.closePath()
      ctx.fillStyle = g
      ctx.fill()
      ctx.restore()
    }

    function drawSurface(yTop, color) {
      const lx = cupLeftAt(yTop) + INNER_PAD, rx = cupRightAt(yTop) - INNER_PAD
      const mid = (lx + rx) / 2, hw = (rx - lx) / 2
      ctx.save()
      const sg = ctx.createRadialGradient(mid, yTop, 2, mid, yTop, hw)
      sg.addColorStop(0, 'rgba(255,255,255,0.18)')
      sg.addColorStop(0.6, 'rgba(255,255,255,0.06)')
      sg.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath()
      ctx.ellipse(mid, yTop, hw, 6, 0, 0, Math.PI * 2)
      ctx.fillStyle = sg
      ctx.fill()
      ctx.restore()
    }

    function drawFoam(yTop, alpha) {
      const lx = cupLeftAt(yTop) + INNER_PAD, rx = cupRightAt(yTop) - INNER_PAD
      const mid = (lx + rx) / 2, hw = (rx - lx) / 2
      ctx.save()
      ctx.globalAlpha = alpha
      const fg = ctx.createRadialGradient(mid - hw * 0.2, yTop - 3, 2, mid, yTop + 4, hw)
      fg.addColorStop(0, 'rgba(255,252,242,0.97)')
      fg.addColorStop(0.5, 'rgba(245,238,220,0.88)')
      fg.addColorStop(1, 'rgba(230,218,195,0.5)')
      ctx.beginPath()
      ctx.ellipse(mid, yTop + 2, hw, 11, 0, 0, Math.PI * 2)
      ctx.fillStyle = fg
      ctx.fill()
      const bubbles = [[mid-hw*0.35,yTop-2,5],[mid-hw*0.1,yTop-5,7],[mid+hw*0.28,yTop-1,5],[mid+hw*0.08,yTop+4,4],[mid-hw*0.18,yTop+4,3]]
      bubbles.forEach(([bx,by,br]) => {
        ctx.beginPath(); ctx.arc(bx,by,br,0,Math.PI*2)
        ctx.strokeStyle='rgba(255,255,255,0.65)'; ctx.lineWidth=1
        ctx.stroke(); ctx.fillStyle='rgba(255,252,242,0.25)'; ctx.fill()
      })
      ctx.restore()
    }

    function drawDrizzle(yTop, toppings, alpha) {
      if (!toppings?.length) return
      const colors = { chocdrizzle: '#5a1e00', carameldrizzle: '#c87820' }
      const lx = cupLeftAt(yTop) + INNER_PAD, rx = cupRightAt(yTop) - INNER_PAD
      toppings.filter(t => colors[t.id]).forEach(t => {
        ctx.save()
        ctx.globalAlpha = alpha * 0.9
        ctx.strokeStyle = colors[t.id]
        ctx.lineWidth = 2.5
        ctx.lineCap = 'round'
        const w = rx - lx
        for (let i = 0; i < 3; i++) {
          const ox = lx + w * (0.18 + i * 0.25)
          ctx.beginPath()
          ctx.moveTo(ox, yTop - 35)
          ctx.bezierCurveTo(ox+12,yTop-10, ox-10,yTop+10, ox+6,yTop+2)
          ctx.stroke()
        }
        ctx.restore()
      })
    }

    function drawCinnamonDust(yTop, toppings, alpha) {
      if (!toppings?.find(t => t.id === 'cinnamon' || t.id === 'cocoapowder')) return
      const lx = cupLeftAt(yTop) + INNER_PAD + 4, rx = cupRightAt(yTop) - INNER_PAD - 4
      ctx.save()
      ctx.globalAlpha = alpha * 0.5
      for (let i = 0; i < 80; i++) {
        const px = lx + Math.random() * (rx - lx)
        const py = yTop - 4 + Math.random() * 10
        ctx.beginPath(); ctx.arc(px, py, Math.random() * 1.2, 0, Math.PI * 2)
        ctx.fillStyle = toppings.find(t=>t.id==='cinnamon') ? '#c84020' : '#3a1800'
        ctx.fill()
      }
      ctx.restore()
    }

    function drawPourStream(x, fromY, toY, color, w, alpha) {
      const sg = ctx.createLinearGradient(x - w/2, 0, x + w/2, 0)
      sg.addColorStop(0, 'rgba(0,0,0,0.1)')
      sg.addColorStop(0.4, color)
      sg.addColorStop(0.6, color)
      sg.addColorStop(1, 'rgba(0,0,0,0.1)')
      ctx.save()
      ctx.globalAlpha = alpha
      ctx.beginPath()
      ctx.moveTo(x - w/2, fromY)
      ctx.bezierCurveTo(x - w/2 + 2, (fromY+toY)/2, x - w/2 - 2, (fromY+toY)/2, x - w/2 + 1, toY)
      ctx.lineTo(x + w/2, toY)
      ctx.bezierCurveTo(x + w/2 - 2, (fromY+toY)/2, x + w/2 + 2, (fromY+toY)/2, x + w/2 - 1, fromY)
      ctx.closePath()
      ctx.fillStyle = sg
      ctx.fill()
      ctx.restore()
    }

    function drawParticles(particles) {
      particles.forEach(p => {
        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.color; ctx.fill()
        ctx.restore()
      })
    }

    function drawIceCubes(yTop, temp) {
      if (temp?.id !== 'iced') return
      const lx = cupLeftAt(yTop + CUP_H * 0.3) + INNER_PAD + 8
      const rx = cupRightAt(yTop + CUP_H * 0.3) - INNER_PAD - 8
      const positions = [[lx + (rx-lx)*0.15, yTop + CUP_H*0.3, 18, 14],[lx+(rx-lx)*0.55, yTop+CUP_H*0.22, 16,13],[lx+(rx-lx)*0.35, yTop+CUP_H*0.38, 15,12]]
      positions.forEach(([ix,iy,iw,ih]) => {
        ctx.save()
        ctx.globalAlpha = 0.35
        ctx.beginPath(); ctx.roundRect(ix, iy, iw, ih, 4)
        ctx.fillStyle='rgba(210,240,255,0.6)'; ctx.fill()
        ctx.strokeStyle='rgba(180,220,255,0.8)'; ctx.lineWidth=1; ctx.stroke()
        ctx.globalAlpha=0.15
        ctx.beginPath(); ctx.moveTo(ix+3,iy+3); ctx.lineTo(ix+iw-3,iy+3)
        ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.stroke()
        ctx.restore()
      })
    }

    function frame(ts) {
      ctx.clearRect(0, 0, W, H)
      const pour = pourRef.current
      const state = stateRef.current

      if (pour.active) {
        const elapsed = ts - pour.startTime
        pour.progress = Math.min(1, elapsed / pour.duration)

        if (pour.particles && Math.random() < 0.6 && pour.progress < 0.85) {
          const layerIdx = Math.floor(pour.progress * pour.layers?.length || 0)
          const layer = pour.layers?.[layerIdx]
          if (layer) {
            pour.particles.push({ x: CX + (Math.random()-0.5)*12, y: CUP_TOP_Y - 55 + Math.random()*15, vy: 3+Math.random()*2, vx:(Math.random()-0.5), r:1.5+Math.random()*2.5, color: layer.color, alpha: 0.8 })
          }
        }
        pour.particles = (pour.particles||[]).filter(p => {
          p.y += p.vy; p.x += p.vx; p.vy += 0.25
          const top = liquidTop((pour.layers||[]).slice(0, Math.floor(pour.progress*(pour.layers?.length||1))+1).reduce((s,l)=>s+l.frac,0))
          if (p.y > top) p.alpha -= 0.12
          return p.alpha > 0
        })

        if (pour.progress >= 1) { pour.active = false; pour.particles = [] }
      }

      const layers = pour.active ? pour.layers || buildLayers(state) : buildLayers(state)
      const hasFoam = state.milk?.id !== 'none'
      const toppings = state.toppings || []
      const temp = state.temp

      let cumFrac = 0
      const pourP = pour.active ? easeOut(pour.progress) : 1

      drawSaucer()

      ctx.save(); clipCupInner()

      layers.forEach((layer, i) => {
        const frac = layer.frac * pourP
        const prevFrac = layers.slice(0, i).reduce((s,l)=>s+l.frac,0) * pourP
        const yBot = liquidTop(prevFrac)
        const yTop = liquidTop(prevFrac + frac)
        drawLiquidLayer(yTop, yBot, layer.color, layer.dark)
        if (i === layers.length - 1) { drawSurface(yTop, layer.color) }
        cumFrac = prevFrac + frac
      })

      const totalFrac = layers.reduce((s,l)=>s+l.frac,0) * pourP
      const topY = liquidTop(totalFrac)

      if (temp?.id === 'iced') drawIceCubes(topY, temp)
      ctx.restore()

      const foamAlpha = pour.active ? Math.max(0, (pour.progress - 0.75) / 0.2) : 1
      const topAlpha = pour.active ? Math.max(0, (pour.progress - 0.8) / 0.18) : 1

      if (hasFoam && foamAlpha > 0) drawFoam(topY, foamAlpha)
      if (topAlpha > 0) {
        drawDrizzle(topY, toppings, topAlpha)
        drawCinnamonDust(topY, toppings, topAlpha)
      }

      drawCupBody()
      drawHandle()
      drawRimHighlight()
      drawShineLine()

      if (pour.active && pour.progress < 0.9) {
        const layerIdx = Math.min(Math.floor(pour.progress * (layers.length || 1)), (layers.length||1) - 1)
        const layer = layers[layerIdx]
        if (layer) {
          const streamAlpha = pour.progress < 0.8 ? 0.9 : (1 - pour.progress) / 0.2
          drawPourStream(CX, CUP_TOP_Y - 55, topY, layer.color, 7, streamAlpha)
        }
      }

      drawParticles(pour.particles || [])

      animRef.current = requestAnimationFrame(frame)
    }

    pourRef.current = {
      active: true, progress: 0, startTime: performance.now(), duration: 2800,
      particles: [], layers: buildLayers(stateRef.current),
      hasFoam: true, toppings: store.toppings || [],
    }

    animRef.current = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(animRef.current)
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      style={{ borderRadius: 16, background: 'transparent', display: 'block' }}
      aria-label="3D animated drink preview"
    />
  )
}
