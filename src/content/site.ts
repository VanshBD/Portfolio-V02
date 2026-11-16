/* ============================================================
   VANSH DOBARIYA · END TO END
   All site content. Facts come from STORY.md (locked): résumé,
   LinkedIn, GitHub, live sites and the project codebases.
   ============================================================ */

const gh = (r: string) => `https://github.com/VanshBD/${r}`;
const ob = (r: string) => `https://github.com/obscurlabs/${r}`;

export const profile = {
  name: "Vansh Dobariya",
  role: "Full-Stack Developer",
  focus: "Backend systems",
  city: "Ahmedabad, India",
  status: "Open to work, anywhere · hybrid, remote or on-site",
  headline: "I build the systems behind products.",
  sub: "From a client's brief to a live, fast, reliable backend: the API, the data, the roles, the deploy. And the interface on top.",
  email: "vanshbdobariya1312@gmail.com",
  github: "https://github.com/VanshBD",
  linkedin: "https://www.linkedin.com/in/vansh-dobariya/",
  resumePdf: "/resume.pdf",
  heroStack: ["Node.js", "Express", "TypeScript", "Next.js", "React", "MongoDB", "Redis", "REST", "WebSockets", "RBAC", "JWT", "Socket.io", "Firestore", "Cloudinary", "Claude API", "Gemini", "Groq", "MCP", "Docker", "Nginx", "PM2", "Vercel"],
};

/* ── How I build: three principles, each with real proof ── */
export const principles = [
  {
    key: "Fast",
    graphic: "drop" as const,
    line: "Responses that don't make anyone wait.",
    stat: { to: 48, suffix: "%", label: "faster API responses across 6 enterprise systems" },
    proof: "Redis caching and MongoDB index tuning at AUM Industries. BillStack's API latency down 60%.",
  },
  {
    key: "Correct",
    line: "Nothing runs until it's safe to run.",
    stat: { to: 5, suffix: "", label: "checks on every ObscurPilot voice command before it runs" },
    checks: ["Schema", "Permission", "No duplicates", "Timeout", "Audit"],
    link: { href: "#case-obscurpilot", label: "Try it on Pilot" },
    proof: "Risky actions like a ban always wait for the creator's approval. Same rule on Pravasa: 15 permission areas, and passports behind one-hour private links.",
  },
  {
    key: "Running",
    graphic: "pulse" as const,
    line: "Systems people use every day.",
    stat: { to: 15, suffix: "+", label: "production apps shipped in 2+ years" },
    proof: "Pravasa and La Europa are live for real clients. AUM's platform runs the company daily.",
  },
];

/* ── Journey, oldest first ──
   Drawn as a git history. "branch" picks the lane in the commit graph:
   main is the career line, builds are things shipped, hackathons are events. */
export type JourneyBranch = "main" | "builds" | "hackathons";
export const journey: { when: string; title: string; text: string; branch: JourneyBranch }[] = [
  { when: "Jun 2023", title: "git init", text: "Started a BCA at Swarnim Startup & Innovation University and wrote my first code.", branch: "main" },
  { when: "Mar 2024", title: "Trainee at SwiftRut", text: "Joined SwiftRut Technologies as a trainee.", branch: "main" },
  { when: "2024", title: "Backend lead", text: "Full Stack Developer and Backend Lead at SwiftRut: 5 enterprise apps, a 6-person team, delivered before deadline.", branch: "main" },
  { when: "Oct 2024", title: "15 apps in a month", text: "Task managers, event platforms, inventory systems and more, shipped in one month.", branch: "builds" },
  { when: "Apr 2025", title: "AUM Industries", text: "Backend architect of the company's all-in-one platform, plus a hospital management system.", branch: "main" },
  { when: "Feb 2026", title: "Going freelance", text: "Started building end-to-end products for clients.", branch: "main" },
  { when: "May 2026", title: "PromptWars, 1st Runner Up", text: "Built and deployed an AI app in one day at PromptWars Ahmedabad.", branch: "hackathons" },
  { when: "Jun 2026", title: "Pravasa Transworld", text: "A full visa platform with Yaksh Bambhroliya: 134 commits in 5 months.", branch: "builds" },
  { when: "Aug 2026", title: "Hacker House Goa", text: "OVX-1 and ObscurPilot with Obscur Labs, and AFI Agent solo.", branch: "hackathons" },
  { when: "Nov 2026", title: "La Europa goes live", text: "A study-abroad company's new site and admin panel, launched on 3 November.", branch: "builds" },
  { when: "Now", title: "The next layer", text: "Learning blockchain, Solidity and Rust. Open to the next big build.", branch: "main" },
];

/* ── Case studies with architecture diagrams ──
   Diagram coordinates use a 540 × 430 canvas. */
export interface DNode { id: string; label: string; sub?: string; x: number; y: number; w?: number; h?: number; info: string; kind?: "actor" | "app" | "core" | "data" | "ext" }
export interface DEdge { from: string; to: string }
export interface Step { title: string; body: string; nodes: string[]; edges?: string[] } // edges as "a>b"
export interface CaseStudy {
  id: string;
  index: string;
  name: string;
  kicker: string;
  summary: string;
  role: string;
  credit?: string;
  stack: string[];
  metrics: { value: string; label: string }[];
  live?: string;
  code?: string;
  cover?: string;
  demo?: "pravasa" | "laeuropa" | "pilot";
  video?: string;
  nodes: DNode[];
  edges: DEdge[];
  steps: Step[];
}

