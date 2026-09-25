import ChangePasswordForm from "@/components/change-password-form";
import styles from "@/components/auth-page.module.css";

export default function ChangePasswordPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Contul tău</span>
        <h1 className={styles.title}>Schimbă parola</h1>
        <p className={styles.lead}>
          Alege o parolă nouă pentru contul tău — fără email, direct din cont.
        </p>

        <ChangePasswordForm />
      </div>
    </section>
  );
}
