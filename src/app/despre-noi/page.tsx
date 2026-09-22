import styles from "./page.module.css";

const values = [
  {
    number: "I",
    title: "Autenticitate",
    text: "Fiecare citat este atribuit corect, cu context real despre autorul său.",
  },
  {
    number: "II",
    title: "Diversitate",
    text: "Voci din din toate colțurile lumii.",
  },
];

export default function AboutPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.top}>
        <div>
          <span className={styles.eyebrow}>Despre idee,</span>
          <h1 className={styles.title}>Despre Noi</h1>
        </div>

        <div className={styles.content}>
          <p>
            Citate Influente reprezintă o pasiune simplă: Înțelepciunea, ce
            trebuie împărtășită! Am construit acest spațiu ca pe un manuscris
            colectiv, adunând cuvintele celor care au avut curajul să
            gândească diferit și puterea de a-și transforma ideile morale în
            realitate.
          </p>
        </div>
      </div>

      <blockquote className={styles.manifesto}>
        <p>
          Un citat bun nu e doar o propoziție frumoasă — e o fereastră către o
          minte care a gândit înaintea ta.
        </p>
      </blockquote>

      <h2 className={styles.valuesTitle}>Ce ne ghidează:</h2>
      <div className={styles.list}>
        {values.map((value) => (
          <div key={value.title} className={styles.row}>
            <span className={styles.rowNumber}>{value.number}</span>
            <h3>{value.title}</h3>
            <p>{value.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
