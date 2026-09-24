import EmailConfirmed from "@/components/email-confirmed";
import styles from "@/components/auth-page.module.css";

export default function EmailConfirmedPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Confirmare cont</span>
        <h1 className={styles.title}>Email confirmat</h1>

        <EmailConfirmed />
      </div>
    </section>
  );
}
