"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { categoryLabel, type Quote } from "@/lib/quotes";
import styles from "@/app/citate/page.module.css";

export default function QuotesGrid({ quotes }: { quotes: Quote[] }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadFavorites(uid: string) {
      const { data } = await supabase
        .from("favorites")
        .select("quote_id")
        .eq("user_id", uid)
        .in(
          "quote_id",
          quotes.map((q) => q.id)
        );

      if (active && data) {
        setFavorites(new Set(data.map((row) => row.quote_id as string)));
      }
    }

    supabase.auth.getSession().then(({ data }) => {
      const uid = data.session?.user.id ?? null;
      if (!active) return;
      setUserId(uid);
      if (uid) loadFavorites(uid);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const uid = session?.user.id ?? null;
      setUserId(uid);
      if (uid) {
        loadFavorites(uid);
      } else {
        setFavorites(new Set());
      }
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function toggleFavorite(quoteId: string) {
    if (!userId || pendingId) return;
    setPendingId(quoteId);

    if (favorites.has(quoteId)) {
      await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("quote_id", quoteId);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.delete(quoteId);
        return next;
      });
    } else {
      await supabase
        .from("favorites")
        .insert({ user_id: userId, quote_id: quoteId });
      setFavorites((prev) => new Set(prev).add(quoteId));
    }

    setPendingId(null);
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

          {userId && (
            <button
              type="button"
              onClick={() => toggleFavorite(quote.id)}
              disabled={pendingId === quote.id}
              className={styles.heart}
              aria-label={
                favorites.has(quote.id)
                  ? "Elimină din favorite"
                  : "Adaugă la favorite"
              }
              aria-pressed={favorites.has(quote.id)}
            >
              <svg
                width="20"
                height="18"
                viewBox="0 0 20 18"
                xmlns="http://www.w3.org/2000/svg"
                fill={favorites.has(quote.id) ? "currentColor" : "none"}
              >
                <path
                  d="M10 17S1 11.5 1 5.8C1 2.9 3.2 1 5.8 1c1.6 0 3.1.8 4.2 2.2C11.1 1.8 12.6 1 14.2 1 16.8 1 19 2.9 19 5.8 19 11.5 10 17 10 17z"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
        </article>
      ))}
    </div>
  );
}
