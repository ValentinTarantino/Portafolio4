import { useEffect, useState } from 'react';

// CV preview modal — no animation libraries: enter/exit run on pure CSS
// with the same spring-like feel, keeping it out of the initial bundle.
const CvModal = ({ t, cvUrl, cvSrc, onClose }) => {
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') setClosing(true);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  const handleAnimationEnd = () => {
    if (closing) onClose();
  };

  return (
    <div className="cv-modal-overlay" onClick={() => setClosing(true)}>
      <div
        className={`cv-modal-content glass-card${closing ? ' cv-modal-exit' : ' cv-modal-enter'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
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
            <button type="button" className="cv-modal-close" onClick={() => setClosing(true)} aria-label={t.hero.cvClose}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <iframe key={cvSrc} src={cvSrc} title={t.hero.cvModalTitle} className="cv-modal-frame" />
      </div>
    </div>
  );
};

export default CvModal;
