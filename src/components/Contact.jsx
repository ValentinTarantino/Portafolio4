
import './Contact.css';

const Contact = ({ t }) => {
  return (
    <section id="contact" className="section contact">
      <div className="container">
        <h2 className="section-title">{t.contact.title}</h2>
        <p className="section-subtitle">{t.contact.subtitle}</p>
        
        <div className="contact-content">
          <div className="contact-info fade-in-left">
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>Email</h3>
                <p>{t.contact.info.email}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 16.92V19.92C22 20.4728 21.5523 20.9167 21 20.92C18.4 20.97 15.94 20.06 13.71 18.35C11.61 16.78 9.78 14.95 8.21 12.85C6.5 10.62 5.59 8.16 5.64 5.56C5.64277 5.00732 6.08668 4.56341 6.64 4.56H9.64C10.1928 4.56 10.64 5.00732 10.64 5.56C10.64 6.6 10.89 7.61 11.36 8.52C11.4706 8.77754 11.4516 9.07071 11.31 9.31L9.83 11.31C10.8 13.33 12.67 15.2 14.69 16.17L16.69 14.69C16.9294 14.5484 17.2226 14.5294 17.48 14.64C18.39 15.11 19.4 15.36 20.44 15.36C20.9928 15.36 21.44 15.8073 21.44 16.36V19.36C21.44 19.9128 20.9928 20.36 20.44 20.36Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{t.contact.labels.phone}</h3>
                <p>{t.contact.info.phone}</p>
              </div>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.3639 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="contact-details">
                <h3>{t.contact.labels.location}</h3>
                <p>{t.contact.info.location}</p>
              </div>
            </div>
            
            <div className="social-links">
              <a href="https://www.linkedin.com/in/valent%C3%ADn-tarantino/" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" fill="currentColor"/>
                  <rect x="2" y="9" width="4" height="12" fill="currentColor"/>
                  <circle cx="4" cy="4" r="2" fill="currentColor"/>
                </svg>
              </a>
              <a href="https://github.com/ValentinTarantino" target="_blank" rel="noopener noreferrer" className="social-link">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" fill="currentColor"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
