"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "@/styles/navbar.module.css";

function NavA({ href, label }: { href: string; label: string }) {
  const path = usePathname();
  const active = path === href;

  return (
    <Link className={`${styles.a} ${active ? styles.active : ""}`} href={href}>
      {label}
    </Link>
  );
}

export default function Navbar() {
  return (
    <header className={styles.wrap}>
      <div className={styles.inner}>
        <Link href="/" className={styles.brand} aria-label="Home">
          <span className={styles.prompt}>$</span>
          <span>harniiil@network</span>
          <span className={styles.cursor} aria-hidden="true" />
        </Link>

        <nav className={styles.nav}>
          <NavA href="/" label="Home" />
          <NavA href="/profile" label="Profile" />
          <a className={styles.a} href="/#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
