"use client";

import { useEffect } from "react";
import styles from "./modal.module.css";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  closeLabel?: string;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  closeLabel = "Închide",
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="modal-title" className={styles.title}>
          {title}
        </h2>
        <div className={styles.body}>{children}</div>
        <button type="button" onClick={onClose} className={styles.close}>
          {closeLabel}
        </button>
      </div>
    </div>
  );
}
