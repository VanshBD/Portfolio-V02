"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { book } from "@/content/book";
import { TitleSection }        from "./TitleSection";
import { AboutSection }        from "./AboutSection";
import { ProjectsHorizontal }  from "./ProjectsHorizontal";
import { EndSection }          from "./EndSection";
import { InkCursor }           from "./InkCursor";

gsap.registerPlugin(ScrollTrigger);

export function Book() {
  useEffect(() => {
    const id = setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      {/* Custom ink pen cursor — lives outside the scroll tree */}
      <InkCursor />

      <div
        className="paper-grain"
        style={{ background: "var(--color-paper)", minHeight: "100vh" }}
      >
        <TitleSection />

        <div className="relative">
          <AboutSection bio={book.meta.bio} skills={book.meta.skills} />
          <ProjectsHorizontal />
          <EndSection
            email={book.meta.contact.email}
            github={book.meta.contact.github}
            githubLabel={book.meta.contact.githubLabel}
          />
        </div>
      </div>
    </>
  );
}
