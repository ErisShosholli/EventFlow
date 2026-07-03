import { useCountdown } from "./useCountdown";

export function EventDetails({
  eventDate,
  location,
  accentClassName,
}: {
  eventDate: Date;
  location?: string | null;
  accentClassName?: string;
}) {
  const { days, hours, minutes, seconds, isPast } = useCountdown(eventDate);

  const formattedDate = eventDate.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  const mapsHref = location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`
    : undefined;

  return (
    <div className="space-y-3 text-center">
      <p className="text-lg">{formattedDate}</p>
      <p className="opacity-80">{formattedTime}</p>
      {location && (
        <a
          href={mapsHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block underline underline-offset-4"
        >
          {location}
        </a>
      )}
      {!isPast ? (
        <div className={`flex justify-center gap-4 pt-2 font-mono text-sm ${accentClassName ?? ""}`}>
          <span>{days}d</span>
          <span>{hours}h</span>
          <span>{minutes}m</span>
          <span>{seconds}s</span>
        </div>
      ) : (
        <p className="pt-2 text-sm opacity-70">The big day has arrived!</p>
      )}
    </div>
  );
}
