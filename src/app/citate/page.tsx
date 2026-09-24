import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { categoryLabel, type Quote } from "@/lib/quotes";
import QuotesGrid from "@/components/quotes-grid";
import styles from "./page.module.css";

const DEFAULT_CATEGORY = "history";

export default async function CitatePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  if (!category) {
    redirect(`/citate?category=${DEFAULT_CATEGORY}`);
  }

  const { data: quotes, error } = await supabase
    .from("quotes")
    .select("*")
    .eq("category", category)
    .order("category");

  if (error) {
    console.error("Supabase quotes error:", error.message);
    return (
      <section className={`container ${styles.wrapper}`}>
        <p className={styles.empty}>Eroare la încărcarea citatelor.</p>
      </section>
    );
  }

  const list = (quotes ?? []) as Quote[];

  return (
    <section className={`container ${styles.wrapper}`}>
      <span className={styles.eyebrow}>Colecția noastră</span>
      <h1 className={styles.title}>{categoryLabel(category)}</h1>
      <p className={styles.lead}>{list.length} citate.</p>

      {list.length === 0 ? (
        <p className={styles.empty}>Niciun citat în această categorie.</p>
      ) : (
        <QuotesGrid quotes={list} />
      )}
    </section>
  );
}
