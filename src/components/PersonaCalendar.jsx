import { useEffect, useState } from 'react';
import { getDayPeriod, getNextDayPeriodChange } from '../utils/dayPeriod';
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
  const dateParts = new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: '2-digit',
  }).formatToParts(now);
  const values = Object.fromEntries(dateParts.map(({ type, value }) => [type, value]));
  const weekday = new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(now).replace('.', '');

  return {
    day: values.day,
    month: values.month,
    weekday,
    period: getDayPeriod(now.getHours()),
    isoDate: `${now.getFullYear()}-${values.month}-${values.day}`,
    fullDate: new Intl.DateTimeFormat(language === 'en' ? 'en-US' : 'es-AR', {
      dateStyle: 'full',
    }).format(now),
  };
};

const PersonaCalendar = ({ language = 'es', isDarkHour = false }) => {
  const [calendar, setCalendar] = useState(() => getCalendarData(new Date(), language));

  useEffect(() => {
    let timeoutId;
    let disposed = false;

    const scheduleNextUpdate = () => {
      window.clearTimeout(timeoutId);
      const now = new Date();
      setCalendar(getCalendarData(now, language));
      const delay = Math.max(0, getNextDayPeriodChange(now) - now.getTime()) + 50;
      timeoutId = window.setTimeout(() => {
        if (!disposed) scheduleNextUpdate();
      }, delay);
    };

    const refreshWhenVisible = () => {
      if (document.visibilityState === 'visible') scheduleNextUpdate();
    };

    scheduleNextUpdate();
    window.addEventListener('focus', scheduleNextUpdate);
    document.addEventListener('visibilitychange', refreshWhenVisible);

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      window.removeEventListener('focus', scheduleNextUpdate);
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
        <span className="persona-calendar__weekday">{calendar.weekday}</span>
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
