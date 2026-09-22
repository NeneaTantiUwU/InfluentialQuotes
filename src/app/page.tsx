
import styles from "./page.module.css";

export default function Home() {
  return (
    <>
      <section className={`container ${styles.hero}`}>
        <div className={styles.heroLeft}>
          <span className={styles.eyebrow}>Bine ai venit,</span>
          <h1 className={styles.title}>
            Cuvinte care au <em>schimbat</em> lumea
          </h1>
        </div>
        <div className={styles.heroRight}>
          <p className={styles.lead}>
            Citate Influente e un spațiu dedicat sfatului lăsat în urmă de
            personalități remarcabile, ale căror cuvinte inspiră.
          </p>
          <p className={styles.lead}>
            Reflecții organizate simplu și plăcut de răsfoit,
            indiferent dacă cauți o idee pentru azi sau o sursă de inspirație pe
            termen lung.
          </p>
        </div>
      </section>

      <section
        className={`container ${styles.quoteBlock}`}
        style={{ "--accent": "var(--color-tehnologie)" } as React.CSSProperties}
      >

        <blockquote className={styles.featured}>
          <p>
            Imaginația este mai importantă decât cunoașterea, căci cunoașterea
            este limitată, în timp ce imaginația cuprinde întreaga lume.
          </p>
          <footer>— Albert Einstein</footer>
        </blockquote>
      </section>

      <section className={`container ${styles.categories}`}>
        <h2 className={styles.sectionTitle}>Răsfoiește, Inspiră-te, Aplică</h2>
        <p className={styles.sectionLead}>
          Citatul este o reflecție a realității, iar realitatea nu este una singură, se traduce prin percepții. 
          Deci fiecare citat reprezintă o percepție a realității.
        </p>
      </section>
    </>
  );
}
