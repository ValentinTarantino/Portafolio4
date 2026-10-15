import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// CV preview modal — lazy-loaded so framer-motion stays out of the initial bundle.
// Keeps the exact spring enter/exit animation, Escape handling and scroll lock.
const CvModal = ({ t, cvUrl, cvSrc, onClose }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setVisible(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <AnimatePresence onExitComplete={onClose}>
      {visible && (
        <div className="cv-modal-overlay" onClick={() => setVisible(false)}>
          <motion.div
            className="cv-modal-content glass-card"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            role="dialog"
            aria-modal="true"
            aria-label={t.hero.cvModalTitle}
          >
            <div className="cv-modal-header">
              <h3>{t.hero.cvModalTitle}</h3>
              <div className="cv-modal-actions">
                <a href={cvUrl} download className="cv-download-link">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                  <span>{t.hero.cvDownload}</span>
                </a>
                <button type="button" className="cv-modal-close" onClick={() => setVisible(false)} aria-label={t.hero.cvClose}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
            <iframe key={cvSrc} src={cvSrc} title={t.hero.cvModalTitle} className="cv-modal-frame" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CvModal;
