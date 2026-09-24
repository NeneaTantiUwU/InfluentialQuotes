"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { isValidEmail, translateAuthError } from "@/lib/auth-validation";
import PasswordField from "./password-field";
import Modal from "./modal";
import styles from "./auth-form.module.css";

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">(
    "idle"
  );
  const [message, setMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

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
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setStatus("error");
      setMessage(translateAuthError(error.message));
      return;
    }

    setStatus("success");
    setShowSuccess(true);
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

        <Link href="/uitat-parola" className={styles.forgotLink}>
          Ai uitat parola?
        </Link>

        <button type="submit" className={styles.submit} disabled={status === "loading"}>
          {status === "loading" ? "Se autentifică…" : "Autentifică-te"}
        </button>

        {message && <p className={styles.error}>{message}</p>}
      </form>

      <Modal
        open={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          router.push("/");
        }}
        title="Autentificare reușită"
      >
        Te-ai autentificat cu succes. Bine ai revenit!
      </Modal>
    </>
  );
}
