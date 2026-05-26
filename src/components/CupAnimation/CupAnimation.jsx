import React, { useRef, useEffect, useCallback } from 'react';
import './CupAnimation.css';

/**
 * CupAnimation — React wrapper for the canvas coffee cup loader.
 * Converted from public/coffee_cup_loader_animation.html
 */
const CupAnimation = ({ autoPlay = true, size = 220, className = '' }) => {
  const canvasRef = useRef(null);
  const animRef = useRef({ t: 0, lastTs: null, paused: false, stableT: 0, stableLastTs: null, looping: false });

  const draw = useCallback((ctx, W, H) => {
    const RED = '#6F4E37', DARK_RED = '#5D4032', CREAM = '#f0ead6', WHITE = '#faf6f1', SHADOW = '#1a0a08';
    const { t } = animRef.current;
    const TOTAL = 10000;

    function easeInOut(v) { return v < 0.5 ? 2 * v * v : 1 - Math.pow(-2 * v + 2, 2) / 2; }
    function lerp(a, b, v) { return a + (b - a) * v; }
    function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
    function remap(v, a, b, c, d) { return lerp(c, d, clamp((v - a) / (b - a), 0, 1)); }

    function drawTakeawayCup(x, y, scale, colorAlpha, outlineAlpha) {
      ctx.save();
      const s = scale;
      const cw = 68 * s, ch = 80 * s, lh = 18 * s, bh = 12 * s;
      const cx = x, cy = y;

      if (colorAlpha > 0.3) {
        ctx.globalAlpha = colorAlpha * 0.3;
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.ellipse(cx, cy + ch + lh + 2 * s, cw * 0.42, 7 * s, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = colorAlpha;
      ctx.fillStyle = RED;
      ctx.beginPath();
      ctx.moveTo(cx - cw * 0.38, cy + lh * 0.9);
      ctx.lineTo(cx - cw * 0.48, cy + lh);
      ctx.lineTo(cx + cw * 0.48, cy + lh);
      ctx.lineTo(cx + cw * 0.38, cy + lh * 0.9);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.ellipse(cx, cy + lh * 0.3, cw * 0.38, lh * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.roundRect(cx - 10 * s, cy + lh * 0.6, 20 * s, lh * 0.4, 4 * s);
      ctx.fill();

      const tw2 = cw * 0.52, bw2 = cw * 0.72;
      const ty = cy + lh, by = cy + lh + ch;

      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.moveTo(cx - lerp(tw2, bw2, 0.78) / 2, ty + ch * 0.78);
      ctx.lineTo(cx - bw2 / 2, by);
      ctx.lineTo(cx + bw2 / 2, by);
      ctx.lineTo(cx + lerp(tw2, bw2, 0.78) / 2, ty + ch * 0.78);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = RED;
      ctx.beginPath();
      ctx.moveTo(cx - tw2 / 2, ty);
      ctx.lineTo(cx - lerp(tw2, bw2, 0.78) / 2, ty + ch * 0.78);
      ctx.lineTo(cx + lerp(tw2, bw2, 0.78) / 2, ty + ch * 0.78);
      ctx.lineTo(cx + tw2 / 2, ty);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = DARK_RED;
      ctx.beginPath();
      ctx.moveTo(cx - lerp(tw2, bw2, 0.2) / 2, ty + ch * 0.18);
      ctx.lineTo(cx - lerp(tw2, bw2, 0.24) / 2, ty + ch * 0.24);
      ctx.lineTo(cx + lerp(tw2, bw2, 0.24) / 2, ty + ch * 0.24);
      ctx.lineTo(cx + lerp(tw2, bw2, 0.2) / 2, ty + ch * 0.18);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.moveTo(cx - bw2 / 2, by - bh);
      ctx.lineTo(cx - bw2 / 2, by);
      ctx.lineTo(cx + bw2 / 2, by);
      ctx.lineTo(cx + bw2 / 2, by - bh);
      ctx.closePath();
      ctx.fill();

      if (colorAlpha > 0.2) {
        ctx.globalAlpha = colorAlpha;
        const bx = cx, bearY = ty + ch * 0.46;
        const br = 11 * s;
        ctx.fillStyle = WHITE;
        ctx.beginPath();
        ctx.ellipse(bx, bearY, br, br * 1.3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = RED;
        ctx.lineWidth = 1.5 * s;
        ctx.beginPath();
        ctx.moveTo(bx, bearY - br * 0.9);
        ctx.bezierCurveTo(bx + br * 0.5, bearY, bx + br * 0.5, bearY, bx, bearY + br * 0.9);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(bx, bearY - br * 0.9);
        ctx.bezierCurveTo(bx - br * 0.5, bearY, bx - br * 0.5, bearY, bx, bearY + br * 0.9);
        ctx.stroke();
      }

      if (outlineAlpha > 0) {
        ctx.globalAlpha = outlineAlpha * colorAlpha;
        ctx.strokeStyle = 'rgba(255,255,255,0.2)';
        ctx.lineWidth = 1 * s;
        ctx.beginPath();
        ctx.moveTo(cx - tw2 / 2, ty);
        ctx.lineTo(cx - bw2 / 2, by);
        ctx.lineTo(cx + bw2 / 2, by);
        ctx.lineTo(cx + tw2 / 2, ty);
        ctx.closePath();
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      ctx.restore();
    }

    function drawEspressoCup(x, y, scale, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      const s = scale;
      const cw = 36 * s, ch = 28 * s;

      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.ellipse(x, y + ch + 5 * s, cw * 0.8, 5 * s, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ddd9cc';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.fillStyle = WHITE;
      ctx.beginPath();
      ctx.moveTo(x - cw * 0.4, y);
      ctx.lineTo(x - cw * 0.5, y + ch);
      ctx.lineTo(x + cw * 0.5, y + ch);
      ctx.lineTo(x + cw * 0.4, y);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ddd9cc';
      ctx.lineWidth = 0.5;
      ctx.stroke();

      ctx.strokeStyle = '#ddd9cc';
      ctx.lineWidth = 2 * s;
      ctx.beginPath();
      ctx.arc(x + cw * 0.55, y + ch * 0.5, 7 * s, -Math.PI * 0.5, Math.PI * 0.5);
      ctx.stroke();

      ctx.fillStyle = '#5c3317';
      ctx.globalAlpha = alpha * 0.7;
      ctx.beginPath();
      ctx.ellipse(x, y + 4 * s, cw * 0.35, 5 * s, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    function drawGlow(x, y, r, alpha) {
      ctx.save();
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(111,78,55,${alpha * 0.18})`);
      g.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(x, y, r, r * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function drawCupOutline(x, y, w, h, alpha) {
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = WHITE;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const tw = w * 0.55, bw = w * 0.7;
      ctx.beginPath();
      ctx.moveTo(x - tw / 2, y);
      ctx.lineTo(x - bw / 2, y + h);
      ctx.lineTo(x + bw / 2, y + h);
      ctx.lineTo(x + tw / 2, y);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.ellipse(x, y + h, bw / 2, 6, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x + tw / 4, y);
      ctx.lineTo(x + tw / 4 - 8, y - 28);
      ctx.stroke();
      ctx.restore();
    }

    // Render
    ctx.clearRect(0, 0, W, H);
    const p = Math.min(t / TOTAL, 1);
    const cx = W / 2, cy = H / 2;

    if (p <= 0.25) {
      const pp = remap(p, 0, 0.25, 0, 1);
      drawCupOutline(cx, 55, 90, 95, easeInOut(pp));
    } else if (p <= 0.5) {
      const pp = remap(p, 0.25, 0.5, 0, 1);
      const ease = easeInOut(pp);
      drawTakeawayCup(cx, 30, 1.15, ease, lerp(1, 0, ease));
    } else if (p <= 0.75) {
      const pp = remap(p, 0.5, 0.75, 0, 1);
      const ease = easeInOut(pp);
      const mainX = lerp(cx, cx - 18, ease);
      drawTakeawayCup(mainX, 30, 1.15, 1, 0);
      drawEspressoCup(lerp(cx + 50, cx + 52, ease), 105, lerp(0.3, 0.9, ease), ease * 0.5);
    } else {
      const pp = remap(p, 0.75, 1.0, 0, 1);
      const ease = easeInOut(pp);
      drawGlow(cx - 18, 160, 90, lerp(0, 0.9, ease));
      drawTakeawayCup(cx - 18, 30, 1.15, 1, 0);
      drawEspressoCup(cx + 52, 105, 0.9, ease);
      if (p > 0.92) {
        const pulse = (Math.sin(t * 0.003) + 1) * 0.5;
        drawGlow(cx - 18, 160, 100, 0.05 + pulse * 0.08);
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = size;
    const H = size;
    canvas.width = W * (window.devicePixelRatio || 1);
    canvas.height = H * (window.devicePixelRatio || 1);
    ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);

    const anim = animRef.current;
    anim.t = 0;
    anim.lastTs = null;
    anim.stableT = 0;
    anim.stableLastTs = null;
    anim.looping = true;

    const TOTAL = 10000;
    let rafId;

    function loop(ts) {
      if (!anim.looping) return;
      if (!anim.lastTs) anim.lastTs = ts;
      const dt = ts - anim.lastTs;
      anim.lastTs = ts;
      if (!anim.paused) {
        anim.t += dt;
        draw(ctx, W, H);
        if (anim.t / TOTAL < 1) {
          rafId = requestAnimationFrame(loop);
        } else {
          rafId = requestAnimationFrame(stableLoop);
        }
      } else {
        rafId = requestAnimationFrame(loop);
      }
    }

    function stableLoop(ts) {
      if (!anim.looping) return;
      if (!anim.stableLastTs) anim.stableLastTs = ts;
      if (!anim.paused) {
        anim.stableT += ts - anim.stableLastTs;
        anim.t = TOTAL + anim.stableT;
        draw(ctx, W, H);
      }
      anim.stableLastTs = ts;
      rafId = requestAnimationFrame(stableLoop);
    }

    if (autoPlay) {
      rafId = requestAnimationFrame(loop);
    } else {
      anim.t = TOTAL;
      draw(ctx, W, H);
    }

    return () => {
      anim.looping = false;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [size, autoPlay, draw]);

  return (
    <div className={`cup-animation-wrap ${className}`}>
      <canvas
        ref={canvasRef}
        style={{ width: size, height: size, display: 'block' }}
      />
    </div>
  );
};

export default CupAnimation;
