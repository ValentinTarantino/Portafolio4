const PERIOD_BOUNDARIES = [6, 10, 12, 20];

export const getDayPeriod = (hour) => {
  if (hour < 6) return 'darkHour';
  if (hour >= 6 && hour < 10) return 'morning';
  if (hour >= 10 && hour < 12) return 'midMorning';
  if (hour >= 12 && hour < 20) return 'afternoon';
  return 'night';
};

export const getDayClassification = (date) => (
  date.getDay() === 0 || date.getDay() === 6 ? 'weekend' : 'workday'
);

export const getNextDayPeriodChange = (now = new Date()) => {
  const nextBoundary = PERIOD_BOUNDARIES
    .map((hour) => {
      const candidate = new Date(now);
      candidate.setHours(hour, 0, 0, 0);
      if (candidate <= now) candidate.setDate(candidate.getDate() + 1);
      return candidate;
    })
    .sort((a, b) => a.getTime() - b.getTime())[0];

  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);
  return Math.min(nextBoundary.getTime(), midnight.getTime());
};
