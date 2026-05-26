import styles from './Builder.module.css'
import Selector from '../components/Selector'
import Summary from '../components/Summary'

export default function Builder() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.logo}>BrewCraft</h1>
        <p className={styles.tagline}>Build your perfect drink</p>
      </div>

      <div className={styles.layout}>
        <div className={styles.left}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.builderTitle}>Create your custom drink</h2>
            <p className={styles.builderSub}>Every selection updates your 3D preview live →</p>
          </div>
          <Selector />
        </div>
        <div className={styles.right}>
          <Summary />
        </div>
      </div>
    </div>
  )
}
