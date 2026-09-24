"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { categoryLabel, type Quote } from "@/lib/quotes";
import styles from "@/app/citate/page.module.css";

type FavoriteRow = {
  quote_id: string;
  quotes: Quote | null;
};

export default function FavoritesList() {
  const [status, setStatus] = useState<
    "checking" | "signed-out" | "loading" | "ready"
  >("checking");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFavorites(uid: string) {
      setStatus("loading");
      const { data, error } = await supabase
        .from("favorites")
        .select("quote_id, quotes(id, text, author, category)")
        .eq("user_id", uid)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (error) {
        console.error("Failed to load favorites:", error.message);
        setStatus("ready");
        return;
      }

      const rows = (data ?? []) as unknown as FavoriteRow[];
      setQuotes(rows.map((row) => row.quotes).filter((q): q is Quote => !!q));
      setStatus("ready");
    }

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      if (!active) return;
      setUserId(uid);
      if (uid) {
        loadFavorites(uid);
      } else {
        setStatus("signed-out");
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      setUserId(uid);
      if (uid) {
        loadFavorites(uid);
      } else {
        setQuotes([]);
        setStatus("signed-out");
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  async function removeFavorite(quoteId: string) {
    if (!userId || removingId) return;
    setRemovingId(quoteId);

    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", userId)
      .eq("quote_id", quoteId);

    if (error) {
      console.error("Failed to remove favorite:", error.message);
    } else {
      setQuotes((prev) => prev.filter((q) => q.id !== quoteId));
    }

    setRemovingId(null);
  }

  if (status === "checking" || status === "loading") {
    return <p className={styles.empty}>Se încarcă…</p>;
  }

  if (status === "signed-out") {
    return (
      <p className={styles.empty}>
        Trebuie să fii autentificat pentru a vedea favoritele tale.{" "}
        <Link href="/sign-in" className={styles.emptyLink}>
          Autentifică-te
        </Link>
        .
      </p>
    );
  }

  if (quotes.length === 0) {
    return (
      <p className={styles.empty}>
        Nu ai încă niciun citat favorit. Adaugă unul apăsând pe inimioară din
        pagina Citate.
      </p>
    );
  }

  return (
    <div className={styles.grid}>
      {quotes.map((quote) => (
        <article key={quote.id} className={styles.card}>
          <span className={styles.category}>
            {categoryLabel(quote.category)}
          </span>
          <p className={styles.text}>{quote.text}</p>
          <span className={styles.author}>{quote.author}</span>

          <button
            type="button"
            onClick={() => removeFavorite(quote.id)}
            disabled={removingId === quote.id}
            className={styles.heart}
            aria-label="Elimină din favorite"
            aria-pressed="true"
          >
            <svg
              width="20"
              height="18"
              viewBox="0 0 20 18"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
            >
              <path
                d="M10 17S1 11.5 1 5.8C1 2.9 3.2 1 5.8 1c1.6 0 3.1.8 4.2 2.2C11.1 1.8 12.6 1 14.2 1 16.8 1 19 2.9 19 5.8 19 11.5 10 17 10 17z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </article>
      ))}
    </div>
  );
}
