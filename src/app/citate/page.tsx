import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { categoryLabel, type Quote } from "@/lib/quotes";
import QuotesGrid from "@/components/quotes-grid";
import styles from "./page.module.css";

const DEFAULT_CATEGORY = "history";

export default async function CitatePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;

  if (!category && !q) {
    redirect(`/citate?category=${DEFAULT_CATEGORY}`);
  }

  let list: Quote[] = [];
  let title = "";
  let lead = "";

  if (q) {
    const [byText, byAuthor] = await Promise.all([
      supabase.from("quotes").select("*").ilike("text", `%${q}%`),
      supabase.from("quotes").select("*").ilike("author", `%${q}%`),
    ]);

    if (byText.error || byAuthor.error) {
      console.error(
        "Supabase search error:",
        byText.error?.message ?? byAuthor.error?.message
      );
      return (
        <section className={`container ${styles.wrapper}`}>
          <p className={styles.empty}>Eroare la căutare.</p>
        </section>
      );
    }

    const merged = new Map<string, Quote>();
    for (const quote of [...(byText.data ?? []), ...(byAuthor.data ?? [])]) {
      merged.set(quote.id, quote as Quote);
    }
    list = Array.from(merged.values());

    title = `Rezultate pentru „${q}”`;
    lead = `${list.length} citate găsite.`;
  } else {
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

    list = (quotes ?? []) as Quote[];
    title = categoryLabel(category!);
    lead = `${list.length} citate.`;
  }

  return (
    <section className={`container ${styles.wrapper}`}>
      <span className={styles.eyebrow}>Colecția noastră</span>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.lead}>{lead}</p>

      {list.length === 0 ? (
        <p className={styles.empty}>
          {q ? "Niciun citat nu corespunde căutării." : "Niciun citat în această categorie."}
        </p>
      ) : (
        <QuotesGrid quotes={list} />
      )}
    </section>
  );
}
