import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NULL CITY — The Debugger · Vansh Dobariya",
  description:
    "A scroll-driven noir comic. Vansh Dobariya works the night shift in NULL CITY, where code goes to break. Five cases. One developer. To be continued — if you call.",
  authors: [{ name: "Vansh Dobariya" }],
  keywords: [
    "Vansh Dobariya",
    "portfolio",
    "full stack developer",
    "noir comic",
    "MERN",
    "blockchain",
    "AI integration",
  ],
  openGraph: {
    title: "NULL CITY — The Debugger",
    description: "A noir comic portfolio. Scroll to enter the city.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NULL CITY — The Debugger",
    description: "A noir comic portfolio by Vansh Dobariya.",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Oswald = display/SFX · Bangers = shouts · Special Elite = noir narration · Comic Neue = dialogue */}
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;500;600;700&family=Bangers&family=Special+Elite&family=Comic+Neue:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
