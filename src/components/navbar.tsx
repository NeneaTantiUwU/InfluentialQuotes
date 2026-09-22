"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

const links = [
  { href: "/", label: "Acasă" },
  { href: "/despre-noi", label: "Despre Noi" },
  { href: "/citate", label: "Citate" },
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
        </nav>
      </div>
    </header>
  );
}
