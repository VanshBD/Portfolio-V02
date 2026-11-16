import { principles, achievements, learning, profile } from "@/content/site";
import { CheckPills } from "./CheckPills";
import { HowGraphic, BlockToy } from "./Interactive";
import { Duck, VisitCommit } from "./Playful";

/* ── How I build ── */
export function HowIBuild() {
  return (
    <section id="how" className="section how" data-section="how" data-path="/how">
      <div className="container">
        <p className="eyebrow" data-reveal>How I build</p>
        <h2 className="h2" data-split>Fast. Correct. Running.</h2>
        <p className="lede" data-reveal>Three things every system I build has to be, and the numbers that prove it.</p>
        <div className="how__grid">
          {principles.map((p, i) => (
            <article key={p.key} className="how__card" data-reveal data-delay={i * 0.08} data-spotlight>
              <p className="how__key mono">{String(i + 1).padStart(2, "0")} · {p.key}</p>
              <p className="how__line">{p.line}</p>
              <p className="how__stat">
                {p.stat.to === 0
                  ? <span>0{p.stat.suffix}</span>
                  : <span data-count data-to={p.stat.to} data-suffix={p.stat.suffix}>{p.stat.to}{p.stat.suffix}</span>}
              </p>
              <p className="how__stat-label">{p.stat.label}</p>
              {p.graphic && <HowGraphic kind={p.graphic} />}
              {p.checks && <CheckPills checks={p.checks} />}
              <p className="how__proof">{p.proof}</p>
              {p.link && <a className="how__link mono" href={p.link.href}>{p.link.label} ↘</a>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Achievements ── */
export function Achievements() {
  return (
    <section id="awards" className="section awards" data-section="awards" data-path="/awards">
      <div className="container">
        <p className="eyebrow" data-reveal>Achievements</p>
        <h2 className="h2" data-split>Proof under pressure.</h2>
        <ul className="awards__list">
          {achievements.map((a, i) => (
            <li key={a.label} className="award" data-reveal data-delay={(i % 3) * 0.06} data-spotlight>
              <span className="award__value">
                {/^[\d,]+\+?$/.test(a.value)
                  ? <span data-count data-to={a.value.replace(/[^\d]/g, "")} data-suffix={a.value.endsWith("+") ? "+" : ""}>{a.value}</span>
                  : a.value}
              </span>
              <span className="award__label">{a.label}</span>
              <span className="award__detail">{a.detail}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ── Learning now ── */
export function Learning() {
  return (
    <section id="learning" className="section learning" data-section="learning" data-path="/next">
      <div className="container">
      <div className="learning__grid">
        <div>
          <p className="eyebrow" data-reveal>Learning now</p>
          <h2 className="h2" data-split>The next layer down.</h2>
          <p className="lede" data-reveal>
            I&rsquo;m learning how blockchains actually work, from blocks and hashes up. Nothing shipped yet, and
            I&rsquo;d rather say so than pretend.
          </p>
        </div>
        <div className="learning__side" data-reveal>
          <ul className="learning__list">
            {learning.map((l) => (
              <li key={l.name}><span>{l.name}</span><span className="pill pill--dim">{l.state}</span></li>
            ))}
          </ul>
          <div className="soon">
            <p className="mono soon__cmd">$ npm install ask-vansh</p>
            <p className="soon__title">Ask Vansh</p>
            <p className="soon__text">An AI that answers your questions about my work, using only my real projects and experience.</p>
            <div className="soon__bar" role="progressbar" aria-label="Ask Vansh build progress" aria-valuenow={60} aria-valuemin={0} aria-valuemax={100}><i /></div>
            <span className="pill pill--signal">Coming soon</span>
          </div>
        </div>
      </div>
      <div className="learning__toy" data-reveal>
        <p className="eyebrow eyebrow--dim">Learning in public · break the chain</p>
        <BlockToy />
      </div>
      </div>
    </section>
  );
}

/* ── Footer ── */
export function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <VisitCommit />
        <div className="footer__inner">
          <span>© 2026 {profile.name} · {profile.city}</span>
          <Duck />
          <span className="mono">Built end to end: Next.js · GSAP · SVG · press X</span>
        </div>
      </div>
    </footer>
  );
}
