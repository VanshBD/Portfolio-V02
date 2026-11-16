import Link from "next/link";
import type { Metadata } from "next";
import { NotFoundTrace } from "@/site/NotFoundTrace";

export const metadata: Metadata = { title: "404 · Page not found" };

/* A 404 written as the stack trace a backend developer would recognise,
   with one lost packet looking for a route that doesn't exist. */
export default function NotFound() {
  return (
    <main className="nf">
      <div className="nf__inner">
        <p className="eyebrow">404 · not found</p>
        <h1 className="nf__title">This route was never deployed.</h1>
        <NotFoundTrace />
        <svg className="nf__net" viewBox="0 0 520 170" aria-hidden="true">
          <path id="nf-loop" d="M40 120 C 110 20, 200 20, 260 85 S 420 160, 480 60" className="nf__wire" />
          <path d="M260 85 L 300 150" className="nf__wire nf__wire--dead" />
          {[[40, 120, "/"], [260, 85, "/work"], [480, 60, "/resume"]].map(([x, y, l]) => (
            <g key={l as string} transform={`translate(${x} ${y})`}>
              <circle r="9" className="nf__node" />
              <text y="-16" textAnchor="middle" className="nf__label">{l}</text>
            </g>
          ))}
          <g transform="translate(300 150)">
            <circle r="9" className="nf__node nf__node--dead" />
            <text y="5" textAnchor="middle" className="nf__q">?</text>
          </g>
          <circle r="5" className="nf__packet">
            <animateMotion dur="6s" repeatCount="indefinite" keyPoints="0;0.5;0.38;0.5;1;0" keyTimes="0;0.3;0.42;0.55;0.8;1" calcMode="linear">
              <mpath href="#nf-loop" />
            </animateMotion>
          </circle>
        </svg>
        <div className="nf__actions">
          <Link href="/" className="btn btn--primary">$ git checkout main</Link>
          <Link href="/resume" className="btn btn--ghost">Read the résumé</Link>
          <Link href="/#work" className="btn btn--link">See the work →</Link>
        </div>
      </div>
    </main>
  );
}
