"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  isValidEmail,
  isValidUsername,
  isPasswordValid,
  getPasswordChecks,
} from "@/lib/auth-validation";
import GoogleAuthButton from "./google-auth-button";
import PasswordField from "./password-field";
import Modal from "./modal";
import styles from "./auth-form.module.css";

type FieldErrors = {
  username?: string;
  email?: string;
};

export default function RegisterForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);

  const passwordChecks = getPasswordChecks(password);

  function validateField(field: keyof FieldErrors, value: string) {
    let error: string | undefined;
    if (field === "username" && !isValidUsername(value)) {
      error = "3-20 caractere: litere, cifre sau underscore.";
    }
    if (field === "email" && !isValidEmail(value)) {
      error = "Adresă invalidă. Format așteptat: nume@mail.extensie.";
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  }

  function validateAll() {
    const validUsername = validateField("username", username);
    const validEmail = validateField("email", email);
    return validUsername && validEmail && isPasswordValid(password);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;

    setStatus("loading");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, email },
      },
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setShowThankYou(true);
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label className={styles.field}>
          <span>Nume utilizator</span>
          <input
            placeholder="Setați un nume de utilizator"
            type="text"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              validateField("username", e.target.value);
            }}
          />
          {fieldErrors.username && (
            <p className={styles.fieldError}>{fieldErrors.username}</p>
          )}
        </label>

        <label className={styles.field}>
          <span>Email</span>
          <input
            placeholder="Setați un mail (ex: nume@mail.extensie)"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              validateField("email", e.target.value);
            }}
          />
          {fieldErrors.email && <p className={styles.fieldError}>{fieldErrors.email}</p>}
        </label>

        <PasswordField
          label="Parolă"
          value={password}
          onChange={(value) => setPassword(value)}
        >
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

        <button type="submit" className={styles.submit} disabled={status === "loading"}>
          {status === "loading" ? "Se creează contul…" : "Înregistrează-te"}
        </button>

        {message && <p className={styles.error}>{message}</p>}
      </form>

      <div className={styles.divider}>
        <span>sau</span>
      </div>

      <GoogleAuthButton label="Înregistrează-te cu Google" />

      <Modal
        open={showThankYou}
        onClose={() => setShowThankYou(false)}
        title="Mulțumim!"
      >
        Contul tău a fost creat cu succes. Mulțumim că te-ai alăturat
        comunității Citate Influente! Verifică-ți emailul pentru a-ți
        confirma contul.
      </Modal>
    </>
  );
}
