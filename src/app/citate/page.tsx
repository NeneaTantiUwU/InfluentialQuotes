import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

const DEFAULT_CATEGORY = "history";

type Quote = {
  id: string | number;
  text: string;
  author: string;
  category: string;
};

function categoryLabel(slug: string) {
  switch (slug) {
    case "history":
      return "Istorie";
    case "politics":
      return "Politică";
    case "economics":
      return "Economie";
    case "poetry":
      return "Poezie";
    case "literature":
      return "Literatură";
    case "philosophy":
      return "Filozofie";
    case "art":
      return "Artă";
    case "science":
      return "Știință";
    case "technology":
      return "Tehnologie";
    default:
      return slug;
  }
}

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
        <div className={styles.grid}>
          {list.map((quote) => (
            <article key={quote.id} className={styles.card}>
              <span className={styles.category}>
                {categoryLabel(quote.category)}
              </span>
              <p className={styles.text}>{quote.text}</p>
              <span className={styles.author}>{quote.author}</span>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
