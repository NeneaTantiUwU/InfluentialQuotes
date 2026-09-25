"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { isPasswordValid, getPasswordChecks } from "@/lib/auth-validation";
import PasswordField from "./password-field";
import Modal from "./modal";
import styles from "./auth-form.module.css";
import pageStyles from "./auth-page.module.css";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionState, setSessionState] = useState<
    "checking" | "ready" | "signed-out"
  >("checking");
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const passwordChecks = getPasswordChecks(password);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "ready" : "signed-out");
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!isPasswordValid(password)) {
      setError("Parola nu îndeplinește toate cerințele de mai jos.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Parolele nu coincid.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setPassword("");
    setConfirmPassword("");
    setShowSuccess(true);
  }

  if (sessionState === "checking") {
    return <p className={pageStyles.lead}>Se verifică…</p>;
  }

  if (sessionState === "signed-out") {
    return (
      <p className={pageStyles.lead}>
        Trebuie să fii autentificat pentru a-ți schimba parola.{" "}
        <Link href="/sign-in" className={pageStyles.switchLink}>
          Autentifică-te
        </Link>
        .
      </p>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <PasswordField label="Parolă nouă" value={password} onChange={setPassword}>
          <ul className={styles.requirements}>
            <li className={passwordChecks.length ? styles.reqMet : styles.reqUnmet}>
              Minim 8 caractere
            </li>
            <li className={passwordChecks.uppercase ? styles.reqMet : styles.reqUnmet}>
              O literă mare (ex: A, B, C)
            </li>
            <li className={passwordChecks.number ? styles.reqMet : styles.reqUnmet}>
              O cifră (ex: 1, 2, 3)
            </li>
            <li className={passwordChecks.special ? styles.reqMet : styles.reqUnmet}>
              Un caracter special (ex: @#$!)
            </li>
          </ul>
        </PasswordField>

        <PasswordField
          label="Confirmă parola nouă"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {error && <p className={styles.fieldError}>{error}</p>}

        <button type="submit" className={styles.submit} disabled={loading}>
          {loading ? "Se salvează…" : "Salvează parola nouă"}
        </button>
      </form>

      <Modal
        open={showSuccess}
        onClose={() => setShowSuccess(false)}
        title="Parolă schimbată"
      >
        Parola ta a fost actualizată cu succes.
      </Modal>
    </>
  );
}