export const cases: CaseStudy[] = [
  {
    id: "pravasa",
    index: "01",
    name: "Pravasa Transworld",
    kicker: "Client · Visa platform · Live",
    summary: "A Surat visa company's whole business, online: travellers apply in 10 minutes, pay by UPI and track every step; staff run everything from one console.",
    role: "Full-stack developer · real-time alerts, data security",
    credit: "Built with Yaksh Bambhroliya",
    stack: ["Next.js", "TypeScript", "Node.js", "Express", "MongoDB", "Socket.io", "Cloudinary", "Brevo", "Groq vision"],
    metrics: [
      { value: "10 min", label: "to apply for a visa" },
      { value: "134", label: "commits in 5 months" },
      { value: "23", label: "admin sections" },
    ],
    live: "https://www.pravasatransworld.com",
    cover: "/media/projects/pravasa/cover.webp",
    demo: "pravasa",
    nodes: [
      { id: "trav", label: "Traveller", sub: "no office visit", x: 14, y: 26, kind: "actor", info: "Indian travellers applying for e-visas, from a phone, without visiting the office." },
      { id: "portal", label: "Website & portal", sub: "Next.js", x: 14, y: 126, kind: "app", info: "Public site plus applicant portal: passwordless sign-in, dynamic visa forms, passport scan with AI vision, live status timeline." },
      { id: "admin", label: "Admin console", sub: "15 role areas · 2FA", x: 14, y: 262, kind: "app", info: "Staff console: applications, form builder, payments, embassy mail, reports. Roles with view/manage per area and two-factor login." },
      { id: "staff", label: "Staff", sub: "roles", x: 14, y: 362, kind: "actor", info: "Office staff, each with exactly the access their role needs." },
      { id: "api", label: "API", sub: "Node · Express · TS", x: 200, y: 190, kind: "core", info: "One TypeScript API behind both apps: validation, pricing with GST on the service fee only, permissions, audit logs." },
      { id: "db", label: "MongoDB", sub: "encrypted PII", x: 380, y: 10, kind: "data", info: "Applications, users, pricing tiers, agents. Personal data encrypted at rest." },
      { id: "files", label: "Private files", sub: "1-hour links", x: 380, y: 94, kind: "data", info: "Passports and ID documents in private Cloudinary storage, delivered only through links that expire after an hour." },
      { id: "live", label: "Real-time alerts", sub: "Socket.io", x: 380, y: 178, kind: "ext", info: "Every status change pushed instantly to travellers and to the staff who are allowed to see it. Built by me." },
      { id: "mail", label: "Email", sub: "sender check", x: 380, y: 262, kind: "ext", info: "Notifications and embassy mail. The server verifies every sender address at startup so mail can't silently fail again." },
      { id: "pay", label: "Payments", sub: "UPI · bank · UTR", x: 380, y: 346, kind: "ext", info: "No card gateway fees: UPI or bank transfer, verified by transaction reference, with reminders before the deadline." },
    ],
    edges: [
      { from: "trav", to: "portal" }, { from: "staff", to: "admin" },
      { from: "portal", to: "api" }, { from: "admin", to: "api" },
      { from: "api", to: "db" }, { from: "api", to: "files" }, { from: "api", to: "live" },
      { from: "api", to: "mail" }, { from: "api", to: "pay" },
    ],
    steps: [
      { title: "The brief", body: "Travellers had to visit the office and wait for calls. Pravasa wanted them to apply online in 10 minutes, pay by UPI and track every step.", nodes: ["trav", "portal"], edges: ["trav>portal"] },
      { title: "One API for everything", body: "A website and applicant portal for travellers, an admin console for staff, and one TypeScript API behind both.", nodes: ["portal", "admin", "api", "staff"], edges: ["portal>api", "admin>api", "staff>admin"] },
      { title: "Real-time, both ways", body: "Every status change reaches travellers and staff instantly. I built the real-time alert system for both portals.", nodes: ["api", "live", "portal", "admin"], edges: ["api>live", "portal>api", "admin>api"] },
      { title: "Boss fight: the open vault", body: "Passports and ID documents were reachable by link. We moved every personal file to private storage with one-hour links and encrypted personal data at rest.", nodes: ["api", "files", "db"], edges: ["api>files", "api>db"] },
      { title: "Boss fight: the silent mail", body: "For a day every email said \"sent\" but never arrived. The provider was quietly rejecting a bad sender. Fixed, and now every sender is checked at startup.", nodes: ["api", "mail"], edges: ["api>mail"] },
      { title: "No gateway fees", body: "The client didn't want card fees, so payments run on UPI and bank transfer, confirmed by transaction reference.", nodes: ["api", "pay"], edges: ["api>pay"] },
      { title: "Live", body: "Live at pravasatransworld.com: 134 commits in 5 months, 23 admin sections, 32 data models.", nodes: ["trav", "portal", "admin", "staff", "api", "db", "files", "live", "mail", "pay"] },
    ],
  },
  {
    id: "aum",
    index: "02",
    name: "All-in-One Business Platform",
    kicker: "AUM Industries · In-house SaaS · Daily use",
    summary: "One product where the whole company works: sales and leads, warehouses, billing and reports, website content, system monitoring and an anonymous suggestion box. Every role sees exactly what it should, on heavy data.",
    role: "Backend architect · backend developer",
    stack: ["Node.js", "Express", "MongoDB", "Redis", "JWT", "RBAC", "Encryption", "Nginx", "PM2"],
    metrics: [
      { value: "7", label: "teams in one system, plus custom roles" },
      { value: "1 click", label: "bills and reports for accounts" },
      { value: "48%", label: "faster API responses" },
    ],
    nodes: [
      { id: "sa", label: "Super admin", x: 10, y: 6, w: 148, h: 46, kind: "actor", info: "Creates any number of roles and decides their access, reviews analytics and sales across the company, and has full access to the system." },
      { id: "sales", label: "Sales manager", x: 10, y: 67, w: 148, h: 46, kind: "actor", info: "Reviews the performance of every seller in the team, transfers leads between them, and checks each seller's lead status, follow-ups and task updates." },
      { id: "team", label: "Sales team", x: 10, y: 128, w: 148, h: 46, kind: "actor", info: "Works their own leads: follow-ups, lead status and tasks." },
      { id: "mkt", label: "Marketing", x: 10, y: 189, w: 148, h: 46, kind: "actor", info: "Posts blogs, updates the company website's content, manages the calendar and updates tasks." },
      { id: "tech", label: "Tech", x: 10, y: 250, w: 148, h: 46, kind: "actor", info: "Reviews tech issues, watches the monitoring dashboard, tests APIs, and reviews logs, IP addresses and every API run." },
      { id: "wh", label: "Warehouse manager", x: 10, y: 311, w: 148, h: 46, kind: "actor", info: "Sees the stock and sales of their own warehouse, plus their workers' check-in times and tasks done, with analytics." },
      { id: "acc", label: "Accountant", x: 10, y: 372, w: 148, h: 46, kind: "actor", info: "Reviews sales for each warehouse and the whole company, analyses revenue and turnover, generates bills, and produces documentation in one click." },
      { id: "rbac", label: "Roles & access", sub: "custom roles · JWT", x: 196, y: 110, kind: "core", info: "The access model I designed: the super admin creates roles, and every role sees and does exactly what it should. Every role also gets its own task management." },
      { id: "api", label: "Core API", sub: "Node · Express", x: 196, y: 250, kind: "core", info: "One backend joining every module, so sales, stock, billing and content all link to the same data." },
      { id: "leads", label: "Sales & leads", sub: "transfers · follow-ups", x: 384, y: 0, h: 54, kind: "app", info: "Lead pipeline per seller: status, follow-ups, transfers and performance reviews." },
      { id: "web", label: "Website & content", sub: "blog · calendar", x: 384, y: 62, h: 54, kind: "app", info: "Blog posts, website content updates and the shared calendar, managed from inside the platform." },
      { id: "store", label: "Warehouses", sub: "stock · check-ins", x: 384, y: 124, h: 54, kind: "app", info: "Stock and sales per warehouse, workers' check-in times and completed tasks." },
      { id: "bill", label: "Billing & reports", sub: "1-click documents", x: 384, y: 186, h: 54, kind: "app", info: "Bills, revenue and turnover analytics for each warehouse and the whole company, with one-click documentation." },
      { id: "mon", label: "Monitoring", sub: "logs · IPs · API tests", x: 384, y: 248, h: 54, kind: "ext", info: "Monitoring dashboard for the tech team: logs, IP addresses, API runs and API testing." },
      { id: "box", label: "Suggestion box", sub: "encrypted · anonymous", x: 384, y: 310, h: 54, kind: "ext", info: "Anyone can drop a suggestion. Records are encrypted so no one can tell who wrote them; only the super admin can read them, and even they can't see the author." },
      { id: "data", label: "MongoDB + Redis", sub: "tuned · cached", x: 384, y: 372, h: 54, kind: "data", info: "Heavy data kept fast with Redis caching and MongoDB index tuning." },
    ],
    edges: [
      { from: "sa", to: "rbac" }, { from: "sales", to: "rbac" }, { from: "team", to: "rbac" }, { from: "mkt", to: "rbac" },
      { from: "tech", to: "rbac" }, { from: "wh", to: "rbac" }, { from: "acc", to: "rbac" },
      { from: "rbac", to: "api" },
      { from: "api", to: "leads" }, { from: "api", to: "web" }, { from: "api", to: "store" }, { from: "api", to: "bill" },
      { from: "api", to: "mon" }, { from: "api", to: "box" }, { from: "api", to: "data" },
    ],
    steps: [
      { title: "The brief", body: "AUM Industries ran its business across separate tools. They wanted one product of their own where every team works, and where everything links together.", nodes: ["sa", "sales", "team", "mkt", "tech", "wh", "acc"] },
      { title: "The super admin builds the roles", body: "The super admin creates as many roles as the company needs and decides what each can see and do, with full analytics and sales across the system. Every role gets its own task management.", nodes: ["sa", "rbac", "api"], edges: ["sa>rbac", "rbac>api"] },
      { title: "Sales, seller by seller", body: "Sales managers review each seller's performance, transfer leads, and check lead status, follow-ups and task updates. Sellers work their own pipeline.", nodes: ["sales", "team", "rbac", "api", "leads"], edges: ["sales>rbac", "team>rbac", "rbac>api", "api>leads"] },
      { title: "Warehouses and accounts", body: "Warehouse managers see their own stock, sales and workers' check-ins. Accountants see sales for every warehouse and the whole company, analyse revenue and turnover, and generate bills and reports in one click.", nodes: ["wh", "acc", "rbac", "api", "store", "bill"], edges: ["wh>rbac", "acc>rbac", "rbac>api", "api>store", "api>bill"] },
      { title: "Marketing and tech", body: "Marketing posts blogs, updates website content and runs the calendar. Tech reviews issues on a monitoring dashboard, tests APIs, and checks logs, IPs and every API run.", nodes: ["mkt", "tech", "rbac", "api", "web", "mon"], edges: ["mkt>rbac", "tech>rbac", "rbac>api", "api>web", "api>mon"] },
      { title: "The anonymous suggestion box", body: "Anyone can leave a suggestion. Records are encrypted, so no one can tell who wrote them: only the super admin can read them, and even they can't see the author.", nodes: ["sa", "rbac", "api", "box"], edges: ["sa>rbac", "rbac>api", "api>box"] },
      { title: "Heavy data, still fast", body: "Redis caching and MongoDB index tuning cut API response time by 48% across the company's systems.", nodes: ["api", "data"], edges: ["api>data"] },
      { title: "In daily use", body: "Every team uses it every day. It's a private product, so this diagram is the screenshot.", nodes: ["sa", "sales", "team", "mkt", "tech", "wh", "acc", "rbac", "api", "leads", "web", "store", "bill", "mon", "box", "data"] },
    ],
  },
  {
    id: "laeuropa",
    index: "03",
    name: "La Europa Education",
    kicker: "Client · Website + admin · Live",
    summary: "A study-abroad company that has helped 500+ students needed a site its own staff could run. We rebuilt it from scratch and moved it to a new home.",
    role: "Full-stack developer",
    credit: "Built with Yaksh Bambhroliya",
    stack: ["Next.js", "React", "TypeScript", "Firestore", "Cloudinary", "Vercel"],
    metrics: [
      { value: "35", label: "destination pages" },
      { value: "8", label: "areas the staff run themselves" },
      { value: "3 Nov", label: "live since, 2026" },
    ],
    live: "https://www.laeuropaeducation.com",
    cover: "/media/projects/laeuropa/cover.webp",
    demo: "laeuropa",
    nodes: [
      { id: "stu", label: "Students", sub: "500+ helped", x: 14, y: 24, kind: "actor", info: "Students exploring 35 European study destinations." },
      { id: "site", label: "Public site", sub: "35 destinations", x: 14, y: 124, kind: "app", info: "Destinations, services, reviews, news and an enquiry form." },
      { id: "admin", label: "Admin panel", sub: "8 staff-run areas", x: 14, y: 254, kind: "app", info: "Staff run 8 areas themselves: updates, enquiries (with export), reviews, certificates, destinations, FAQs, team and settings." },
      { id: "staff", label: "Staff", x: 14, y: 354, kind: "actor", info: "The company's own team, no developer needed for updates." },
      { id: "server", label: "Server layer", sub: "server-only data", x: 200, y: 190, kind: "core", info: "Everything goes through the server. The browser never talks to the database." },
      { id: "fs", label: "Firestore", sub: "server-only", x: 384, y: 14, kind: "data", info: "All content and enquiries, accessed only from the server." },
      { id: "cdn", label: "Cloudinary", sub: "photos · PDFs", x: 384, y: 112, kind: "data", info: "Photos and certificate PDFs, uploaded through signed requests from the server." },
      { id: "guard", label: "Security", sub: "headers · limits", x: 384, y: 230, kind: "ext", info: "Per-request security headers, rate-limited logins, and HTML cleaning on everything staff type." },
      { id: "dns", label: "Domain & email", sub: "MX · SPF · DMARC", x: 384, y: 340, kind: "ext", info: "Domain moved to Vercel with the company's email records rebuilt and verified." },
    ],
    edges: [
      { from: "stu", to: "site" }, { from: "staff", to: "admin" },
      { from: "site", to: "server" }, { from: "admin", to: "server" },
      { from: "server", to: "fs" }, { from: "server", to: "cdn" }, { from: "server", to: "guard" }, { from: "server", to: "dns" },
    ],
    steps: [
      { title: "The brief", body: "The old site ran on PHP and staff couldn't update it themselves. They needed a site they could run on their own.", nodes: ["stu", "site", "staff"], edges: ["stu>site"] },
      { title: "Run by its own staff", body: "Staff publish updates and manage enquiries, reviews, certificates and FAQs from their own admin panel.", nodes: ["staff", "admin", "server", "site"], edges: ["staff>admin", "admin>server", "site>server"] },
      { title: "Boss fight: the database switch", body: "We started on Supabase, then moved to Firestore and Cloudinary mid-build, so the browser never touches the database and every upload goes through the server.", nodes: ["server", "fs", "cdn"], edges: ["server>fs", "server>cdn"] },
      { title: "Locked down", body: "Security headers on every request, rate-limited logins, and everything staff type is cleaned before visitors see it.", nodes: ["server", "guard"], edges: ["server>guard"] },
      { title: "Boss fight: the vanishing email", body: "Moving the domain dropped the company's email records. We rebuilt them, added DMARC, and verified them live before any mail bounced.", nodes: ["server", "dns"], edges: ["server>dns"] },
      { title: "Live", body: "Live at laeuropaeducation.com since 3 November 2026.", nodes: ["stu", "site", "admin", "staff", "server", "fs", "cdn", "guard", "dns"] },
    ],
  },
  {
    id: "afi",
    index: "04",
    name: "AFI Agent",
    kicker: "Hacker House Goa · TigerGraph fraud track · Solo",
    summary: "Fraud investigation where AI agents hunt through a live knowledge graph, then a prosecutor and a defense argue before any decision is made.",
    role: "Solo build, in about 3 days",
    stack: ["TypeScript", "TigerGraph", "GSQL", "MCP", "GraphRAG", "Groq"],
    metrics: [
      { value: "20", label: "official benchmark cases validated" },
      { value: "14", label: "tests passing" },
      { value: "~3", label: "days, solo" },
    ],
    code: gh("AFI-agent"),
    nodes: [
      { id: "alert", label: "Fraud alert", sub: "ML score · dispute", x: 10, y: 20, kind: "actor", info: "An alert from a risk score, a customer dispute or an analyst." },
      { id: "cmd", label: "Commander", sub: "orchestrates", x: 10, y: 150, kind: "core", info: "The orchestrator that sends hunters and gathers their evidence." },
      { id: "tg", label: "TigerGraph", sub: "live graph", x: 10, y: 320, kind: "data", info: "Customers, cards, transactions, devices, regions and past cases, on TigerGraph Savanna." },
      { id: "h1", label: "Transaction hunter", x: 196, y: 40, w: 150, h: 46, kind: "app", info: "Amounts, timing and merchant codes." },
      { id: "h2", label: "Graph hunter", x: 196, y: 112, w: 150, h: 46, kind: "app", info: "Two-hop neighbours and multi-card clusters." },
      { id: "h3", label: "Device hunter", x: 196, y: 184, w: 150, h: 46, kind: "app", info: "Device profiles and email domains." },
      { id: "h4", label: "Case memory", x: 196, y: 256, w: 150, h: 46, kind: "app", info: "Past closed cases, with a strict time cutoff." },
      { id: "pro", label: "Prosecutor", sub: "argues fraud", x: 390, y: 40, kind: "ext", info: "Builds the strongest case that this is fraud." },
      { id: "def", label: "Defense", sub: "argues innocence", x: 390, y: 140, kind: "ext", info: "Builds the strongest case that it isn't, to cancel out bias." },
      { id: "rules", label: "Bank rules", sub: "R1 to R7", x: 390, y: 244, kind: "core", info: "Governance rules that turn the arguments into a defensible next action, with human approval routing." },
      { id: "act", label: "Next action", sub: "allow · block · report", x: 390, y: 344, kind: "actor", info: "Allow, decline, block the card or file a suspicious-activity report, then write the case back to the graph." },
    ],
    edges: [
      { from: "alert", to: "cmd" }, { from: "cmd", to: "h1" }, { from: "cmd", to: "h2" }, { from: "cmd", to: "h3" }, { from: "cmd", to: "h4" },
      { from: "tg", to: "h2" }, { from: "tg", to: "h4" },
      { from: "h1", to: "pro" }, { from: "h3", to: "def" }, { from: "h2", to: "pro" }, { from: "h4", to: "def" },
      { from: "pro", to: "rules" }, { from: "def", to: "rules" }, { from: "rules", to: "act" },
    ],
    steps: [
      { title: "The problem", body: "Fraud analysts decide from one-sided evidence, and bias creeps in.", nodes: ["alert"] },
      { title: "The hunt", body: "A commander agent sends hunters through transactions, graph links, devices and past cases on a live TigerGraph.", nodes: ["alert", "cmd", "h1", "h2", "h3", "h4", "tg"], edges: ["alert>cmd", "cmd>h1", "cmd>h2", "cmd>h3", "cmd>h4", "tg>h2", "tg>h4"] },
      { title: "No future leakage", body: "Agents can only use evidence from before the alert, so a verdict never leans on what happened later.", nodes: ["h4", "tg", "h2"], edges: ["tg>h4", "tg>h2"] },
      { title: "The trial", body: "A prosecutor agent and a defense agent argue the case before anything is decided.", nodes: ["h1", "h2", "h3", "h4", "pro", "def"], edges: ["h1>pro", "h2>pro", "h3>def", "h4>def"] },
      { title: "The verdict", body: "Bank rules pick the next action with human approval routing, and the case is written back to the graph.", nodes: ["pro", "def", "rules", "act"], edges: ["pro>rules", "def>rules", "rules>act"] },
      { title: "Result", body: "Built solo in about 3 days: 20 official benchmark cases validated against the event schema, 14 tests passing.", nodes: ["alert", "cmd", "tg", "h1", "h2", "h3", "h4", "pro", "def", "rules", "act"] },
    ],
  },
  {
    id: "obscurpilot",
    index: "05",
    name: "ObscurPilot",
    kicker: "Obscur Labs · Hacker House Goa · Desktop app",
    summary: "A voice copilot for solo live streamers. Hold Alt + X, say what you want, and Pilot, a glass robot with an LED face, plans it, asks before anything risky, and runs it on OBS and Twitch.",
    role: "Stages 0 to 5 of the core, plus the live-session setup",
    credit: "Built with Yaksh Bambhroliya as Obscur Labs",
    stack: ["Electron", "React", "TypeScript", "Wispr Flow", "Groq", "OBS WebSocket", "Twitch EventSub", "Supabase"],
    metrics: [
      { value: "Alt + X", label: "hold, talk, and your stream listens" },
      { value: "6", label: "trust boundaries designed in" },
      { value: "0–5", label: "core stages I built, each with an acceptance record" },
    ],
    code: ob("ObscurPilot"),
    cover: "/media/projects/obscurpilot/cover.webp",
    video: "/media/projects/obscurpilot/demo.mp4",
    demo: "pilot",
    nodes: [
      { id: "creator", label: "Creator", sub: "hold Alt + X", x: 10, y: 20, kind: "actor", info: "A solo streamer who's busy playing. They hold Alt + X and just say what they want." },
      { id: "ptt", label: "Push-to-talk", sub: "local audio", x: 10, y: 130, kind: "app", info: "Audio is captured locally only while the key is held. I built this audio pipeline." },
      { id: "ui", label: "Pilot UI", sub: "screen · no secrets", x: 10, y: 300, kind: "app", info: "The desktop screen, starring Pilot. It's treated as untrusted: it never sees a token, only a narrow, typed API." },
      { id: "stt", label: "Wispr Flow", sub: "transcription", x: 200, y: 20, kind: "ext", info: "Turns the spoken request into text." },
      { id: "plan", label: "Intent planner", sub: "Groq · fixed tools", x: 200, y: 130, kind: "core", info: "An AI model plans the steps, but can only pick from a fixed catalogue of tools, never free-form actions." },
      { id: "gate", label: "Safety gate", sub: "schema · approval", x: 200, y: 240, kind: "core", info: "Every command is schema-checked, permission-checked, can't run twice by accident, is audited and times out. Risky moderation waits for the creator's approval." },
      { id: "core", label: "Main process", sub: "owns secrets · IPC", x: 200, y: 350, kind: "core", info: "Holds the credentials and runs commands. The secure desktop shell and its IPC spine were part of my stages." },
      { id: "obs", label: "OBS", sub: "local bridge", x: 384, y: 20, kind: "ext", info: "Scenes, sources and streaming, controlled over OBS's authenticated local WebSocket. I built the OBS bridge." },
      { id: "twitch", label: "Twitch", sub: "Helix · EventSub", x: 384, y: 128, kind: "ext", info: "Stream info, chat events and moderation through the Twitch APIs." },
      { id: "supa", label: "Supabase", sub: "identity · RLS", x: 384, y: 236, kind: "data", info: "Accounts and settings, protected by row-level security so each creator only ever reaches their own data." },
      { id: "log", label: "Activity log", sub: "audited · redacted", x: 384, y: 344, kind: "data", info: "Every step is logged as structured JSON, with credentials and audio redacted." },
    ],
    edges: [
      { from: "creator", to: "ptt" }, { from: "ptt", to: "stt" }, { from: "stt", to: "plan" }, { from: "plan", to: "gate" },
      { from: "gate", to: "ui" }, { from: "gate", to: "core" },
      { from: "core", to: "obs" }, { from: "core", to: "twitch" }, { from: "core", to: "supa" }, { from: "core", to: "log" },
    ],
    steps: [
      { title: "The problem", body: "Solo streamers juggle OBS, Twitch, chat and their game at the same time, with no one to help.", nodes: ["creator"] },
      { title: "Hold Alt + X and talk", body: "Push-to-talk captures the audio locally and Wispr Flow turns it into text. I built the audio pipeline.", nodes: ["creator", "ptt", "stt"], edges: ["creator>ptt", "ptt>stt"] },
      { title: "Plan with fixed tools", body: "An AI planner turns the request into steps, but it can only choose from a fixed catalogue of tools.", nodes: ["stt", "plan"], edges: ["stt>plan"] },
      { title: "Trust the voice, not the screen", body: "Every command is checked, can't run twice and times out. Risky actions like a permanent ban stop and ask the creator first.", nodes: ["plan", "gate", "ui"], edges: ["plan>gate", "gate>ui"] },
      { title: "Act on OBS and Twitch", body: "The main process holds every secret and talks to OBS over a local socket and to Twitch through its APIs. The screen never sees a token.", nodes: ["gate", "core", "obs", "twitch"], edges: ["gate>core", "core>obs", "core>twitch"] },
      { title: "Remember, safely", body: "Identity and settings live in Supabase behind row-level security, and every step lands in an audited, redacted activity log.", nodes: ["core", "supa", "log"], edges: ["core>supa", "core>log"] },
      { title: "Built in gated stages", body: "I built stages 0 to 5: architecture, monorepo, secure desktop shell, domain kernel, audio pipeline and the OBS bridge. For Hacker House Goa we rebuilt the whole UI around Pilot.", nodes: ["creator", "ptt", "ui", "stt", "plan", "gate", "core", "obs", "twitch", "supa", "log"] },
    ],
  },
];

