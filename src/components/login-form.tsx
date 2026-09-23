"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { isValidEmail } from "@/lib/auth-validation";
import GoogleAuthButton from "./google-auth-button";
import PasswordField from "./password-field";
import styles from "./auth-form.module.css";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [message, setMessage] = useState("");

  function validateField(field: keyof FieldErrors, value: string) {
    let error: string | undefined;
    if (field === "email" && !isValidEmail(value)) {
      error = "Adresă invalidă. Format așteptat: nume@mail.extensie.";
    }
    if (field === "password" && value.length === 0) {
      error = "Introdu parola.";
    }
    setFieldErrors((prev) => ({ ...prev, [field]: error }));
    return !error;
  }

  function validateAll() {
    const validEmail = validateField("email", email);
    const validPassword = validateField("password", password);
    return validEmail && validPassword;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateAll()) return;

    setStatus("loading");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }

    setStatus("success");
    setMessage("Autentificare reușită.");
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <label className={styles.field}>
          <span>Email</span>
          <input
            placeholder="Introduceți email-ul de utilizator"
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
          onChange={(value) => {
            setPassword(value);
            validateField("password", value);
          }}
          error={fieldErrors.password}
        />

        <button type="submit" className={styles.submit} disabled={status === "loading"}>
          {status === "loading" ? "Se autentifică…" : "Autentifică-te"}
        </button>

        {message && (
          <p className={status === "error" ? styles.error : styles.success}>
            {message}
          </p>
        )}
      </form>

      <div className={styles.divider}>
        <span>sau</span>
      </div>

      <GoogleAuthButton label="Autentifică-te cu Google" />
    </>
  );
}
