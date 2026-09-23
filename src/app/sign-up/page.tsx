import Link from "next/link";
import RegisterForm from "@/components/register-form";
import styles from "./page.module.css";

export default function SignUpPage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <div className={styles.card}>
        <span className={styles.eyebrow}>Alătură-te,</span>
        <h1 className={styles.title}>Înregistrează-te</h1>
        <p className={styles.lead}>
          Creează-ți un cont pentru a-ți păstra citatele preferate.
        </p>

        <RegisterForm />

        <p className={styles.switch}>
          Ai deja cont?{" "}
          <Link href="/sign-in" className={styles.switchLink}>
            Autentifică-te
          </Link>
        </p>
      </div>
    </section>
  );
}
