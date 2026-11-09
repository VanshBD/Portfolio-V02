"use client";

import { useMemo, useState } from "react";
import { skillLayers, projectIndex } from "@/content/site";

/*
  Skills as a connected system: pick a skill and every project that uses it
  lights up; pick a project and its skills light up. Everything links back
  to the case studies and the work grid.
*/
export function SkillsMap() {
  const [skill, setSkill] = useState<string | null>(null);
  const [project, setProject] = useState<string | null>(null);

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

  const count = (s: string) => projectIndex.filter((p) => p.skills.includes(s)).length;

  return (
    <section id="skills" className="section skills" data-section="skills" data-path="/skills">
      <div className="container">
        <p className="eyebrow" data-reveal>Skills, as a system</p>
        <h2 className="h2" data-split>Every tool, connected to where I used it.</h2>
        <p className="lede" data-reveal>Pick a skill to light up the projects behind it, or pick a project to see its stack.</p>

        <div className="skills__map" data-reveal>
          <div className="skills__layers">
            {skillLayers.map((l) => (
              <div key={l.layer} className="layer" data-spotlight>
                <p className="layer__name mono">{l.layer}</p>
                <div className="layer__skills">
                  {l.skills.map((s) => {
                    const on = litSkills?.has(s);
                    return (
                      <button
                        key={s}
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
                      type="button"
                      className={`proj${on ? " is-on" : ""}${litProjects && !on ? " is-dim" : ""}`}
                      aria-pressed={project === p.id}
                      onClick={() => { setSkill(null); setProject(project === p.id ? null : p.id); }}
                    >
                      <span className="proj__dot" aria-hidden="true" />{p.name}
                    </button>
                    {on && <a className="proj__go mono" href={p.href}>open ↘</a>}
                  </li>
                );
              })}
            </ul>
            {(skill || project) && (
              <button type="button" className="btn btn--link btn--sm" onClick={() => { setSkill(null); setProject(null); }}>Clear selection</button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
