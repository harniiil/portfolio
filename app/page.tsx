import Image from "next/image";
import { RevealItem, RevealSection } from "@/components/Reveal";
import { highlights, person } from "@/components/data";
import layout from "@/styles/layout.module.css";
import home from "@/styles/home.module.css";
import ui from "@/styles/components.module.css";

export default function HomePage() {
  return (
    <main className={layout.shell}>
      {/* HERO (merged into ONE card) */}
      <RevealSection tight>
        <RevealItem>
          <div className={`${ui.cardStrong} ${ui.cardPad} ${home.heroCard}`}>
            {/* LEFT: photo + buttons */}
            <div className={home.leftCol}>
              <div className={home.pfpRoundWrap}>
                <Image
                  src="/pfp.jpg"
                  alt={`${person.name} profile`}
                  width={1200}
                  height={1200}
                  className={home.pfpImg}
                  priority
                />
              </div>

              <div className={home.leftActions}>
                <a className={ui.btnPrimary} href="/profile">
                  View profile
                </a>
                <a className={ui.btnGhost} href="#contact">
                  Contact
                </a>
                <a
                  className={ui.btnGhost}
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              </div>
            </div>

            {/* RIGHT: text + pills */}
            <div className={home.rightCol}>
              <div>
                <h1 className={home.name}>{person.name}</h1>
                <div className={home.subtitle}>{person.title}</div>
              </div>

              <p className={home.kicker}>{person.summary}</p>

              <div className={home.actionPills}>
                <span className={ui.pill}>{person.location}</span>
                <span className={ui.pill}>Networking</span>
                <span className={ui.pill}>Cloud</span>
                <span className={ui.pill}>Security</span>
              </div>
            </div>
          </div>
        </RevealItem>
      </RevealSection>

      {/* OVERVIEW */}
      <RevealSection>
        <RevealItem>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: 14,
              flexWrap: "wrap",
            }}
          >
            <h2 className={layout.h2}>Overview</h2>
            <p className={layout.pMuted} style={{ fontSize: 13, maxWidth: 520 }}>
              Reliable systems, clean troubleshooting, security-minded defaults.
            </p>
          </div>
        </RevealItem>

        <div style={{ marginTop: 16 }} className={home.grid3}>
          {highlights.map((h) => (
            <RevealItem key={h.title}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <div className={home.smallTitle}>{h.title}</div>
                <div className={home.smallDesc}>{h.desc}</div>
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealSection>

      {/* CONTACT */}
      <RevealSection id="contact">
        <RevealItem>
          <h2 className={layout.h2}>Contact</h2>
          <p className={layout.pMuted} style={{ marginTop: 8, maxWidth: 680 }}>
            Email is best. LinkedIn is second-best (assuming LinkedIn isn’t having
            one of its moods).
          </p>
        </RevealItem>

        <div style={{ marginTop: 16 }} className={home.contactGrid}>
          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Direct</div>
              <div
                style={{
                  marginTop: 14,
                  fontSize: 14,
                  color: "var(--muted)",
                  lineHeight: 1.9,
                }}
              >
                <div>
                  <span style={{ color: "var(--ink)", fontWeight: 700 }}>
                    Email:
                  </span>{" "}
                  <a className={ui.link} href={`mailto:${person.email}`}>
                    {person.email}
                  </a>
                </div>
                <div>
                  <span style={{ color: "var(--ink)", fontWeight: 700 }}>
                    Phone:
                  </span>{" "}
                  <a
                    className={ui.link}
                    href={`tel:${person.phone.replace(/\s/g, "")}`}
                  >
                    {person.phone}
                  </a>
                </div>
                <div>
                  <span style={{ color: "var(--ink)", fontWeight: 700 }}>
                    Location:
                  </span>{" "}
                  {person.location}
                </div>
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Links</div>
              <div
                style={{
                  marginTop: 14,
                  display: "grid",
                  gap: 10,
                  fontSize: 14,
                }}
              >
                <a
                  className={ui.link}
                  href={person.linkedin}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  className={ui.link}
                  href={person.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  GitHub
                </a>
                <a className={ui.link} href="/profile">
                  Full profile →
                </a>
              </div>
            </div>
          </RevealItem>
        </div>
      </RevealSection>
    </main>
  );
}
