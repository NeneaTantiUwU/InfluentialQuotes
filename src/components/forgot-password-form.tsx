"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/auth-validation";
import Modal from "./modal";
import styles from "./auth-form.module.css";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [showSent, setShowSent] = useState(false);

  function validate(value: string) {
    if (!isValidEmail(value)) {
      setError("Adresă invalidă. Format așteptat: nume@mail.extensie.");
      return false;
    }
    setError("");
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate(email)) return;

    setStatus("loading");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reseteaza-parola`,
    });

    setStatus("idle");

    if (error) {
      setError(error.message);
      return;
    }

    setShowSent(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label className={styles.field}>
          <span>Email</span>
          <input
            type="email"
            placeholder="Introdu emailul contului tău"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) validate(e.target.value);
            }}
          />
          {error && <p className={styles.fieldError}>{error}</p>}
        </label>

        <button type="submit" className={styles.submit} disabled={status === "loading"}>
          {status === "loading" ? "Se trimite…" : "Trimite link de resetare"}
        </button>
      </form>

      <Modal
        open={showSent}
        onClose={() => setShowSent(false)}
        title="Verifică-ți emailul"
      >
        Ți-am trimis un link de resetare a parolei la {email}. Link-ul e
        valabil o perioadă limitată, din motive de securitate.
      </Modal>
    </>
  );
}