/* ── More work ── */
export interface Work { id: string; title: string; kind: string; line: string; stack: string[]; live?: string; code?: string; cover?: string; video?: string; art?: "hospital" | "swiftrut" | "ovx" }
export const work: Work[] = [
  { id: "ovx", title: "OVX-1 Voice RAG", kind: "Obscur Labs · Hacker House Goa", line: "Ask by voice in Hindi or English and get an answer from 1.17 million indexed chunks, with a 9.43 ms median. I built the sub-2 ms query pipeline and the benchmark UI.", stack: ["Python", "ONNX", "HNSW", "BM25"], live: "https://ovx-1-voice-rag.onrender.com", code: ob("OVX-1"), art: "ovx" },
  { id: "statescry", title: "StateScry", kind: "Developer tool · on npm", line: "Maps a running web app into a behaviour graph that coding agents can query, replay and compare.", stack: ["TypeScript", "Playwright", "MCP"], live: "https://statescry.vercel.app", code: gh("StateScry"), cover: "/media/projects/statescry/cover.webp" },
  { id: "hospital", title: "Hospital Management", kind: "AUM Industries · Private", line: "Reception books appointments, doctors keep notes, and patients get automatic check-up and medicine reminders.", stack: ["Node.js", "MongoDB", "Notifications"], art: "hospital" },
  { id: "phantom", title: "PHANTOM-CARBON", kind: "AI · GDG HackToSkill 2025", line: "Finds the 71% of a carbon footprint normal trackers miss. Vision AI reads receipts; 151 tests passing.", stack: ["Next.js", "Groq", "MongoDB"], live: "https://phantom-carbon.vercel.app", code: gh("PHANTOM-CARBON"), cover: "/media/projects/phantom/cover.webp" },
  { id: "lexai", title: "LexAI", kind: "AI · GDG HackToSkill 2026", line: "Turns legal documents into plain language, maps risky clauses and answers with cited sources.", stack: ["TypeScript", "Gemini", "React Flow"], live: "https://lex-ai-five-ruby.vercel.app", code: gh("LexAI"), cover: "/media/projects/lexai/cover.webp" },
  { id: "matchlens", title: "MatchLens AI", kind: "AI · GDG HackToSkill 2026", line: "An AI copilot for World Cup stadium staff: incidents, multilingual announcements and crowd plans.", stack: ["Next.js", "Gemini", "Node.js"], live: "https://matchlensai.vercel.app", code: gh("MatchLens-AI"), cover: "/media/projects/matchlens/cover.webp" },
  { id: "teamos", title: "TeamOS", kind: "Real-time product", line: "A Slack-style team app: messaging under 200 ms, calls, polls and file sharing, with event-driven user sync.", stack: ["React", "Stream Chat", "Clerk", "Inngest"], live: "https://team-os-lilac.vercel.app", code: gh("TeamOS"), cover: "/media/projects/teamos/cover.webp" },
  { id: "billstack", title: "BillStack", kind: "ERP · invoicing", line: "Quotes, invoices, stock, clients and payments that always add up. Auto-generated CRUD APIs; latency down 60%.", stack: ["React", "Node.js", "MongoDB"], live: "https://bill-stack-alpha.vercel.app", code: gh("BillStack"), cover: "/media/projects/billstack/cover.webp" },
  { id: "swiftrut", title: "SwiftRut SaaS", kind: "Backend lead · 2024–2025", line: "An AI resume builder 65% faster with Claude and Gemini, and a WebSocket platform holding 800 connections under 120 ms.", stack: ["Node.js", "WebSockets", "Claude", "Gemini"], art: "swiftrut" },
];

