# VANSH: OPEN WORLD · Story Script (Phase 0, v2)

> Every word that will appear on the site, in order. Review it, then reply
> with changes. Nothing gets designed until this is locked.
>
> **How to review:** only a few tags are left.
> - **[CONFIRM]** I found it, but please check it's right.
> - **[NEED]** only you can fill this in.
> - **[YOUR WORDS]** a draft in your voice; rewrite it so it sounds like you.
>
> **Sources:** your résumé PDF, LinkedIn, GitHub, your live sites, the La
> Europa and Pravasa codebases and their build notes, and what you told me.
> Nothing below is invented. Private details (client bank details, logins,
> customer data) are never used.

---

## 0. Voice rules

- **The narrator** (the world) talks to the visitor in short, game-like lines: *"New region discovered."*
- **You** talk in first person inside quests: *"We moved the database mid-build."*
- Plain words. Real numbers only. No buzzwords.
- Every quest ends with something a recruiter can click: the live site or the code.

---

## 1. Loading screen (the intro, about 5 seconds)

```
vansh@ahmedabad:~$ ./load --world
→ loading 15+ production apps ......... done
→ restoring 2+ years of commits ....... done
→ linking clients: pravasa, la-europa . linked
→ spawning regions: 9 ................. ready
✓ world ready. press any key to enter
```

**Rotating tips:**
- TIP: I won 1st Runner Up at PromptWars Ahmedabad by building and deploying an AI app in a single day.
- TIP: Pravasa Transworld's visa platform took 134 commits in 5 months. You can apply for a visa in 10 minutes.
- TIP: I cut API response times by 48% across 6 enterprise systems with Redis caching and index tuning.
- TIP: OVX-1 answers voice questions in Hindi or English from 1.17 million chunks in under 10 ms.
- TIP: In October 2024 I shipped 15 full-stack practice apps in one month.
- TIP: Press R at any time to open the résumé view.

---

## 2. Home Base · the player card

**Region title:** HOME BASE · Ahmedabad, Gujarat, India

**Character:** your three photos (front, left, right) become a character you
drag to rotate, like a game's character select. Stylised hologram look.

| Stat | Value |
|---|---|
| Name | Vansh Dobariya |
| Class | Full-Stack Developer · MERN · Next.js |
| Specialties | Backend systems · REST APIs · RBAC · WebSockets · AI integration (Claude, Gemini) |
| Base | Ahmedabad, Gujarat, India |
| Experience | 2+ years professional (since March 2024) · 15+ production apps |
| Guild | BCA (completed), Swarnim Startup & Innovation University, 2023 to 2026 |
| XP | 16,500+ GitHub contributions in 2026 |
| Languages | English, Hindi, Gujarati (native) |
| Status | Open to work, anywhere in the world · hybrid, remote or on-site · open to building together |

**Perks:**
- **Brief to production:** scopes, builds and deploys whole products, solo if needed.
- **Backend architect:** designed the whole backend of an all-in-one business platform with 8+ roles.
- **Backend lead:** led the backend for 5 enterprise apps and a 6-person team.
- **Speed under pressure:** a working AI app in one day at PromptWars.
- **AI integrator:** ships Claude and Gemini features into real products.

**Intro line** [YOUR WORDS]:
> "I'm Vansh. I take ideas from a client's brief to a live product: the
> interface, the API, the database and the deploy. Explore my world to see
> what I've built, and what I'm learning next."

**Why I build** [YOUR WORDS, drafted from what you told me]:
> "Bring me an idea, however crazy it sounds, and I'll help you build it.
> I care about the part most people never see: the backend that keeps
> everything fast, correct and running."

**Button:** Start exploring

---

## 3. Main storyline (chapters, oldest first)

