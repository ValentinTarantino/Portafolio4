import { memo, useState } from 'react';
import './Contact.css';
import SweepTitle from './SweepTitle';

const publicAsset = (filename) => `${import.meta.env.BASE_URL}${filename}`;

const ContactIcon = ({ type }) => {
  if (type === 'email') {
    return <img src={publicAsset('gmail.png')} alt="" aria-hidden="true" width="32" height="32" className="pixel-avatar" />;
  }

  if (type === 'linkedin') {
    return <img src={publicAsset('avatar-pixel.png')} alt="" aria-hidden="true" width="32" height="32" className="pixel-avatar" />;
  }

  if (type === 'whatsapp') {
    return <img src={publicAsset('wsp.webp')} alt="" aria-hidden="true" width="32" height="32" className="pixel-avatar" />;
  }

  return <img src={publicAsset('github.png')} alt="" aria-hidden="true" width="32" height="32" className="pixel-avatar" />;
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
          <SweepTitle id="contact-title">{t.contact.title}</SweepTitle>
        </header>

        <div className="persona-link-grid" role="group" aria-label={labels.listLabel}>
          <ContactCard type="email" number="01" labels={labels} detail={t.contact.info.email} action={labels.copy} onCopy={copyEmail} copied={copied} />
          <ContactCard type="linkedin" number="02" labels={labels} detail={labels.details.linkedin} action={labels.open} href="https://www.linkedin.com/in/valentin-tarantino" />
          <ContactCard type="whatsapp" number="03" labels={labels} detail={t.contact.info.phone} action={labels.message} href="https://wa.me/541149476457" />
          <ContactCard type="github" number="04" labels={labels} detail={labels.details.github} action={labels.open} href="https://github.com/ValentinTarantino" />
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