/* ── Skills as a system: each skill lists the projects that use it ── */
export const skillLayers = [
  { layer: "Backend", skills: ["Node.js", "Express", "REST APIs", "WebSockets", "RBAC", "JWT / OAuth", "Microservices", "Rate limiting"] },
  { layer: "Data", skills: ["MongoDB", "Redis", "MySQL", "Firestore", "TigerGraph"] },
  { layer: "Frontend", skills: ["React", "Next.js", "TypeScript", "Electron"] },
  { layer: "AI", skills: ["Claude API", "Gemini", "Groq", "RAG", "Agents", "MCP"] },
  { layer: "Cloud", skills: ["Vercel", "Docker", "Nginx", "PM2", "GCP", "GitHub Actions"] },
];

export const projectIndex: { id: string; name: string; href: string; skills: string[] }[] = [
  { id: "pravasa", name: "Pravasa Transworld", href: "#case-pravasa", skills: ["Node.js", "Express", "REST APIs", "WebSockets", "RBAC", "JWT / OAuth", "Rate limiting", "MongoDB", "Next.js", "TypeScript", "React", "Groq", "Vercel"] },
  { id: "aum", name: "AUM Platform", href: "#case-aum", skills: ["Node.js", "Express", "REST APIs", "RBAC", "JWT / OAuth", "Microservices", "MongoDB", "Redis", "Nginx", "PM2"] },
  { id: "laeuropa", name: "La Europa", href: "#case-laeuropa", skills: ["Next.js", "React", "TypeScript", "Firestore", "Rate limiting", "Vercel"] },
  { id: "afi", name: "AFI Agent", href: "#case-afi", skills: ["TypeScript", "TigerGraph", "Agents", "MCP", "RAG", "Groq"] },
  { id: "ovx", name: "OVX-1", href: "#more", skills: ["RAG", "Groq", "Docker"] },
  { id: "obscurpilot", name: "ObscurPilot", href: "#case-obscurpilot", skills: ["Electron", "React", "TypeScript", "Groq", "WebSockets", "Agents"] },
  { id: "statescry", name: "StateScry", href: "#work", skills: ["TypeScript", "MCP", "Agents"] },
  { id: "teamos", name: "TeamOS", href: "#work", skills: ["React", "Node.js", "Express", "MongoDB", "WebSockets", "JWT / OAuth", "Vercel"] },
  { id: "billstack", name: "BillStack", href: "#work", skills: ["React", "Node.js", "Express", "MongoDB", "REST APIs", "Vercel"] },
  { id: "phantom", name: "PHANTOM-CARBON", href: "#work", skills: ["Next.js", "TypeScript", "Groq", "MongoDB", "Vercel"] },
  { id: "lexai", name: "LexAI", href: "#work", skills: ["TypeScript", "Gemini", "React", "RAG"] },
  { id: "matchlens", name: "MatchLens AI", href: "#work", skills: ["Next.js", "Gemini", "Node.js", "TypeScript"] },
  { id: "swiftrut", name: "SwiftRut SaaS", href: "#work", skills: ["Node.js", "WebSockets", "Claude API", "Gemini", "MongoDB", "Redis", "MySQL", "GitHub Actions", "GCP"] },
];

