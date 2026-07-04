"use client";

import { useEffect, useState } from "react";

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ date }: { date: string }) {
  const target = new Date(date);
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft(target)), 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  if (!timeLeft) {
    return (
      <p className="font-script text-2xl text-primary">The big day is here!</p>
    );
  }

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex justify-center gap-3 sm:gap-4">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="w-14 rounded-xl border border-border-soft bg-surface py-2.5 font-display text-2xl font-semibold tabular-nums text-primary shadow-soft sm:w-16">
            {unit.value}
          </div>
          <div className="mt-1.5 text-xs tracking-wide text-stone-500 uppercase">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
