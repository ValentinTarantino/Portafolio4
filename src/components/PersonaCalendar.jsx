import { useEffect, useState } from 'react';
import { getDayPeriod } from '../utils/dayPeriod';
import { getArgentinaTimeParts } from '../utils/argentinaTime';
import './PersonaCalendar.css';

const PERIOD_LABELS = {
  es: {
    morning: 'Mañana',
    midMorning: 'Media mañana',
    afternoon: 'Tarde',
    night: 'Noche',
    darkHour: 'Hora oscura',
  },
  en: {
    morning: 'Morning',
    midMorning: 'Mid-morning',
    afternoon: 'Afternoon',
    night: 'Night',
    darkHour: 'Dark Hour',
  },
};

const getCalendarData = (now, language) => {
  const locale = language === 'en' ? 'en' : 'es';
  const dateParts = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).formatToParts(now);
  const values = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
  const weekday = new Intl.DateTimeFormat(locale === 'en' ? 'en-US' : 'es-AR', {
    weekday: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(now).replace('.', '');
  const weekdayIndex = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(now);
  const weekdayClass = weekdayIndex === 'Sat'
    ? 'is-saturday'
    : weekdayIndex === 'Sun'
      ? 'is-sunday'
      : 'is-workday';
  const { hour } = getArgentinaTimeParts(now);

  return {
    day: values.day,
    month: values.month,
    weekday,
    weekdayClass,
    period: getDayPeriod(hour),
    isoDate: `${values.year}-${values.month}-${values.day}`,
    fullDate: new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-AR', {
      dateStyle: 'full',
      timeZone: 'America/Argentina/Buenos_Aires',
    }).format(now),
  };
};

const PersonaCalendar = ({ language = 'es', isDarkHour = false }) => {
  const [calendar, setCalendar] = useState(() => getCalendarData(new Date(), language));

  useEffect(() => {
    const updateCalendar = () => {
      setCalendar(getCalendarData(new Date(), language));
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') updateCalendar();
    };

    updateCalendar();
    const intervalId = window.setInterval(updateCalendar, 30_000);
    window.addEventListener('focus', updateCalendar);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener('focus', updateCalendar);
      document.removeEventListener('visibilitychange', refreshWhenVisible);
    };
  }, [language]);

  const periodLabel = PERIOD_LABELS[language === 'en' ? 'en' : 'es'][calendar.period];

  return (
    <div
      className="persona-calendar"
      role="group"
      aria-label={`${calendar.fullDate}, ${periodLabel}`}
    >
      <div className="persona-calendar__topline">
        <time className="persona-calendar__date" dateTime={calendar.isoDate}>
          <span className="persona-calendar__date-primary">{calendar.day}</span>
          <span className="persona-calendar__divider" aria-hidden="true">/</span>
          <span className="persona-calendar__date-secondary">{calendar.month}</span>
        </time>
        <span className={`persona-calendar__weekday ${calendar.weekdayClass}`}>{calendar.weekday}</span>
      </div>
      <span
        className={`persona-calendar__period${calendar.period === 'afternoon' ? ' is-afternoon' : ''}${isDarkHour ? ' is-dark-hour' : ''}`}
        aria-live="polite"
      >
        {periodLabel}
      </span>
    </div>
  );
};

export default PersonaCalendar;