export const achievements = [
  { value: "1st", label: "Runner Up", detail: "PromptWars Ahmedabad 2026 · AI app built and deployed in one day" },
  { value: "Top 400", label: "PromptWars Virtual", detail: "Challenge 3 · Google for Developers × Hack2Skill" },
  { value: "6", label: "Hackathon builds", detail: "Hacker House Goa 2026 · Google Solution Challenge 2025 · GDG HackToSkill" },
  { value: "162", label: "LeetCode solved", detail: "including 33 hard" },
  { value: "16,500+", label: "GitHub contributions", detail: "in 2026" },
];

/* ── "Vansh's desk": local time and the working hours the overlap is measured against ── */
export const desk = {
  timeZone: "Asia/Kolkata",
  utcOffsetMin: 330, // IST, no daylight saving
  city: "Ahmedabad",
  startHour: 10, // core hours, local time
  endHour: 19,
};

/* ── Rubber duck: real bugs from the case studies, told to the duck ── */
export const duckStories = [
  { title: "The open vault", where: "Pravasa", bug: "Passports and ID documents were reachable by link.", fix: "Every personal file moved to private storage with one-hour links, and personal data is encrypted at rest." },
  { title: "The silent mail", where: "Pravasa", bug: "For a day every email said \"sent\" but never arrived: the provider was quietly rejecting a bad sender.", fix: "Fixed the sender, and now every sender address is checked when the server starts." },
  { title: "The vanishing email", where: "La Europa", bug: "Moving the domain dropped the company's email records.", fix: "Rebuilt them, added DMARC, and verified them live before any mail bounced." },
  { title: "The database switch", where: "La Europa", bug: "We started on Supabase and had to move mid-build.", fix: "Moved to Firestore and Cloudinary so the browser never touches the database and every upload goes through the server." },
  { title: "The slow dashboard", where: "AUM Industries", bug: "Enterprise API responses were too slow on heavy data.", fix: "Redis caching and MongoDB index tuning: responses got 48% faster." },
];