| Chapter | When | What happened |
|---|---|---|
| 1. git init | Jun 2023 | Started a BCA at SSIU and wrote my first code. |
| 2. The apprentice | Mar 2024 | Joined SwiftRut Technologies as a trainee. |
| 3. Backend lead | Mar 2024 to Feb 2025 | Full Stack Developer and Backend Lead at SwiftRut (remote): SaaS products like an AI resume builder and society management; led the backend for 5 enterprise apps with a 6-person team, delivered before deadline. |
| 4. Certified | Jul 2024 | Full Stack Development (MERN) certificate, Red & White Multimedia Education, grade A+. |
| 5. The grind | Oct 2024 | 15 full-stack practice apps in one month. |
| 6. The foundry | Apr 2025 to Jan 2026 | Full Stack Developer at AUM Industries, Ahmedabad (on-site): designed the backend of the company's all-in-one business platform, and built the hospital management system for its hospital. |
| 7. First challenge | Aug 2025 | Google Solution Challenge 2025. |
| 8. Going solo | Feb 2026 | Became a freelance full-stack developer. |
| 9. The arena | 19 May 2026 | 1st Runner Up at PromptWars Ahmedabad. |
| 10. The big client | Jun to Nov 2026 | Built Pravasa Transworld's visa platform with Yaksh Bambhroliya. |
| 11. Obscur Labs | Jul 2026 | Started Obscur Labs with Yaksh Bambhroliya. First product: ObscurPilot. |
| 12. Hackathon season | Jul to Aug 2026 | LexAI and MatchLens AI; top 400 in PromptWars Virtual. |
| 13. Hacker House Goa | Aug to Oct 2026 | With Obscur Labs: Frame In Goa, OVX-1, and ObscurPilot rebuilt with a whole new interactive UI. Solo: AFI Agent for the TigerGraph fraud track. |
| 14. Tools for builders | 2026 | Published StateScry on npm. |
| 15. Client launch | 3 Nov 2026 | La Europa Education goes live. |
| 16. The frontier | now | Learning how blockchains work: Solidity, Rust and Web3. |

---

## 4. Regions

| Region | What's there | Narrator line on arrival |
|---|---|---|
| Home Base | Player card, story | "Welcome. Your guide is ready." |
| Client Coast | Pravasa Transworld, La Europa | "Real clients. Real deadlines. Real users waiting." |
| The Foundry | Work at AUM Industries and SwiftRut | "Where enterprise systems are forged." |
| AI Highlands | PHANTOM-CARBON, LexAI, MatchLens AI | "Here, apps learn to read, see and reason." |
| The Toolworks | StateScry | "Tools for the people who build tools." |
| Goa Isle (event) | Hacker House Goa 2026: ObscurPilot, AFI Agent, OVX-1, Frame In Goa | "Limited-time event. Three tasks, one week, no sleep." [CONFIRM the tagline] |
| Product Works | TeamOS, BillStack | "Products built end to end." |
| Arena of Trophies | Awards, hackathons, LeetCode | "Where speed is the only rule." |
| Training Grounds | Early practice apps | "Every master was a beginner who kept shipping." |
| The Frontier | Blockchain, Rust, Web3 | "Fog ahead. Still being explored." |

