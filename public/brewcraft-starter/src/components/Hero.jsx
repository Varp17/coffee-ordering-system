import { useEffect, useRef } from 'react'
import styles from './Hero.module.css'

export default function Hero({ onStart }) {
  const titleRef = useRef(null)

  useEffect(() => {
    const el = titleRef.current
    if (!el) return
    el.style.opacity = 0
    el.style.transform = 'translateY(30px)'
    requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.9s ease, transform 0.9s ease'
      el.style.opacity = 1
      el.style.transform = 'translateY(0)'
    })
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.bgOrbs}>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
      </div>
      <div className={styles.content} ref={titleRef}>
        <div className={styles.badge}>✦ Artisan Coffee Builder</div>
        <h1 className={styles.title}>
          Craft your<br /><em>perfect brew</em>
        </h1>
        <p className={styles.sub}>Choose your base, milk, syrups and toppings. Watch it come alive in 3D — then share or order instantly.</p>
        <button className={styles.cta} onClick={onStart}>
          Start building
          <span className={styles.ctaArrow}>→</span>
        </button>
        <div className={styles.stats}>
          <div className={styles.stat}><strong>4</strong> bases</div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><strong>5</strong> milks</div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><strong>5</strong> syrups</div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><strong>5</strong> toppings</div>
        </div>
      </div>
      <div className={styles.floatingCups}>
        <div className={styles.floatCard} style={{ '--delay': '0s', '--x': '10%', '--y': '20%' }}>Cold Brew</div>
        <div className={styles.floatCard} style={{ '--delay': '0.4s', '--x': '70%', '--y': '60%' }}>Matcha Latte</div>
        <div className={styles.floatCard} style={{ '--delay': '0.8s', '--x': '80%', '--y': '15%' }}>Caramel Espresso</div>
        <div className={styles.floatCard} style={{ '--delay': '1.1s', '--x': '5%', '--y': '65%' }}>Chai Oat Blend</div>
      </div>
    </section>
  )
}
