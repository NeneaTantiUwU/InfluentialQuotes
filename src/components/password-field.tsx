"use client";

import { useState } from "react";
import styles from "./auth-form.module.css";

type PasswordFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  children?: React.ReactNode;
};

export default function PasswordField({
  label,
  value,
  onChange,
  error,
  children,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <label className={styles.field}>
      <span>{label}</span>
      <div className={styles.passwordWrapper}>
        <input
          placeholder="Introduceți parola"
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className={styles.eyeButton}
          aria-label={visible ? "Ascunde parola" : "Arată parola"}
        >
          {visible ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.5 9s2.7-5.5 7.5-5.5S16.5 9 16.5 9s-2.7 5.5-7.5 5.5S1.5 9 1.5 9z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.3" />
              <line x1="2" y1="16" x2="16" y2="2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1.5 9s2.7-5.5 7.5-5.5S16.5 9 16.5 9s-2.7 5.5-7.5 5.5S1.5 9 1.5 9z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="9" cy="9" r="2.25" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          )}
        </button>
      </div>
      {children}
      {error && <p className={styles.fieldError}>{error}</p>}
    </label>
  );
}
