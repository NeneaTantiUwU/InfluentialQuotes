import styles from "./footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>© {new Date().getFullYear()} Citate Influente. Toate drepturile rezervate.</p>
        <p className={styles.tagline}>Cuvinte care au schimbat lumea.</p>
      </div>
    </footer>
  );
}
