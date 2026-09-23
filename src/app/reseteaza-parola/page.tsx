import ResetPasswordForm from "@/components/reset-password-form";
import styles from "@/components/auth-page.module.css";

export default function ResetPasswordPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Recuperare cont</span>
        <h1 className={styles.title}>Setează o parolă nouă</h1>
        <p className={styles.lead}>Alege o parolă nouă pentru contul tău.</p>

        <ResetPasswordForm />
      </div>
    </section>
  );
}
