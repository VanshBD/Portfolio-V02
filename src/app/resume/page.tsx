import type { Metadata } from "next";
import Link from "next/link";
import { profile, resume, cases, work, achievements } from "@/content/site";

export const metadata: Metadata = {
  title: "Vansh Dobariya · Résumé",
  description: "Full-Stack Developer in Ahmedabad, India, focused on backend systems. Experience, projects, awards and contact.",
  alternates: { canonical: "/resume" },
};

/* Recruiter mode: everything on one plain page, no animation. */
export default function ResumePage() {
  const projects = [
    ...cases.map((c) => ({ title: c.name, line: c.summary, live: c.live, code: c.code, tag: c.kicker })),
    ...work.map((w) => ({ title: w.title, line: w.line, live: w.live, code: w.code, tag: w.kind })),
  ];
  return (
    <div className="resume">
      <main>
        <nav className="resume__nav">
          <Link href="/">← Back to the portfolio</Link>
          <a href={profile.resumePdf} download>Download PDF</a>
        </nav>

        <header>
          <h1>{profile.name}</h1>
          <p className="resume__role">{profile.role} · {profile.focus} · {profile.city}</p>
          <p className="resume__status">{profile.status} · open to building together</p>
          <p className="resume__links">
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
            <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
          <p>{profile.sub}</p>
        </header>

        <section>
          <h2>Experience</h2>
          {resume.experience.map((e) => (
            <article key={e.org}>
              <h3>{e.role} · {e.org}</h3>
              <p className="resume__meta">{e.when} · {e.where}</p>
              <ul>{e.points.map((p) => <li key={p}>{p}</li>)}</ul>
            </article>
          ))}
        </section>

        <section>
          <h2>Projects</h2>
          <ul className="resume__projects">
            {projects.map((p) => (
              <li key={p.title}>
                <b>{p.title}</b> <span className="resume__meta">{p.tag}</span>
                <span> · {p.line}</span>
                {(p.live || p.code) && (
                  <span className="resume__plinks">
                    {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Live</a>}
                    {p.code && <a href={p.code} target="_blank" rel="noopener noreferrer">Code</a>}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Achievements</h2>
          <ul>{achievements.map((a) => <li key={a.label}><b>{a.value} {a.label}</b> · {a.detail}</li>)}</ul>
        </section>

        <section>
          <h2>Education</h2>
          <ul>{resume.education.map((e) => <li key={e}>{e}</li>)}</ul>
        </section>

        <section>
          <h2>Skills</h2>
          <dl className="resume__skills">
            {resume.skills.map((s) => (<div key={s.group}><dt>{s.group}</dt><dd>{s.items}</dd></div>))}
            <div><dt>Languages</dt><dd>{resume.languages}</dd></div>
          </dl>
        </section>
      </main>
    </div>
  );
}
