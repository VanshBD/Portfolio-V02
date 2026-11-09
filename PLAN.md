# VANSH DOBARIYA · "END TO END"
### A professional, scroll-driven portfolio that shows how your systems work. Full plan.

> Status: plan only, waiting for approval. Replaces the game-world plan.
> What changed: no game map, no photos of you, no gimmicks. A clean,
> professional site with smooth scrolling and interactive animation, where
> every project is explained as a connected system.

---

## 1. The idea in one line

**You are a backend architect, so the site shows your work the way an
architect would: as systems.** A single glowing line (the "request path")
runs through the whole page. As the visitor scrolls, a packet of light
travels along it, connecting every section. Each project is a case study
with a **live architecture diagram** that animates step by step as you
scroll: client, API, services, database, response, each part lighting up
and explaining what it does.

**Why this fits you:**
- Recruiters and tech leads instantly see *how* you think, not just *what* you built.
- It's exactly what you're good at: backend architecture, data, roles, performance.
- It's professional enough for any company, and the motion makes it memorable.

---

## 2. Look and feel

**Personality → design:** calm, precise and reliable (the backend that keeps
everything running), with one spark of energy (*"bring me a crazy idea"*).

**Main direction: "Ink & Signal" (dark, professional)**

| Token | Hex | Use |
|---|---|---|
| Ink | `#0D1015` | Page background |
| Slate | `#161B23` | Cards, panels |
| Steel | `#7D8BA3` | Diagram lines, secondary text |
| Paper | `#EEF1F6` | Main text |
| Signal | `#FF6B3D` | The travelling packet, key highlights, buttons (the "spark") |
| OK | `#3DDC97` | Live status, "200 OK", success states |

**Alternative: "Paper & Ink" (light, editorial)**, with the same structure on warm
white, ink-black text and the same Signal orange. We pick between the two on
real screens in the Look Lock step, not from descriptions.

**Type:** a confident grotesk for headlines, a clean sans for reading, and a
mono font only for technical labels (endpoints, numbers, stack names).

**Motion rules (professional, not flashy):**
- Smooth momentum scrolling across the whole page.
- One signature motion: the packet travelling the request path.
- Diagrams build themselves as you scroll; everything else fades or slides in gently.
- Numbers count up once. No constant spinning or bouncing.
- Respects "reduce motion"; phones get lighter animation.

**No photos of you.** Identity comes from your name, a "VD" monogram, and your work.

---

## 3. The page, section by section (scroll order)

```
 HERO ──► HOW I BUILD ──► JOURNEY ──► CASE STUDIES (5) ──► MORE WORK
                                                               │
 CONTACT ◄── LEARNING NOW ◄── ACHIEVEMENTS ◄── SKILLS SYSTEM ◄─┘
 (the request path runs through all of it, and ends at "200 OK")
```

### 1) Hero
- **Vansh Dobariya** · Full-Stack Developer · backend systems · Ahmedabad
- Line: *"I build the systems behind products, from a client's brief to a live, fast, reliable backend."*
- Status: Open to work, anywhere · hybrid, remote or on-site.
- Buttons: **See my work** · **Résumé** · **Contact**.
- **Interactive:** behind the text, a quiet animated network of nodes (your
  stack) that reacts to the cursor; the first packet leaves the hero and
  starts the request path.

### 2) How I build (3 principles, with real proof)
- **Fast:** API response time down 48% across 6 enterprise systems.
- **Correct:** money and stock that always add up (BillStack), 0% false answers (OVX-1).
- **Running:** live client systems (Pravasa, La Europa) and in-house platforms used every day.
- Animated counters on scroll.

### 3) Journey (2023 → now)
A connected timeline on the request path: BCA start, SwiftRut (trainee →
backend lead), MERN certificate A+, 15 apps in a month, AUM Industries,
going freelance, PromptWars 1st Runner Up, Hacker House Goa, Pravasa,
La Europa. Each stop expands on hover or tap.

### 4) Case studies (the heart of the site)
Each one is a **pinned scroll section**: text on the left, a live
architecture diagram on the right that animates step by step as you scroll.

