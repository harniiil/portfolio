import styles from "@/styles/footer.module.css";
import { person } from "@/components/data";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <strong style={{ color: "var(--ink)" }}>{person.name}</strong> • {person.location}
        </div>
        <div>Built with Next.js • CSS Modules • Framer Motion</div>
      </div>
    </footer>
  );
}
