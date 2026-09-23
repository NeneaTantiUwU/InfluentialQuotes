"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre-noi", label: "Despre Noi" },
];

const categories = [
  { slug: "history", label: "Istorie" },
  { slug: "politics", label: "Politică" },
  { slug: "economics", label: "Economie" },
  { slug: "poetry", label: "Poezie" },
  { slug: "literature", label: "Literatură" },
  { slug: "philosophy", label: "Filozofie" },
  { slug: "art", label: "Artă" },
  { slug: "science", label: "Știință" },
  { slug: "technology", label: "Tehnologie" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          Citate<span>Influente</span>
        </Link>

          <input
            type="search"
            name="q"
            placeholder="Caută…"
            aria-label="Caută citate"
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton} aria-label="Caută">
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="7" cy="7" r="5.25" stroke="currentColor" strokeWidth="1.4" />
              <line
                x1="11.1"
                y1="11.1"
                x2="14.5"
                y2="14.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>

        <nav className={styles.nav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.link} ${
                pathname === link.href ? styles.active : ""
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className={styles.dropdown}>
            <button
              type="button"
              onClick={(e) => e.currentTarget.blur()}
              className={`${styles.link} ${
                pathname === "/citate" ? styles.active : ""
              }`}
            >
              Citate
              <svg
                width="10"
                height="6"
                viewBox="0 0 10 6"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className={styles.chevron}
              >
                <path
                  d="M1 1L5 5L9 1"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={styles.dropdownMenu}>
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/citate?category=${category.slug}`}
                  className={styles.dropdownItem}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          <Link
            href="/sign-in"
            className={`${styles.link} ${
              pathname === "/sign-in" ? styles.active : ""
            }`}
          >
            Autentifică-te
          </Link>

          <Link
            href="/sign-up"
            className={`${styles.link} ${
              pathname === "/sign-up" ? styles.active : ""
            }`}
          >
            Înregistrează-te
          </Link>
        </nav>
      </div>
    </header>
  );
}
