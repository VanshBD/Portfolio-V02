import type { Metadata, Viewport } from "next";
import { Schibsted_Grotesk, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { siteUrl } from "./site-url";
import { JsonLd } from "./JsonLd";

const display = Schibsted_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Geist({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const description =
  "Vansh Dobariya, Full-Stack Developer in Ahmedabad focused on backend systems. Case studies with live architecture diagrams: ObscurPilot, Pravasa Transworld, La Europa, AUM Industries and AFI Agent. Open to work worldwide.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  creator: "Vansh Dobariya",
  category: "technology",
  title: "Vansh Dobariya · Full-Stack Developer, backend systems",
  description,
  authors: [{ name: "Vansh Dobariya" }],
  verification: { google: "D3GWkUjtGU-D-VWClhn544bM1BuxWoCJJSyup0dkmt0" },
  keywords: ["Vansh Dobariya", "full-stack developer", "backend developer", "Node.js", "Next.js", "MongoDB", "Ahmedabad", "portfolio"],
  openGraph: {
    title: "Vansh Dobariya · I build the systems behind products",
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vansh Dobariya · I build the systems behind products",
    description,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0D1015" },
    { media: "(prefers-color-scheme: light)", color: "#F2F3EF" },
  ],
  width: "device-width",
  initialScale: 1,
};

/* Applies the saved theme before first paint so there's no flash. */
const themeScript = `try{var t=localStorage.getItem('vd-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
