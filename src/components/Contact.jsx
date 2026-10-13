import { memo, useState } from 'react';
import './Contact.css';

const ContactIcon = ({ type }) => {
  if (type === 'email') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6.5h18v11H3z" /><path d="m3.5 7 8.5 6.5L20.5 7" /></svg>;
  }

  if (type === 'linkedin') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 9v10M5 5v.01M10 19v-6a4 4 0 0 1 8 0v6M10 9v10" /><circle cx="5" cy="5" r="1.4" /></svg>;
  }

  if (type === 'whatsapp') {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 11.7a8.5 8.5 0 0 1-12.6 7.5L3 20l.9-4.7a8.5 8.5 0 1 1 16.6-3.6Z" /><path d="M8.3 8.1c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.5.6c-.2.2-.2.4-.1.6.7 1.2 1.6 2 2.8 2.6.2.1.4.1.6-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .3-.2 1.1-.7 1.5-.5.5-1.2.7-2 .5-1-.2-2.3-.8-3.8-2.1-1.2-1.1-2.1-2.5-2.4-3.5-.3-1.1 0-2 .4-2.7Z" /></svg>;
  }

  return <svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.5 21.6c.6.1.8-.2.8-.6v-2.2c-3.4.7-4.1-1.4-4.1-1.4-.5-1.4-1.3-1.8-1.3-1.8-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1.1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.4-5.5-6.1 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.7 1.7.3 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.7-2.8 5.7-5.5 6.1.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.1 11.1 0 0 0 12 .9Z" /></svg>;
};

const ContactCard = ({ type, number, labels, detail, action, href, onCopy, copied }) => {
  const Tag = href ? 'a' : 'button';
  const props = href
    ? { href, target: '_blank', rel: 'noopener noreferrer' }
    : { type: 'button', onClick: onCopy };

  return (
    <Tag className={`persona-link-card persona-link-card--${type}`} {...props}>
      <span className="persona-link-card__arcana">{labels.cardTypes[type]}</span>
      <span className="persona-link-card__rank" aria-hidden="true">{number}</span>
      <span className="persona-link-card__identity">
        <span className="persona-link-card__icon"><ContactIcon type={type} /></span>
        <span className="persona-link-card__identity-text">
          <span className="persona-link-card__detail">{detail}</span>
          <strong>{labels.names[type]}</strong>
        </span>
      </span>
      <span className="persona-link-card__action" aria-live={type === 'email' ? 'polite' : undefined}>
        {type === 'email' && copied ? labels.copied : action}
        {type !== 'email' && <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M6 5h9v9" /></svg>}
      </span>
    </Tag>
  );
};

const Contact = ({ t }) => {
  const [copied, setCopied] = useState(false);
  const labels = t.contact.cardLabels;

  const copyEmail = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(t.contact.info.email);
      } else {
        const input = document.createElement('textarea');
        input.value = t.contact.info.email;
        input.setAttribute('readonly', '');
        input.style.position = 'fixed';
        input.style.opacity = '0';
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        input.remove();
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section id="contact" className="section contact persona-comms" aria-labelledby="contact-title">
      <div className="container">
        <header className="persona-comms__heading">
          <span className="persona-comms__eyebrow">{t.contact.stationLabel}</span>
          <h2 className="section-title" id="contact-title">{t.contact.title}</h2>
          <p className="section-subtitle">{t.contact.subtitle}</p>
        </header>

        <div className="persona-link-grid" role="group" aria-label={labels.listLabel}>
          <ContactCard type="email" number="01" labels={labels} detail={t.contact.info.email} action={labels.copy} onCopy={copyEmail} copied={copied} />
          <ContactCard type="linkedin" number="02" labels={labels} detail={labels.details.linkedin} action={labels.open} href="https://www.linkedin.com/in/valentin-tarantino" />
          <ContactCard type="github" number="03" labels={labels} detail={labels.details.github} action={labels.open} href="https://github.com/ValentinTarantino" />
          <ContactCard type="whatsapp" number="04" labels={labels} detail={t.contact.info.phone} action={labels.message} href="https://wa.me/541149476457" />
        </div>

        <div className="persona-comms__location">
          <span>{labels.location}</span>
          <strong>{t.contact.info.location}</strong>
        </div>
      </div>
    </section>
  );
};

export default memo(Contact);
