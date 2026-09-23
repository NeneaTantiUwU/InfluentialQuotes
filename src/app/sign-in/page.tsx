import Link from "next/link";
import LoginForm from "@/components/login-form";
import styles from "./page.module.css";

export default function SignInPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Bine ai revenit,</span>
        <h1 className={styles.title}>Autentifică-te</h1>
        <p className={styles.lead}>
          Intră în cont pentru a-ți continua lectura acolo unde ai rămas.
        </p>

        <LoginForm />

        <p className={styles.switch}>
          Nu ai cont încă?{" "}
          <Link href="/sign-up" className={styles.switchLink}>
            Înregistrează-te
          </Link>
        </p>
      </div>
    </section>
  );
}
