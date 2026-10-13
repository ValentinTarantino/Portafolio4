const argentinaTimeFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'America/Argentina/Buenos_Aires',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hourCycle: 'h23',
});

export const getArgentinaTimeParts = (date = new Date()) => {
  const parts = argentinaTimeFormatter.formatToParts(date);
  return parts.reduce((time, part) => {
    if (part.type !== 'literal') time[part.type] = Number(part.value);
    return time;
  }, {});
};

export const isArgentinaDarkHour = (time = getArgentinaTimeParts()) => time.hour < 6;

export const formatArgentinaClock = ({ hour, minute }) =>
  `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
