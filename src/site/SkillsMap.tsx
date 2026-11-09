"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { skillLayers, projectIndex, cases, work } from "@/content/site";
import { scrollToTarget } from "./Motion";

interface Wire { d: string; key: string }

/*
  Skills as a connected system. Pick a skill and live wires run from it to
  every project that used it; pick a project and wires run to its stack.
  A detail card says what the project is and where to read more.
*/
export function SkillsMap() {
  const [skill, setSkill] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);
  const [wires, setWires] = useState<Wire[]>([]);
  const map = useRef<HTMLDivElement>(null);
  const skillEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const projEls = useRef<Record<string, HTMLButtonElement | null>>({});

  const litProjects = useMemo(() => {
    if (skill) return new Set(projectIndex.filter((p) => p.skills.includes(skill)).map((p) => p.id));
    if (project) return new Set([project]);
    return null;
  }, [skill, project]);

  const litSkills = useMemo(() => {
    if (project) return new Set(projectIndex.find((p) => p.id === project)?.skills ?? []);
    if (skill) return new Set([skill]);
    return null;
  }, [skill, project]);

  /* draw a curved wire from each lit skill to each lit project */
  const draw = useCallback(() => {
    const root = map.current;
    if (!root || !litSkills || !litProjects) { setWires([]); return; }
    const box = root.getBoundingClientRect();
    const out: Wire[] = [];
    litSkills.forEach((s) => {
      const a = skillEls.current[s];
      if (!a) return;
      litProjects.forEach((p) => {
        const b = projEls.current[p];
        if (!b) return;
        const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
        const sideBySide = rb.left > ra.right;
        if (sideBySide) {
          const x1 = ra.left + ra.width / 2 - box.left, y1 = ra.top + ra.height / 2 - box.top;
          const x2 = rb.left - box.left, y2 = rb.top + rb.height / 2 - box.top;
          const mx = (x1 + x2) / 2;
          out.push({ key: `${s}>${p}`, d: `M${x1} ${y1} C${mx} ${y1} ${mx} ${y2} ${x2} ${y2}` });
        } else {
          const x1 = ra.left + ra.width / 2 - box.left, y1 = ra.bottom - box.top;
          const x2 = rb.left + 14 - box.left, y2 = rb.top + rb.height / 2 - box.top;
          out.push({ key: `${s}>${p}`, d: `M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2 - 40} ${y2} ${x2} ${y2}` });
        }
      });
    });
    setWires(out);
  }, [litSkills, litProjects]);

  useEffect(() => {
    const raf = requestAnimationFrame(draw);
    window.addEventListener("resize", draw);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", draw); };
  }, [draw]);

  const count = (s: string) => projectIndex.filter((p) => p.skills.includes(s)).length;
  const picked = project ? projectIndex.find((p) => p.id === project) : null;
  const pickedCase = picked ? cases.find((c) => c.id === picked.id) : null;
  const pickedWork = picked ? work.find((w) => w.id === picked.id) : null;
  const pickedLine = pickedCase?.summary ?? pickedWork?.line;

  const jump = () => {
    if (!picked) return;
    const el = document.querySelector(picked.href);
    if (el) scrollToTarget(el as HTMLElement);
  };

  return (
    <section id="skills" className="section skills" data-section="skills" data-path="/skills">
      <div className="container">
        <p className="eyebrow" data-reveal>Skills, as a system</p>
        <h2 className="h2" data-split>Every tool, connected to where I used it.</h2>
        <p className="lede" data-reveal>Pick a skill and watch it wire up to the projects behind it, or pick a project to see its stack.</p>

        <div ref={map} className={`skills__map${litSkills ? " has-pick" : ""}`} data-reveal>
          <svg className="skills__wires" aria-hidden="true">
            {wires.map((w, i) => (
              <g key={w.key}>
                <path d={w.d} pathLength={1} className="wire" style={{ animationDelay: `${i * 0.05}s` }} />
                <circle r="3.5" className="wire__packet">
                  <animateMotion dur={`${1.4 + (i % 4) * 0.25}s`} repeatCount="indefinite" path={w.d} />
                </circle>
              </g>
            ))}
          </svg>

          <div className="skills__layers">
            {skillLayers.map((l) => (
              <div key={l.layer} className="layer">
                <p className="layer__name mono">{l.layer}</p>
                <div className="layer__skills">
                  {l.skills.map((s) => {
                    const on = litSkills?.has(s);
                    return (
                      <button
                        key={s}
                        ref={(el) => { skillEls.current[s] = el; }}
                        type="button"
                        className={`skill${on ? " is-on" : ""}${litSkills && !on ? " is-dim" : ""}`}
                        aria-pressed={skill === s}
                        onClick={() => { setProject(null); setSkill(skill === s ? null : s); }}
                      >
                        {s}<span className="skill__n">{count(s)}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="skills__projects">
            <p className="layer__name mono">Projects</p>
            <ul>
              {projectIndex.map((p) => {
                const on = litProjects?.has(p.id);
                return (
                  <li key={p.id}>
                    <button
                      ref={(el) => { projEls.current[p.id] = el; }}
                      type="button"
                      className={`proj${on ? " is-on" : ""}${litProjects && !on ? " is-dim" : ""}`}
                      aria-pressed={project === p.id}
                      onClick={() => { setSkill(null); setProject(project === p.id ? null : p.id); }}
                    >
                      <span className="proj__dot" aria-hidden="true" />{p.name}
                      <span className="proj__n mono">{p.skills.length}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {picked && (
              <div key={picked.id} className="proj-card" role="status">
                <p className="proj-card__name">{picked.name}</p>
                {pickedLine && <p className="proj-card__line">{pickedLine}</p>}
                <p className="proj-card__meta mono">{picked.skills.length} tools · wired on the left</p>
                <button type="button" className="btn btn--primary btn--sm" onClick={jump}>
                  {pickedCase ? "See the case study ↑" : "See it in More work ↑"}
                </button>
              </div>
            )}
            {skill && !picked && (
              <p className="proj-card__meta mono skills__summary">
                {skill} · used in {litProjects?.size ?? 0} project{litProjects?.size === 1 ? "" : "s"}
              </p>
            )}
            {(skill || project) && (
              <button type="button" className="btn btn--link btn--sm" onClick={() => { setSkill(null); setProject(null); }}>Clear selection</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