(That's 9 regions plus Home Base. The Foundry, Product Works and Goa Isle are new since the plan.)

---

## 5. Quests

### QUEST · Pravasa Transworld ★ main quest
**Region:** Client Coast · **Built by:** Yaksh Bambhroliya and Vansh Dobariya · **Status:** LIVE

**The quest:**
> Pravasa Transworld is a visa company in Surat. Travellers had to visit the
> office, carry paper and wait for phone calls. The company wanted people to
> apply online in minutes, pay by UPI and track every step, while staff ran
> the whole business from one console.

**Objectives:**
- A public website and an applicant portal: apply in 10 minutes, no office visit.
- An admin console for every part of the business.
- Safe handling of passports and ID documents.

**What we built** (a monorepo with 3 apps: website and applicant portal, admin console, API):
- Passwordless email sign-in for travellers; staff accounts with roles across 15 permission areas, two-factor login and sign-in history.
- Visa forms the staff design themselves: a form builder with follow-up questions, adult and child sections, and linked family applications.
- Passport scanning with AI vision that reads the machine-readable line, so short names are never dropped.
- Clear pricing: visa fee, VFS fee and service fee, with 18% GST on the service fee only. Separate pricing for corporate clients and B2B travel agents, with agent credit and statements.
- Payments by UPI or bank transfer, confirmed by transaction reference, with reminders before the verification deadline.
- **Real-time alerts** for travellers and staff, so every status change appears instantly.
- One-click embassy mail: send an application and its documents to an embassy.
- An AI writer for staff that is not allowed to invent visa rules.
- Promo codes, blog, reviews, travel-service enquiries (flights, hotels, transport, insurance, forex), an installable app, and GST reports.

**My part** [CONFIRM and add to this]: the real-time alert system for both
portals, encrypting personal data at rest, security handling, and the
socket connection fixes.

**Boss fights** (pick your favourite 2 or 3 to show) [CONFIRM]:
1. **The Silent Mail:** for a day, every email (sign-in codes, status updates) said "sent" but never arrived. The email provider accepted each one, then quietly rejected it because the sender address was wrong. We fixed it, and now the server checks every sender when it starts.
2. **The Open Vault:** passports and ID documents were reachable by link. We moved every personal file to private storage with links that expire after an hour, and encrypted personal data in the database.
3. **No Gateway Fees:** the client didn't want card-gateway charges, so we removed the payment gateway and built UPI and bank-transfer payments, verified by transaction reference.
4. **The 200-Page Handoff:** in November 2026 the client sent a 112-page developer spec and a 95-page redesign guide. We sorted it into giant, normal and small tasks and shipped it in batches over two days.
5. **The Invented Rule:** the first test of the AI writer made up visa rules. We locked it down so it only uses facts staff have entered.

**Loadout:** Next.js · TypeScript · Node.js · Express · MongoDB · Socket.io · Cloudinary (private files) · Brevo · AI vision (Groq) · Vercel and Render

**Play:** *Apply in 10 minutes:* pick a destination, drop in a passport (the
"AI" fills the name), pay by UPI with a reference number, then watch the
status timeline move from Paid to Docs verified to At embassy to Visa approved.

**Loot:** live at pravasatransworld.com · 134 commits in 5 months · 23 admin sections · 32 data models
**Links:** Visit live site

---

### QUEST · La Europa Education
**Region:** Client Coast · **Built by:** Yaksh Bambhroliya and Vansh Dobariya · **Status:** LIVE

**The quest:**
> La Europa Education has helped 500+ students study in Europe. Its old
> website ran on PHP and staff couldn't update it themselves. They needed a
> site they could run on their own.

**Objectives:**
- Public site: 35 European destinations, services, reviews, news and an enquiry form.
- Admin panel: updates, enquiries (with export), reviews, certificates, FAQs, countries, team and settings.
- Secure, fast, and running entirely on free plans.

**Boss fight 1 · The Database Switch**
> We started on Supabase. Mid-build we moved everything to Firestore and
> Cloudinary, so the whole site stays on free plans and the browser never
> talks to the database directly.

**Boss fight 2 · The Vanishing Email**
> When we moved the domain to Vercel, the company's email records didn't
> come with it. Once old DNS caches expired, every email to the company
> would have bounced. We rebuilt the mail records, added DMARC, and verified
> them live before anything was lost.

**Loadout:** Next.js · React · TypeScript · Firestore (server-only) · Cloudinary · Vercel · security headers · rate limiting · HTML sanitising

**Play:** *Publish an update* (already built) and *Email rescue* (drag the right DNS records into place before the bounce timer ends).
**Loot:** live at laeuropaeducation.com since 3 November 2026
**Links:** Visit live site

---

### QUEST · The All-in-One Business Platform (AUM Industries) ★
**Region:** The Foundry · **My role:** backend architect and backend developer · **Status:** in daily use inside the company

**The quest:**
> AUM Industries was running its business across separate tools. They wanted
> one product of their own where every team works: the website, sales
> enquiries, billing and the rest, all in one place.

**Objectives:**
- One platform, many services: website management, sales enquiries, billing and more.
- Every team gets exactly the access it needs.
- Stay fast under heavy data.

**What I built:** the whole backend architecture. Many services joined into
one system, built for heavy data, with role-based access for every team:
super admin, admin, sales manager, marketing, tech support, warehouse
manager, accountant and more.

**Boss fight · Too Many Hands, One System**
> Eight-plus roles, each needing different powers over the same data, and
> heavy data flowing through all of it. I designed the access model and made
> the backend efficient enough that everyone could work at once: Redis
> caching and MongoDB index tuning cut API response time by 48%.

**Loadout:** Node.js · Express · MongoDB · Redis · JWT and role-based access · Nginx · PM2 [CONFIRM]
**Play:** *Role switcher:* switch between Sales Manager, Accountant and
Warehouse Manager and watch the same dashboard change what each one can see and do.
**Loot:** used across the company every day · 8+ roles · API response time down 48%
**Media:** private company product, so it gets an illustrated version, no real screenshots.

---

### QUEST · Hospital Management System (AUM Industries)
**Region:** The Foundry · **Status:** in use at the hospital run by AUM Industries' owner

**The quest:**
> A hospital runs on reception, doctors and patients. It needed one system
> that receptionists find easy, that doctors can use without training, and
> that keeps patients coming back on time.

**What I built:**
- **Reception:** receptionists book and manage appointments in a few clicks.
- **Doctors:** see their day, write consultation notes and record everything in the system.
- **Patients:** get notifications at every step.
- **Automatic reminders:** the system reminds patients about their next check-up and their medicines, on time, by itself.
- **Roles:** separate access for the owner, reception, doctors and staff.

**Boss fight · The Forgotten Follow-up**
> Patients miss their next visit and forget their medicines. The fix had to
> work without anyone remembering to send a message: time-based reminders
> that run automatically.

**Loadout:** [CONFIRM: Node.js, Express, MongoDB, Redis, notifications?]
**Play:** *Reception desk:* book an appointment, let the doctor add a note,
then fast-forward time and watch the patient's phone get the check-up and
medicine reminders.
**Loot:** used inside the hospital every day · part of the 6 systems where API response time dropped 48%
**Media:** private product, so it gets an illustrated version.

---

### QUEST · The Foundry, SwiftRut Technologies
**Region:** The Foundry · **Role:** Full Stack Developer and Backend Lead (Mar 2024 to Feb 2025, remote)

> Heavy SaaS products for clients: an AI resume builder, a society
> management platform and more.

- **Project lead on one product**, working across frontend and backend, with most of my time in the backend.
- **Backend lead on several others:** designed the architecture and APIs, delivered **before the deadline**, with lower latency and cleaner, more efficient APIs.
- **AI Resume Builder:** Claude and Gemini integration made resume generation **65% faster**.
- **Social Media Automation:** a WebSocket platform sustaining **800 concurrent connections under 120 ms**.
- **Society Management:** [optional: one line on what it did]
- Led the backend for **5 enterprise apps** with a **6-person team**.

**Across the Foundry (both companies):** API response time down 48% with
Redis caching and MongoDB index tuning; role-based access on 4 production
apps; 55% fewer post-release bugs through structured code reviews;
production deploys on company servers with Nginx and PM2; an AI Finance
platform at AUM Industries.

---

### QUEST · PHANTOM-CARBON
**Region:** AI Highlands · **Event:** GDG HackToSkill 2025

> Normal carbon trackers only count what you can see: transport, food,
> energy. That's about 29% of a real footprint. The other 71% is invisible.

**Boss fight · The Invisible 71%:** finding emissions hidden in products (manufacturing, packaging, shipping) and in the digital world (servers, data centres, supply chains).
**What I built:** describe your day in plain English and AI extracts every emission; upload a receipt and a vision model classifies each item; a "Ghost Inferencer" estimates hidden emissions; a "Future Oracle" shows three 2050 scenarios; an animated radar shows all three layers.
**Loadout:** Next.js · TypeScript · Groq (LLaMA 3.3 70B and vision) · MongoDB Atlas
**Play:** slide down through surface, shadow and ghost carbon.
**Loot:** live demo · 151 tests passing · **Links:** Live · Code

### QUEST · LexAI
**Region:** AI Highlands · **Event:** GDG HackToSkill 2026

> Legal documents are written so most people can't understand what they're signing.

**Boss fight · The Wall of Legalese:** plain language, while still pointing to the exact clause behind every answer.
**What I built:** plain-language summaries; a "Risk DNA" graph that colours clauses by risk and shows conflicts; clause highlighting; document Q&A with cited clauses and confidence scores; a checklist of obligations, rights and deadlines.
**Loadout:** TypeScript · Gemini · React Flow · client-side search · accessible colours
**Play:** click a clause; it turns into plain words and a risk colour.
**Links:** Live · Code

### QUEST · MatchLens AI
**Region:** AI Highlands · **Event:** GDG HackToSkill, July 2026

> In a stadium of 80,000 fans, seconds are lost when volunteers search for procedures.

**Boss fight · The 80,000-Person Emergency:** one dashboard where AI turns any situation into an action plan, a multilingual announcement, a crowd plan or an accessible route.
**What I built:** an AI copilot for FIFA World Cup 2026 stadium staff, with views for admins, organisers, security, medical staff and volunteers.
**Loadout:** Next.js · TypeScript · Node.js · Gemini
**Play:** three incidents arrive at once; pick one and get its AI action plan.
**Links:** Live · Code

### QUEST · StateScry
**Region:** The Toolworks · published on npm

> Git remembers the code. Nothing remembers what users can actually do in the app.

**Boss fight · Behaviour Amnesia:** mapping a running web app into a graph of real screens and safe actions, so it can be replayed, compared and handed to coding agents.
**What I built:** a local-first CLI, an MCP server for coding agents, a core library and an SDK. Works in Chromium, Firefox and WebKit, with no account or paid AI needed.
**Loadout:** TypeScript · Playwright · MCP · Node.js
**Play:** click through a tiny app and watch its behaviour graph build.
**Loot:** on npm as @statescry-tool · **Links:** Live · Code

### QUEST · AFI Agent ★ (solo)
**Region:** Goa Isle · **Event:** TigerGraph × Hacker House Goa 2026, fraud investigation track · **Built:** solo, in about 3 days

> Fraud analysts decide from one-sided evidence, and bias creeps in.

**Boss fight · The Biased Verdict:** a Prosecutor agent argues against a Defense agent over a live knowledge graph before anything is decided.

**What I built:**
- Hunter agents that search transactions, graph links, devices and past cases, orchestrated by a commander agent.
- Temporal safety: the agents can never use evidence from after the alert, so there is no "future leakage".
- Bank-style rules (R1 to R7) that pick the next action: allow, decline, block the card or file a suspicious-activity report, with human approval routing.
- Results written back to TigerGraph as new cases with linked evidence.
- A Command Center dashboard: live graph, evidence ledger, prosecutor and defense side by side, and the recommended action before and after the evidence.

**Loadout:** TypeScript · TigerGraph Savanna · GSQL · MCP · GraphRAG · Groq
**Play:** pick one of the 20 benchmark cases and watch the prosecutor and the defense argue, then see the verdict.
**Loot:** 20 official benchmark cases validated against the event schema · 14 tests passing
**Links:** Code

### QUEST · OVX-1 Voice RAG ★
**Region:** Goa Isle · **Event:** Hacker House Goa 2026, Task 2 · **Team:** Obscur Labs (Yaksh Bambhroliya and Vansh Dobariya)

> Ask a question by voice, in Hindi or English, and get an answer only from
> real sources, or an honest "I don't know". In under 200 ms.

**Boss fight · The 200 ms Wall:** a hosted AI model needs 200 to 600 ms just
to start answering. So most questions skip the model entirely: the answer is
taken word for word from the best retrieved passage, which also means it
can't be made up. Only 6.7% of questions are escalated to the AI.

**What we built:** voice in Hindi or English; an index of 1.17 million
chunks built 5 different ways; meaning-based and keyword search fused
together; three safety gates that block unsafe input, prompt injection and
questions the sources can't answer.

**My part:** the performance work (a sub-2 ms query pipeline and an LRU
cache), the interactive benchmark UI, and the evaluation framework.

**Loadout:** Python · ONNX (int8, on CPU) · HNSW vector index · BM25 · Sarvam speech-to-text · Groq
**Play:** ask a question by voice or text and watch each stage's timing light up, then try to trick it with a question it can't answer.
**Loot:** P50 **9.43 ms** · **100%** of answers under 200 ms · **0%** false answers · 100% of unsafe and injection attempts blocked
**Links:** Live · Code

### Side quest · Frame In Goa
**Region:** Goa Isle · **Event:** Hacker House Goa 2026, Task 1 · **Team:** Obscur Labs

> Upload a photo and get a branded Hacker House Goa builder pass in about
> 150 ms, with a real scannable QR, ready to post on X.

**Links:** Code

### QUEST · ObscurPilot ★
**Region:** Goa Isle · **Team:** Obscur Labs (Yaksh Bambhroliya and Vansh Dobariya) · **Event:** Hacker House Goa 2026

> Solo live streamers juggle OBS, Twitch, chat and their game at once.
> ObscurPilot lets them hold Alt + X and just say what they want.

**The story:** we started ObscurPilot in July 2026 as Obscur Labs' first
product. For Hacker House Goa we rebuilt the entire UI as an interactive
desktop app, starring **Pilot**: a glass robot sidekick with an LED face
that shows what it's doing. It listens, thinks, works, asks before it acts,
and celebrates when it's done.

**Boss fight · Trust the Voice, Not the Screen:** an AI that controls live
production must never do anything unsafe. Every command is checked against
a schema and permissions, can't run twice by accident, is logged and times
out, and risky moderation like a permanent ban always needs the creator's approval.

**What we built:** push-to-talk voice (transcribed by Wispr Flow), AI
intent planning through a fixed set of tools, one-click OBS connection,
Twitch control including chat moderation, a live activity log, and a
secure desktop app where the screen never touches secrets.

**My part:** stages 0 to 5 of the core (architecture, the monorepo, the
secure desktop shell, the domain kernel, the audio pipeline and the OBS
bridge), the live-session setup with audio, Twitch and OBS, and the new
interactive UI for Hacker House Goa with the team. [CONFIRM your UI part]

**Loadout:** Electron · React · TypeScript · Wispr Flow · Groq · OBS WebSocket · Twitch EventSub · Supabase (row-level security)
**Play:** hold Alt + X (or tap), say "switch to the gaming scene", and watch Pilot's face go from listening to thinking to asking to done.
**Replay:** the 23-second launch film (Pilot wakes up, listens, works, celebrates).
**Links:** Code

---

### QUEST · TeamOS
**Region:** Product Works

> A Slack-style home for a team: channels, DMs, calls and more.

**What I built:** real-time messaging with 10+ features and under 200ms delivery, public and private channels, voice and video calls, polls, file sharing; an event-driven user sync between sign-in, the database and chat.
**Loadout:** React 19 · Vite · Node.js · Express · MongoDB · Stream Chat · Clerk · Inngest · Sentry
**Links:** Live · Code

### QUEST · BillStack
**Region:** Product Works

> Small businesses need invoices, stock, clients and payments in one place, and the money must always add up.

**Boss fight · Money Must Never Drift:** stock moves run in atomic database transactions, and deleting a payment automatically reverses its credits.
**What I built:** an ERP and invoicing system with GST and HSN support: quotes that turn into invoices, PDF generation, inventory, a CRM, payments and email with an automatic fallback provider. The backend generates full CRUD APIs from each data model, with zero boilerplate routes. API latency down 60%.
**Loadout:** React 18 · Vite · Ant Design · Redux Toolkit · Node.js · Express · MongoDB
**Links:** Live · Code

---

## 6. Arena of Trophies

| Trophy | Detail |
|---|---|
| 🥈 1st Runner Up · PromptWars Ahmedabad 2026 | Google for Developers × Hack2Skill · SilverOak University · 19 May 2026 · built and deployed an AI prototype with Google Antigravity in one day |
| 🏅 Top 400 · PromptWars Virtual 2026, Challenge 3 | Google for Developers × Hack2Skill · Aug 2026 |
| 🎖 Google Solution Challenge 2025 | GDG on Campus × Hack2Skill |
| 🎓 Full Stack Development (MERN), grade A+ | Red & White Multimedia Education · Jul 2024 |
| ⚔ 6 hackathon builds | PHANTOM-CARBON, LexAI, MatchLens AI, AFI Agent, OVX-1, Frame In Goa |
| 🏝 Hacker House Goa 2026 | Open Trials Tasks 1 and 2 with Obscur Labs, plus the TigerGraph fraud track solo |
| 🧠 162 LeetCode problems, 33 hard | |
| 📈 16,500+ GitHub contributions in 2026 | |

[NEED, optional: photos from PromptWars or Hacker House Goa.]

---

## 7. Training Grounds · side quests

> "Every master was a beginner who kept shipping."

Movie API (Apr 2024) · E-Commerce (Jun 2024) · and in October 2024: Airbnb
Clone, Task Management, Blog, Recipe App, Event Management, Book Store,
Expense Tracker, Education Management, Quiz, Project Management, Inventory &
Supplier, Team Collaboration, Fitness Tracker, Inventory & Orders, Habit
Tracker · Netflix Clone (May 2026). Live links where they exist.

---

## 8. The Frontier

**Narrator:** "Fog ahead. Still being explored."

> "I'm learning how blockchains actually work, from blocks and hashes up:
> writing smart contracts in Solidity, learning Rust, and exploring Web3."

Shown as a region that is partly unlocked, with honest "learning" status
(never claimed as finished work):
- How blockchains work · **learning**
- Solidity smart contracts · **learning**
- Rust · **learning**
- Web3 apps · **exploring**

Nothing built yet, and that's the point: this region fills in as I learn. Every repo, contract or course I finish unlocks a piece of the fog.

**Play:** mine a block and add it to a chain; then edit an old block and watch every block after it break.

**Ask Vansh AI · coming soon**
> "An AI that answers your questions about my work, using only my real projects and experience."

---

## 9. The ending · Recruit to your party

> **"Add Vansh to your team?"**
> I'm open to work anywhere in the world: full-time roles, hybrid,
> remote or on-site. And if you want to build something, even something
> crazy, just get in touch. Let's build it together.

**Buttons:** Email me · LinkedIn · GitHub · Download résumé
**Final line:** "Thanks for exploring. Progress saved."

---

## 10. Recruiter mode (résumé view)

- **Vansh Dobariya** · Full-Stack Developer · Ahmedabad, India · English, Hindi, Gujarati
- Open to work anywhere · hybrid, remote, on-site · open to collaborations
- **Experience:**
  - Freelance Full Stack Developer (Feb 2026 to now): 3+ end-to-end apps for FinTech and SaaS clients, including Pravasa Transworld and La Europa; client manual work cut by 60%+ with Claude and Gemini features.
  - Full Stack Developer, AUM Industries (Apr 2025 to Jan 2026): backend architect of the company's all-in-one business platform (8+ roles); 6 enterprise systems including Hospital Management, CRM/CMS and AI Finance; API response time down 48%; RBAC on 4 apps; 55% fewer post-release bugs.
  - Full Stack Developer / Backend Lead, SwiftRut Technologies (Mar 2024 to Feb 2025): backend lead for 5 enterprise apps and a 6-person team; AI Resume Builder 65% faster; 800 concurrent WebSocket connections under 120ms.
- **Education:** BCA, SSIU (2023 to 2026, completed) · Full Stack (MERN) certificate, A+
- **Projects:** each quest in one line, with links
- **Awards:** the arena list
- **Skills:** JavaScript, TypeScript, Node.js, Express, React, Next.js, GraphQL, WebRTC · MongoDB, Redis, MySQL · microservices, REST, JWT/OAuth, RBAC, WebSockets, Zod, Jest, rate limiting · Gemini and Claude APIs, Twilio · GitHub Actions, Docker, Nginx, PM2, GCP
- **Contact:** email, LinkedIn, GitHub, résumé PDF

---

## 11. Achievements

| Achievement | How to unlock |
|---|---|
| First Steps | Leave Home Base |
| Visa Approved | Finish the Pravasa "apply in 10 minutes" game |
| Email Saved | Win La Europa's email rescue |
| Client Whisperer | Finish both Client Coast quests |
| Forged | Visit The Foundry |
| Prompt Engineer | Visit every AI Highlands quest |
| Toolsmith | Play the StateScry demo |
| Sub-10ms | Get an OVX-1 answer under 10 ms |
| Event Survivor | Visit every quest on Goa Isle |
| Chain Breaker | Break the blockchain at the Frontier |
| Cartographer | Visit every region |
| Speedrunner | Open the résumé view in under 10 seconds |
| Recruited | Reach the ending |

---

## 12. Still needed from you (all optional)

- The loadout for the AUM platform and the hospital system, and a line on Society Management.
- Pravasa: check "My part" and pick your favourite boss fights.
- ObscurPilot: confirm your part of the Hacker House Goa UI.
- Event photos and the Pravasa screen recording.

The story is locked. These can be filled in during later phases.
