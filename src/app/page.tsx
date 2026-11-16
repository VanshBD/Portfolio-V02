import { cases } from "@/content/site";
import { Motion } from "@/site/Motion";
import { TopBar } from "@/site/TopBar";
import { RequestLog } from "@/site/RequestLog";
import { Hero } from "@/site/Hero";
import { HowIBuild, Achievements, Learning, Footer } from "@/site/Sections";
import { Journey } from "@/site/Journey";
import { CaseStudy } from "@/site/CaseStudy";
import { WorkGrid } from "@/site/WorkGrid";
import { SkillsMap } from "@/site/SkillsMap";
import { Contact } from "@/site/Contact";
import { Marquee } from "@/site/Marquee";
import { Cursor } from "@/site/Cursor";
import { XRay } from "@/site/XRay";
import { ConsoleHello } from "@/site/Playful";
import { getContributions } from "@/lib/github";
import { SketchPad } from "@/site/SketchPad";
import { Shortcuts } from "@/site/Shortcuts";

export default async function Home() {
  const github = await getContributions("VanshBD");
  return (
    <>
      <a className="skip" href="#work">Skip to the work</a>
      <TopBar />
      <RequestLog />
      <main>
        <Hero streak={github?.streak} />
        <Marquee />
        <HowIBuild />
        <Journey />
        <section id="work" className="section work-intro" data-section="work" data-path="/work">
          <div className="container">
            <p className="eyebrow" data-reveal>Selected work · 5 systems</p>
            <h2 className="h2" data-split>How the systems actually work.</h2>
            <p className="lede" data-reveal>
              Each case study is a live diagram. Scroll through the story and watch the request travel through the
              architecture; hover any box to see what it does and why it&rsquo;s there.
            </p>
          </div>
        </section>
        {cases.map((cs) => <CaseStudy key={cs.id} cs={cs} />)}
        <WorkGrid />
        <SkillsMap />
        <Achievements pulse={github} />
        <Learning />
        <SketchPad />
        <Contact />
      </main>
      <Footer />
      <Motion />
      <Cursor />
      <XRay />
      <ConsoleHello />
      <Shortcuts />
    </>
  );
}
