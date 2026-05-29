import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import emailjs from '@emailjs/browser';
import './Contact.css';

// ─── EmailJS config ───────────────────────────────────────────────────────────
// 1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
// 2. Create a service, an email template, and grab your Public Key
// 3. Replace the three placeholders below with your actual IDs
const EMAILJS_SERVICE_ID  = 'service_4e0pogu';
const EMAILJS_TEMPLATE_ID = 'template_ae7vj2v';
const EMAILJS_PUBLIC_KEY  = 'XIO_llVQGZXPMstmk';
// ─────────────────────────────────────────────────────────────────────────────

const validate = (fields, tf) => {
  const errors = {};
  if (!fields.name.trim())                         errors.name    = tf.nameRequired;
  if (!fields.email.trim())                        errors.email   = tf.emailRequired;
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))
                                                   errors.email   = tf.emailInvalid;
  if (!fields.message.trim())                      errors.message = tf.messageRequired;
  else if (fields.message.trim().length < 10)      errors.message = tf.messageMinLength;
  return errors;
};

const Contact = ({ t }) => {
  const tf = t.contact.form;
  const formRef = useRef(null);

  const [fields, setFields]   = useState({ name: '', email: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus]   = useState('idle'); // idle | sending | success | error

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const next = { ...fields, [name]: value };
      const errs = validate(next, tf);
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validate(fields, tf);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, message: true });
    const errs = validate(fields, tf);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus('sending');
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      );
      setStatus('success');
      setFields({ name: '', email: '', message: '' });
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const resetForm = () => {
    setStatus('idle');
    setErrors({});
    setTouched({});
  };

  return (
    <section id="contact" className="section contact">
      <motion.div
        className="container"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="section-title">{t.contact.title}</h2>
        <p className="section-subtitle">{t.contact.subtitle}</p>

        <div className="contact-content">
          {/* ── Left: info cards ── */}
          <div className="contact-info">
            {/* Email */}
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>{t.contact.info.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9167 21 20.92C18.4 20.97 15.94 20.06 13.71 18.35C11.61 16.78 9.78 14.95 8.21 12.85C6.5 10.62 5.59 8.16 5.64 5.56C5.64277 5.00732 6.08668 4.56341 6.64 4.56H9.64C10.1928 4.56 10.64 5.00732 10.64 5.56C10.64 6.6 10.89 7.61 11.36 8.52C11.4706 8.77754 11.4516 9.07071 11.31 9.31L9.83 11.31C10.8 13.33 12.67 15.2 14.69 16.17L16.69 14.69C16.9294 14.5484 17.2226 14.5294 17.48 14.64C18.39 15.11 19.4 15.36 20.44 15.36C20.9928 15.36 21.44 15.8073 21.44 16.36V19.36C21.44 19.9128 20.9928 20.36 20.44 20.36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{t.contact.labels.phone}</h3>
                <p>{t.contact.info.phone}</p>
              </div>
            </div>

            {/* Location */}
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{t.contact.labels.location}</h3>
                <p>{t.contact.info.location}</p>
              </div>
            </div>

            {/* Socials */}
            <div className="social-links">
              <a href="https://www.linkedin.com/in/valent%C3%ADn-tarantino/" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor"/>
                  <rect x="2" y="9" width="4" height="12" fill="currentColor"/>
                  <circle cx="4" cy="4" r="2" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://github.com/ValentinTarantino" target="_blank" rel="noopener noreferrer" className="social-link" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>

          {/* ── Right: form ── */}
          <div className="contact-form-wrapper">
            <AnimatePresence mode="wait">

              {/* SUCCESS */}
              {status === 'success' && (
                <motion.div
                  key="success"
                  className="form-feedback success-feedback"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <div className="feedback-icon success-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <motion.circle
                        cx="12" cy="12" r="10"
                        stroke="#4ade80" strokeWidth="2"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.6 }}
                      />
                      <motion.path
                        d="M7 13l3 3 7-7"
                        stroke="#4ade80" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                      />
                    </svg>
                  </div>
                  <h3>{tf.successTitle}</h3>
                  <p>{tf.successText}</p>
                  <button className="feedback-btn" onClick={resetForm}>
                    {tf.send} →
                  </button>
                </motion.div>
              )}

              {/* ERROR */}
              {status === 'error' && (
                <motion.div
                  key="error"
                  className="form-feedback error-feedback"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                >
                  <div className="feedback-icon error-icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="#f87171" strokeWidth="2"/>
                      <line x1="12" y1="8" x2="12" y2="12" stroke="#f87171" strokeWidth="2.5" strokeLinecap="round"/>
                      <circle cx="12" cy="16" r="1.2" fill="#f87171"/>
                    </svg>
                  </div>
                  <h3>{tf.errorTitle}</h3>
                  <p>{tf.errorText}</p>
                  <button className="feedback-btn" onClick={resetForm}>
                    ← {tf.send}
                  </button>
                </motion.div>
              )}

              {/* FORM */}
              {(status === 'idle' || status === 'sending') && (
                <motion.form
                  key="form"
                  ref={formRef}
                  className="contact-form glass-card"
                  onSubmit={handleSubmit}
                  noValidate
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.4 }}
                >
                  {/* Name */}
                  <div className={`form-group ${errors.name && touched.name ? 'has-error' : ''} ${fields.name && !errors.name ? 'has-value' : ''}`}>
                    <label htmlFor="contact-name" className="form-label">{tf.nameLabel}</label>
                    <input
                      id="contact-name"
                      type="text"
                      name="name"
                      className="form-input"
                      placeholder={tf.namePlaceholder}
                      value={fields.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                    />
                    <AnimatePresence>
                      {errors.name && touched.name && (
                        <motion.span
                          className="form-error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          ⚠ {errors.name}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Email */}
                  <div className={`form-group ${errors.email && touched.email ? 'has-error' : ''} ${fields.email && !errors.email ? 'has-value' : ''}`}>
                    <label htmlFor="contact-email" className="form-label">{tf.emailLabel}</label>
                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      className="form-input"
                      placeholder={tf.emailPlaceholder}
                      value={fields.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                    />
                    <AnimatePresence>
                      {errors.email && touched.email && (
                        <motion.span
                          className="form-error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          ⚠ {errors.email}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Message */}
                  <div className={`form-group ${errors.message && touched.message ? 'has-error' : ''} ${fields.message && !errors.message ? 'has-value' : ''}`}>
                    <label htmlFor="contact-message" className="form-label">{tf.messageLabel}</label>
                    <textarea
                      id="contact-message"
                      name="message"
                      className="form-textarea"
                      placeholder={tf.messagePlaceholder}
                      value={fields.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                    />
                    <div className="char-count">
                      {fields.message.length} / 1000
                    </div>
                    <AnimatePresence>
                      {errors.message && touched.message && (
                        <motion.span
                          className="form-error"
                          initial={{ opacity: 0, y: -6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                        >
                          ⚠ {errors.message}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Submit */}
                  <motion.button
                    type="submit"
                    className={`form-submit-btn ${status === 'sending' ? 'sending' : ''}`}
                    disabled={status === 'sending'}
                    whileHover={status !== 'sending' ? { scale: 1.02, y: -2 } : {}}
                    whileTap={status !== 'sending' ? { scale: 0.98 } : {}}
                  >
                    {status === 'sending' ? (
                      <>
                        <span className="spinner" />
                        {tf.sending}
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="send-icon">
                          <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 2L15 22 11 13 2 9l20-7z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {tf.send}
                      </>
                    )}
                  </motion.button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export default Contact;
