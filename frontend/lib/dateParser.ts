export function parseDateString(raw: string | null): Date | null {
  if (!raw) return null;
  const cleaned = raw.trim();

  // Already ISO
  const iso = Date.parse(cleaned);
  if (!isNaN(iso)) return new Date(iso);

  const months: Record<string, number> = {
    jan: 0, january: 0,
    feb: 1, february: 1,
    mar: 2, march: 2,
    apr: 3, april: 3,
    may: 4,
    jun: 5, june: 5,
    jul: 6, july: 6,
    aug: 7, august: 7,
    sep: 8, sept: 8, september: 8,
    oct: 9, october: 9,
    nov: 10, november: 10,
    dec: 11, december: 11,
  };

  // "30 April 2025" or "April 30, 2025"
  const written = cleaned.match(
    /(\d{1,2})\s+([a-z]+)\s+(\d{4})|([a-z]+)\s+(\d{1,2})[,\s]+(\d{4})/i
  );
  if (written) {
    if (written[1]) {
      const m = months[written[2].toLowerCase()];
      if (m !== undefined) return new Date(parseInt(written[3]), m, parseInt(written[1]));
    } else {
      const m = months[written[4].toLowerCase()];
      if (m !== undefined) return new Date(parseInt(written[6]), m, parseInt(written[5]));
    }
  }

  return null;
}

export function daysFromNow(date: Date | null): number | null {
  if (!date) return null;
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diff = date.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
