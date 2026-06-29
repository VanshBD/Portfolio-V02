import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vansh Dobariya — The Book That Writes Itself",
  description:
    "A portfolio that writes itself as you scroll. Five projects. One developer. Full Stack · React · Node.js · Blockchain · AI.",
  authors: [{ name: "Vansh Dobariya" }],
  keywords: [
    "Vansh Dobariya",
    "portfolio",
    "full stack developer",
    "MERN",
    "blockchain",
    "AI integration",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "Vansh Dobariya — The Book That Writes Itself",
    description: "A portfolio that writes itself as you scroll.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vansh Dobariya — Portfolio",
    description: "The portfolio that writes itself. Scroll to read.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f7f4ed",
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
        {/* Oswald = display · Special Elite = typewriter body · Caveat = handwritten margin notes */}
        <link
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@300;400;600;700&family=Special+Elite&family=Caveat:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