export const learning = [
  { name: "How blockchains work", state: "Learning" },
  { name: "Solidity smart contracts", state: "Learning" },
  { name: "Rust", state: "Learning" },
  { name: "Web3 apps", state: "Exploring" },
];

/* ── Recruiter mode (/resume) ── */
export const resume = {
  experience: [
    { role: "Freelance Full Stack Developer", org: "Self-employed", when: "Feb 2026 – now", where: "Remote", points: ["3+ end-to-end apps for FinTech and SaaS clients, including Pravasa Transworld and La Europa Education.", "Cut client manual work by 60%+ with Claude and Gemini features."] },
    { role: "Full Stack Developer", org: "AUM Industries", when: "Apr 2025 – Jan 2026", where: "Ahmedabad, on-site", points: ["Backend architect of the company's all-in-one platform: sales and leads, warehouses, billing and one-click reports, website content, monitoring, and an encrypted anonymous suggestion box, with custom roles.", "Built the hospital management system with automatic patient reminders.", "API response time down 48% across 6 enterprise systems (Redis, MongoDB indexes).", "Role-based access on 4 production apps; 55% fewer post-release bugs."] },
    { role: "Full Stack Developer / Backend Lead", org: "SwiftRut Technologies", when: "Mar 2024 – Feb 2025", where: "Remote", points: ["Backend lead for 5 enterprise apps with a 6-person team, delivered before deadline.", "AI Resume Builder 65% faster with Claude and Gemini; 800 concurrent WebSocket connections under 120 ms."] },
  ],
  education: ["BCA, Swarnim Startup & Innovation University (2023–2026, completed)", "Full Stack Development (MERN) certificate, Red & White Multimedia Education, grade A+"],
  skills: [
    { group: "Languages & frameworks", items: "JavaScript, TypeScript, Node.js, Express, React, Next.js, GraphQL, WebRTC" },
    { group: "Data", items: "MongoDB, Redis, MySQL, Firestore" },
    { group: "Backend", items: "Microservices, REST, JWT/OAuth, RBAC, WebSockets, caching, rate limiting, Zod, Jest" },
    { group: "AI", items: "Claude API, Gemini API, Groq, RAG, agents, MCP" },
    { group: "Cloud", items: "GitHub Actions, Docker, Nginx, PM2, GCP, Vercel" },
  ],
  languages: "English, Hindi, Gujarati",
};
