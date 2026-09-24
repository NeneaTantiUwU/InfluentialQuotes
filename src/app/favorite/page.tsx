import FavoritesList from "@/components/favorites-list";
import styles from "@/app/citate/page.module.css";

export default function FavoritePage() {
  return (
    <section className={`container ${styles.wrapper}`}>
      <span className={styles.eyebrow}>Colecția ta</span>
      <h1 className={styles.title}>Favorite</h1>
      <p className={styles.lead}>Citatele pe care le-ai salvat pentru mai târziu.</p>

      <FavoritesList />
    </section>
  );
}
