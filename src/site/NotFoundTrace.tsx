"use client";

import { usePathname } from "next/navigation";

/* the stack trace names the path the visitor actually asked for */
export function NotFoundTrace() {
  const path = usePathname() || "/unknown";
  return (
    <pre className="nf__trace mono" aria-label={`Error: no route matches ${path}`}>
      <span className="nf__req">GET {path} <b>404</b></span>
      {"\n\n"}<span className="nf__err">Error: no route matches &quot;{path}&quot;</span>
      {"\n"}    at Visitor.navigate (your-browser:1:1)
      {"\n"}    at Router.resolve (next/app-router:404:0)
      {"\n"}    at Portfolio.render (src/app/page.tsx:1:1)
      {"\n\n"}<span className="nf__hint">hint: the page moved, or it was never shipped. The packet below is still looking for it.</span>
    </pre>
  );
}
