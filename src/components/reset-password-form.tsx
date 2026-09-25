"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isPasswordValid, getPasswordChecks } from "@/lib/auth-validation";
import PasswordField from "./password-field";
import Modal from "./modal";
import styles from "./auth-form.module.css";

export default function ResetPasswordForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [sessionState, setSessionState] = useState<"checking" | "ready" | "invalid">(
    "checking"
  );
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const passwordChecks = getPasswordChecks(password);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSessionState(data.session ? "ready" : "invalid");
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

    setShowSuccess(true);
  }

  if (sessionState === "checking") {
    return <p className={styles.fieldError}>Se verifică link-ul…</p>;
  }

  if (sessionState === "invalid") {
    return (
      <p className={styles.fieldError}>
        Link invalid sau expirat. Solicită unul nou din pagina de
        autentificare.
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
          label="Confirmă parola"
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
        onClose={() => {
          setShowSuccess(false);
          router.push("/sign-in");
        }}
        title="Parolă schimbată"
        closeLabel="Autentifică-te"
      >
        Parola ta a fost actualizată cu succes. Te poți autentifica acum cu
        noua parolă.
      </Modal>
    </>
  );
}
