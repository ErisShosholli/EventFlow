import { useEffect, useState } from "react";

export function useCountdown(target: Date) {
  // Starts null so the very first client render matches the SSR-ed HTML
  // exactly; the real clock only kicks in once mounted, avoiding a
  // hydration mismatch from Date.now() differing between server and client.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (now === null) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: false, ready: false };
  }

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds, isPast: diff === 0, ready: true };
}
