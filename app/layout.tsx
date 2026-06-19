import type { Metadata } from 'next'
import { Space_Grotesk, JetBrains_Mono } from 'next/font/google'
import './globals.css'

// Space Grotesk — display font
// Character: geometric, engineered, slight personality
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  preload: true,
  weight: ['300', '400', '500', '600', '700'],
})

// JetBrains Mono — body/code font
// Used for: annotations, metrics, code, all body text
// Keeps "code" and "thought" visually unified
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  preload: true,
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://vanshdobariya.dev'),
  title: {
    default: 'Vansh Dobariya | Full Stack Developer',
    template: '%s | Vansh Dobariya',
  },
  description:
    'Full Stack Developer with 2+ years building 15+ ' +
    'production applications. MERN, Next.js, TypeScript, ' +
    'Node.js, WebSockets, Redis. Claude API and Gemini AI ' +
    'integration. 16,500+ GitHub contributions. Available ' +
    'for remote opportunities.',
  keywords: [
    'Full Stack Developer India',
    'MERN Stack Developer Ahmedabad',
    'Next.js TypeScript Developer',
    'Node.js WebSocket Developer',
    'Remote Full Stack Developer',
    'Claude API Integration Developer',
    'Gemini API Developer',
    'React Node.js MongoDB Developer',
    'WebSocket WebRTC Developer',
    'AI Integration Full Stack',
    'Express.js Redis Developer',
    'Freelance Full Stack Developer',
  ],
  authors: [{ name: 'Vansh Dobariya' }],
  creator: 'Vansh Dobariya',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://vanshdobariya.dev',
    siteName: 'Vansh Dobariya — The Organism',
    title: 'Vansh Dobariya | Full Stack Developer',
    description:
      'A living system. 15+ production apps. ' +
      'MERN · Next.js · AI Integration.',
    images: [{
      url: '/og',
      width: 1200,
      height: 630,
      alt: 'The Organism — Vansh Dobariya Portfolio',
    }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vansh Dobariya | Full Stack Developer',
    description:
      'MERN · Next.js · AI Integration · WebSockets · ' +
      '15+ production apps.',
    images: ['/og'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// JSON-LD structured data for Google:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Vansh Dobariya',
  jobTitle: 'Full Stack Developer',
  url: 'https://vanshdobariya.dev',
  email: 'vanshbdobariya1312@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ahmedabad',
    addressRegion: 'Gujarat',
    addressCountry: 'IN',
  },
  sameAs: [
    'https://github.com/VanshBD',
    'https://linkedin.com/in/vanshdobariya',
  ],
  knowsAbout: [
    'JavaScript', 'TypeScript', 'Node.js',
    'React', 'Next.js', 'MongoDB', 'Redis',
    'WebSockets', 'REST API', 'GraphQL',
    'Claude API', 'Gemini API', 'Docker',
    'Nginx', 'PM2', 'GCP', 'Microservices',
  ],
  hasOccupation: {
    '@type': 'Occupation',
    name: 'Full Stack Developer',
    skills: 'MERN, Next.js, TypeScript, Node.js, ' +
            'WebSockets, AI Integration',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
