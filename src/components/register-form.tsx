"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { getSiteUrl } from "@/lib/site-url";
import {
  isValidEmail,
  isKnownEmailDomain,
  isValidUsername,
  isPasswordValid,
  getPasswordChecks,
  translateAuthError,
} from "@/lib/auth-validation";
import PasswordField from "./password-field";
import Modal from "./modal";
import styles from "./auth-form.module.css";

type FieldErrors = {
  username?: string;
  email?: string;
};

async function isAvailable(field: "username" | "email", value: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq(field, value)
    .maybeSingle();

  // If the profiles table isn't set up yet, don't block signup over it.
  if (error) return true;
  return !data;
}

export default function RegisterForm() {
  const router = useRouter();
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
    if (field === "email") {
      if (!isValidEmail(value)) {
        error = "Adresă invalidă. Format așteptat: nume@mail.extensie.";
      } else if (!isKnownEmailDomain(value)) {
        error =
          "Folosește un furnizor cunoscut (ex: gmail.com, yahoo.com, outlook.com).";
      }
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
    setMessage("");

    const [usernameAvailable, emailAvailable] = await Promise.all([
      isAvailable("username", username),
      isAvailable("email", email),
    ]);

    let hasConflict = false;
    if (!usernameAvailable) {
      setFieldErrors((prev) => ({
        ...prev,
        username: "Acest nume de utilizator este deja folosit.",
      }));
      hasConflict = true;
    }
    if (!emailAvailable) {
      setFieldErrors((prev) => ({
        ...prev,
        email: "Există deja un cont cu acest email.",
      }));
      hasConflict = true;
    }
    if (hasConflict) {
      setStatus("idle");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username, email },
        emailRedirectTo: `${getSiteUrl()}/email-confirmat`,
      },
    });

    if (error) {
      setStatus("error");
      setMessage(translateAuthError(error.message));
      if (error.message === "User already registered") {
        setFieldErrors((prev) => ({
          ...prev,
          email: "Există deja un cont cu acest email.",
        }));
      }
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
            placeholder="Setați un mail (ex: nume@gmail.com)"
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

      <Modal
        open={showThankYou}
        onClose={() => {
          setShowThankYou(false);
          router.push("/");
        }}
        title="Mulțumim!"
      >
        Contul tău a fost creat cu succes. Mulțumim că te-ai alăturat
        comunității Citate Influente!
      </Modal>
    </>
  );
}
