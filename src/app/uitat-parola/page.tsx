import Link from "next/link";
import ForgotPasswordForm from "@/components/forgot-password-form";
import styles from "@/components/auth-page.module.css";

export default function ForgotPasswordPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Recuperare cont</span>
        <h1 className={styles.title}>Ai uitat parola?</h1>
        <p className={styles.lead}>
          Introdu adresa de email cu care ești înregistrat și îți trimitem un
          link pentru resetarea parolei.
        </p>

        <ForgotPasswordForm />

        <p className={styles.switch}>
          Ți-ai amintit parola?{" "}
          <Link href="/sign-in" className={styles.switchLink}>
            Autentifică-te
          </Link>
        </p>
      </div>
    </section>
  );
}
