"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import Modal from "./modal";
import styles from "./auth-page.module.css";

export default function EmailConfirmed() {
  const [status, setStatus] = useState<"checking" | "valid" | "invalid">(
    "checking"
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setStatus("valid");
        setShowModal(true);
      } else {
        setStatus("invalid");
      }
    });
  }, []);

  if (status === "checking") {
    return <p className={styles.lead}>Se verifică emailul…</p>;
  }

  if (status === "invalid") {
    return (
      <p className={styles.lead}>
        Link invalid sau expirat.{" "}
        <Link href="/sign-in" className={styles.switchLink}>
          Autentifică-te
        </Link>{" "}
        direct.
      </p>
    );
  }

  return (
    <Modal
      open={showModal}
      onClose={() => setShowModal(false)}
      title="Email confirmat!"
    >
      Adresa ta de email a fost confirmată cu succes. Contul tău este acum
      activ.
    </Modal>
  );
}
