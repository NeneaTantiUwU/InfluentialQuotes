"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import styles from "./navbar.module.css";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre-noi", label: "Despre Noi" },
];

const SEARCHABLE_PAGES = [
  { match: "acasa", href: "/" },
  { match: "despre noi", href: "/despre-noi" },
  { match: "citate", href: "/citate" },
  { match: "favorite", href: "/favorite" },
  { match: "autentificare", href: "/sign-in" },
  { match: "inregistrare", href: "/sign-up" },
];

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

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
  const router = useRouter();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const raw = searchValue.trim();
    if (!raw) return;

    const normalized = normalize(raw);
    const page = SEARCHABLE_PAGES.find(
      (p) => p.match.startsWith(normalized) || normalized.startsWith(p.match)
    );

    router.push(page ? page.href : `/citate?q=${encodeURIComponent(raw)}`);
    setSearchValue("");
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsSignedIn(!!data.session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsSignedIn(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.logo}>
          Citate<span>Influente</span>
        </Link>

        <form onSubmit={handleSearch} role="search" className={styles.searchForm}>
          <input
            type="search"
            name="q"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
        </form>

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
                  onClick={(e) => e.currentTarget.blur()}
                  className={styles.dropdownItem}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>

          {isSignedIn ? (
            <>
              <Link
                href="/favorite"
                className={`${styles.link} ${
                  pathname === "/favorite" ? styles.active : ""
                }`}
              >
                Favorite
              </Link>

              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className={styles.link}
              >
                Deconectare
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
