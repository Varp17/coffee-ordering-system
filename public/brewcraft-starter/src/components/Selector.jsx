import { useDrinkStore, MENU } from '../store/drinkStore'
import styles from './Selector.module.css'

function IngredientCard({ item, selected, onClick, multi }) {
  return (
    <button
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={onClick}
      aria-pressed={selected}
    >
      {item.img && (
        <div className={styles.imgWrap}>
          <img src={item.img} alt={item.label} loading="lazy" />
          <div className={styles.imgOverlay} />
        </div>
      )}
      {!item.img && (
        <div className={styles.colorDot} style={{ background: item.color || '#3a2010' }} />
      )}
      <div className={styles.cardInfo}>
        <span className={styles.cardLabel}>{item.label}</span>
        {item.desc && <span className={styles.cardDesc}>{item.desc}</span>}
        <span className={styles.cardPrice}>+₹{item.price}</span>
      </div>
      {selected && <div className={styles.checkMark}>✓</div>}
    </button>
  )
}

function Section({ title, children }) {
  return (
    <div className={styles.section}>
      <h3 className={styles.sectionTitle}>{title}</h3>
      {children}
    </div>
  )
}

export default function Selector() {
  const { base, milk, syrups, toppings, size, temp, setBase, setMilk, toggleSyrup, toggleTopping, setSize, setTemp } = useDrinkStore()

  return (
    <div className={styles.wrap}>
      <Section title="Choose your base">
        <div className={styles.grid}>
          {MENU.bases.map(b => (
            <IngredientCard key={b.id} item={b} selected={base?.id === b.id} onClick={() => setBase(b)} />
          ))}
        </div>
      </Section>

      <Section title="Choose milk">
        <div className={styles.grid}>
          {MENU.milks.map(m => (
            <IngredientCard key={m.id} item={m} selected={milk?.id === m.id} onClick={() => setMilk(m)} />
          ))}
        </div>
      </Section>

      <Section title="Add syrups">
        <div className={styles.gridSmall}>
          {MENU.syrups.map(s => (
            <button
              key={s.id}
              className={`${styles.pill} ${syrups.find(x=>x.id===s.id) ? styles.pillActive : ''}`}
              onClick={() => toggleSyrup(s)}
              style={syrups.find(x=>x.id===s.id) ? { '--pill-color': s.color } : {}}
            >
              <span className={styles.pillDot} style={{ background: s.color }} />
              {s.label}
              <span className={styles.pillPrice}>+₹{s.price}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Add toppings">
        <div className={styles.gridSmall}>
          {MENU.toppings.map(t => (
            <button
              key={t.id}
              className={`${styles.pill} ${toppings.find(x=>x.id===t.id) ? styles.pillActive : ''}`}
              onClick={() => toggleTopping(t)}
            >
              <span className={styles.pillDot} style={{ background: t.color }} />
              {t.label}
              <span className={styles.pillPrice}>+₹{t.price}</span>
            </button>
          ))}
        </div>
      </Section>

      <Section title="Size & temperature">
        <div className={styles.row}>
          <div className={styles.segGroup}>
            {MENU.sizes.map(s => (
              <button key={s.id} className={`${styles.seg} ${size?.id === s.id ? styles.segActive : ''}`} onClick={() => setSize(s)}>
                <span className={styles.segLabel}>{s.label}</span>
                <span className={styles.segSub}>{s.oz}</span>
              </button>
            ))}
          </div>
          <div className={styles.segGroup}>
            {MENU.temps.map(t => (
              <button key={t.id} className={`${styles.seg} ${temp?.id === t.id ? styles.segActive : ''}`} onClick={() => setTemp(t)}>
                <span className={styles.segIcon}>{t.icon}</span>
                <span className={styles.segLabel}>{t.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  )
}
