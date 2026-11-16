
/*
  Reads the public GitHub contribution calendar (the same one on the profile
  page, which counts private work too) and turns it into daily numbers.
  Cached for an hour; if GitHub is unreachable the page just leaves it out.
*/

export interface ContribDay { date: string; count: number; level: number }
export interface Contributions {
  user: string;
  total: number;
  days: ContribDay[];
  streak: number;
  last30: number;
  today: number;
  best: ContribDay;
}

export async function getContributions(user: string): Promise<Contributions | null> {
  try {
    const res = await fetch(`https://github.com/users/${user}/contributions`, {
      next: { revalidate: 3600 },
      headers: { "User-Agent": "portfolio-contributions-reader" },
    });
    if (!res.ok) return null;
    const html = await res.text();

    const tips = new Map<string, number>();
    for (const m of html.matchAll(/for="(contribution-day-component-\d+-\d+)"[^>]*>([^<]*)<\/tool-tip>/g)) {
      const n = /^(\d+|No) contribution/.exec(m[2]);
      tips.set(m[1], !n || n[1] === "No" ? 0 : Number(n[1]));
    }
    const days: ContribDay[] = [];
    for (const m of html.matchAll(/data-date="(\d{4}-\d{2}-\d{2})" id="(contribution-day-component-\d+-\d+)" data-level="([0-4])"/g)) {
      days.push({ date: m[1], level: Number(m[3]), count: tips.get(m[2]) ?? 0 });
    }
    if (days.length < 30) return null;
    days.sort((a, b) => (a.date < b.date ? -1 : 1));

    const total = days.reduce((s, d) => s + d.count, 0);
    /* today may still be at zero; the streak only breaks on a finished day */
    let streak = 0;
    for (let i = days.length - 1; i >= 0; i--) {
      if (days[i].count > 0) streak++;
      else if (i === days.length - 1) continue;
      else break;
    }
    const last30 = days.slice(-30).reduce((s, d) => s + d.count, 0);
    const best = days.reduce((b, d) => (d.count > b.count ? d : b), days[0]);
    return { user, total, days, streak, last30, today: days[days.length - 1].count, best };
  } catch {
    return null;
  }
}
