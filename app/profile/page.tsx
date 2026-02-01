import { RevealItem, RevealSection } from "@/components/Reveal";
import {
  certifications,
  experience,
  languages,
  projects,
  skills,
  person,
  impact,
  education,
  interests,
} from "@/components/data";
import layout from "@/styles/layout.module.css";
import ui from "@/styles/components.module.css";
import profile from "@/styles/profile.module.css";

function Pill({ text }: { text: string }) {
  return <span className={ui.pill}>{text}</span>;
}

export default function ProfilePage() {
  return (
    <main className={layout.shell}>
      {/* HEADER */}
      <RevealSection>
        <RevealItem>
          <div className={`${ui.cardStrong} ${profile.header}`}>
            <div className={profile.title}>Profile</div>
            <div className={profile.sub}>
              Skills, experience, and projects — organized like an engineer would (because you are one).
            </div>
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 8 }}>
              <Pill text={person.title} />
              <Pill text="Network engineering" />
              <Pill text="Cloud infrastructure" />
              <Pill text="Security mindset" />
            </div>
          </div>
        </RevealItem>
      </RevealSection>

      {/* IMPACT */}
      <RevealSection>
        <RevealItem>
          <h2 className={layout.h2}>Impact</h2>
        </RevealItem>

        <div style={{ marginTop: 16 }} className={profile.two}>
          {impact.map((m) => (
            <RevealItem key={m.label}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <div style={{ fontSize: 12.5, color: "var(--muted2)", fontWeight: 750 }}>
                  {m.label}
                </div>
                <div
                  style={{
                    marginTop: 8,
                    fontSize: 28,
                    fontWeight: 850,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {m.value}
                </div>
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealSection>

      {/* SKILLS */}
      <RevealSection>
        <RevealItem>
          <h2 className={layout.h2}>Tech & Skills</h2>
        </RevealItem>

        <div style={{ marginTop: 16 }} className={profile.two}>
          <RevealItem>
            <div className={`${ui.card} ${profile.block}`}>
              <div className={profile.blockTitle}>Networking</div>
              <div className={profile.meta}>Routing • Switching • Operations</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {skills.networking.map((s) => (
                  <Pill key={s} text={s} />
                ))}
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.card} ${profile.block}`}>
              <div className={profile.blockTitle}>Cloud</div>
              <div className={profile.meta}>Infrastructure • Containers • Security</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {skills.cloud.map((s) => (
                  <Pill key={s} text={s} />
                ))}
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.card} ${profile.block}`}>
              <div className={profile.blockTitle}>Security</div>
              <div className={profile.meta}>Practical safeguards</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {skills.security.map((s) => (
                  <Pill key={s} text={s} />
                ))}
              </div>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.card} ${profile.block}`}>
              <div className={profile.blockTitle}>Development & Systems</div>
              <div className={profile.meta}>Automation • Tooling</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {skills.dev.map((s) => (
                  <Pill key={s} text={s} />
                ))}
                {skills.systems?.map((s) => (
                  <Pill key={s} text={s} />
                ))}
              </div>
            </div>
          </RevealItem>

          {/* OPTIONAL: Soft Skills (only shows if skills.soft exists) */}
          {skills.soft?.length ? (
            <RevealItem>
              <div className={`${ui.card} ${profile.block}`}>
                <div className={profile.blockTitle}>Soft Skills</div>
                <div className={profile.meta}>How I work with people + problems</div>
                <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                  {skills.soft.map((s) => (
                    <Pill key={s} text={s} />
                  ))}
                </div>
              </div>
            </RevealItem>
          ) : null}
        </div>
      </RevealSection>

      {/* EXPERIENCE */}
      <RevealSection>
        <RevealItem>
          <h2 className={layout.h2}>Experience</h2>
        </RevealItem>

        <div style={{ marginTop: 16, display: "grid", gap: 16 }}>
          {experience.map((e) => (
            <RevealItem key={`${e.role}-${e.org}`}>
              <div className={`${ui.cardStrong} ${profile.expCard}`}>
                <div className={profile.expTop}>
                  <div className={profile.expRole}>{e.role}</div>
                  <div className={profile.expWhen}>{e.when}</div>
                </div>

                <div className={profile.expOrg}>{e.org}</div>

                <ul className={profile.list}>
                  {e.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealSection>

      {/* PROJECTS */}
      <RevealSection>
        <RevealItem>
          <h2 className={layout.h2}>Projects</h2>
        </RevealItem>

        <div style={{ marginTop: 16 }} className={profile.two}>
          {projects.map((p) => (
            <RevealItem key={`${p.name}-${p.org}`}>
              <div className={`${ui.card} ${ui.cardPad}`}>
                <div className={profile.expTop}>
                  <div className={profile.expRole}>{p.name}</div>
                  <div className={profile.expWhen}>{p.when}</div>
                </div>

                <div className={profile.expOrg}>{p.org}</div>

                <ul className={profile.list}>
                  {p.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            </RevealItem>
          ))}
        </div>
      </RevealSection>

      {/* CERTS + LANGUAGES */}
      <RevealSection>
        <div className={profile.two}>
          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div className={profile.blockTitle}>Certifications</div>
              <ul className={profile.list}>
                {certifications.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div className={profile.blockTitle}>Languages</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {languages.map((l) => (
                  <Pill key={l} text={l} />
                ))}
              </div>
            </div>
          </RevealItem>
        </div>
      </RevealSection>

      {/* EDUCATION + INTERESTS */}
      <RevealSection>
        <div className={profile.two}>
          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div className={profile.blockTitle}>Education</div>
              <ul className={profile.list}>
                {education.map((e) => (
                  <li key={e.school}>
                    <strong style={{ color: "var(--ink)" }}>{e.school}</strong>
                    <br />
                    <span style={{ color: "var(--muted)" }}>{e.program}</span>
                    <br />
                    <span style={{ color: "var(--muted2)" }}>{e.when}</span>
                  </li>
                ))}
              </ul>
            </div>
          </RevealItem>

          <RevealItem>
            <div className={`${ui.cardStrong} ${ui.cardPad}`}>
              <div className={profile.blockTitle}>Interests</div>
              <div style={{ marginTop: 12 }} className={profile.skillWrap}>
                {interests.map((i) => (
                  <Pill key={i} text={i} />
                ))}
              </div>
            </div>
          </RevealItem>
        </div>
      </RevealSection>
    </main>
  );
}