| # | Case study | Story beats (left) | Diagram (right) |
|---|---|---|---|
| 1 | **Pravasa Transworld** | The visa company, what they needed, what we built, boss problems (silent mail, open vault, no gateway fees), result | Website & applicant portal → API → MongoDB · Cloudinary (private files) · Socket.io alerts · email · UPI verification |
| 2 | **AUM All-in-One Platform** | One product for every team, 8+ roles, heavy data, 48% faster APIs | Teams/roles → one API → services (website, sales enquiries, billing) → MongoDB + Redis cache |
| 3 | **La Europa Education** | Old PHP site, database switch, the vanishing email, live on free plans | Public site + admin → server-only data layer → Firestore · Cloudinary · DNS/mail records |
| 4 | **AFI Agent** | Biased fraud verdicts, prosecutor vs defense agents, 20 benchmark cases | Alert → hunter agents → TigerGraph → prosecutor ⇄ defense → rules → action |
| 5 | **OVX-1 Voice RAG** | 200 ms wall, extractive-first answers, 9.43 ms P50, 0% false answers | Voice → guards → vector + keyword search → answer or abstain |

**Interactive in each diagram:** hover or tap any box to see what it does and
why it was chosen; a "replay" button re-runs the request animation. Where a
real demo makes sense, a small playable piece (La Europa's publish demo,
Pravasa's status timeline) sits under the diagram. Screenshots or the
recording appear as a "see it live" panel.

### 5) More work (grid)
Cards that tilt slightly with the cursor, with real screenshots (and video on
hover where we have it): StateScry, ObscurPilot (with its launch clip),
PHANTOM-CARBON, LexAI, MatchLens AI, TeamOS, BillStack, Hospital Management
(illustrated), SwiftRut work. Each card: one line, stack, Live and Code links.

### 6) Skills as a system
An interactive map of your stack grouped as layers (frontend, backend, data,
AI, cloud). Click any skill and the projects that use it light up, linked
back to their case studies.

### 7) Achievements
A clean strip: PromptWars 1st Runner Up, PromptWars Virtual top 400, Google
Solution Challenge, 6 hackathon builds, 162 LeetCode, 16,500+ contributions,
MERN certificate A+.

### 8) Learning now
Honest and short: blockchain fundamentals, Solidity, Rust, Web3. Plus
"Ask Vansh AI · coming soon".

### 9) Contact (the path ends at "200 OK")
*"Have an idea, even a crazy one? Let's build it."* Email · LinkedIn · GitHub ·
Download résumé. The packet arrives and the status turns green: **200 OK**.

**Always available:** a small top bar with Work · Journey · Contact · Résumé,
and the plain **/resume** page (already built) for recruiters in a hurry.

---

## 4. What we keep and what we drop

**Keep:** the locked story (STORY.md: all facts, numbers and boss fights,
rewritten in plain professional language), project screenshots, the
ObscurPilot clip, the résumé page and PDF, smooth scroll and animation code,
the La Europa publish demo.

**Drop:** the game world, islands, player card, achievements game layer, the
chai cup, the old book site, and all photos of you.

---

## 5. Technical plan

- Next.js 15 (this project), rebuilt as the main site at `/`.
- GSAP + ScrollTrigger for scroll storytelling, Lenis for smooth scrolling.
- Architecture diagrams as hand-built SVG (sharp, light, fully animatable), not 3D.
- One subtle canvas effect only in the hero network; everything else is DOM and SVG, so it stays fast.
- Content in one file per section, from STORY.md.
- Targets: first screen under 2.5 s on a mid-range phone, smooth 60 fps scrolling, full keyboard access.

---

## 6. Build steps (each ends with your review)

| Step | What gets built | You approve |
|---|---|---|
| **1. Look Lock** | The hero plus one case study (Pravasa), in both "Ink & Signal" and "Paper & Ink" | Colours, fonts, motion feel |
| **2. Foundation** | Page structure, top bar, smooth scroll, the request path, hero, "How I build", journey | Scrolling feel |
| **3. Case studies** | All 5 case studies with live diagrams and demos | The project storytelling |
| **4. Rest of the page** | More work grid, skills system, achievements, learning, contact | Whole page |
| **5. Launch** | Phone pass, speed pass, SEO and share image, replace the old site, deploy | Go live |

---

## 7. Needed from you

Nothing blocking. Optional: the Pravasa screen recording, and any project
screenshots you'd like added (for example the AUM platform, if allowed).
