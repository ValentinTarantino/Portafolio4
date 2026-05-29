import { motion } from 'framer-motion';
import './Testimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: 'Claudia D\'Abundo',
    role: {
      es: 'Administración Consorcios',
      en: 'Property Management'
    },
    project: {
      es: 'Consorcios Landing Page',
      en: 'Property Management Landing Page'
    },
    projectUrl: 'https://administracionclaudia.com/',
    text: {
      es: 'Valentín me hizo la página web para mis consorcios y quedó exactamente como la imaginaba. Muy profesional, rápido y siempre atento a los detalles. Lo recomiendo totalmente.',
      en: 'Valentín built the website for my business and it turned out exactly as I imagined. Very professional, fast, and always attentive to details. I fully recommend him.'
    }
  },
  {
    id: 2,
    name: 'Lucas Caudana',
    role: {
      es: 'Periodista Deportivo',
      en: 'Sports Journalist'
    },
    project: {
      es: 'Blog Personal',
      en: 'Personal Blog'
    },
    projectUrl: 'https://lucas-caudana-blog.vercel.app/',
    text: {
      es: 'Necesitaba un blog personal para mis notas y Valentín me armó algo mucho mejor de lo que esperaba. Súper fácil para actualizar contenido por mi cuenta. Muy contento con el resultado.',
      en: 'I needed a personal blog to share my notes and Valentín built something much better than I expected. Super easy to update content on my own. Very happy with the result.'
    }
  },
  {
    id: 3,
    name: 'Juan Ramirez',
    role: {
      es: 'Cliente particular',
      en: 'Private Client'
    },
    project: {
      es: 'ChromaFlow',
      en: 'ChromaFlow'
    },
    projectUrl: 'https://chorma-flow.vercel.app',
    text: {
      es: 'Valentín me ayudó con un proyecto personal y la verdad que fue una experiencia excelente. Muy paciente, explicó todo claramente y el resultado final fue mejor de lo que pedí.',
      en: 'Valentín helped me with a personal project and it was an excellent experience. Very patient, explained everything clearly, and the final result was better than what I asked for.'
    }
  }
];

const Testimonials = ({ t, language }) => {
  return (
    <section id="testimonials" className="section testimonials">
      <div className="container">
        <h2 className="section-title">{t.testimonials?.title || 'Testimonios'}</h2>

        <div className="testimonials-grid">
          {testimonialsData.map((item) => (
            <div key={item.id} className="testimonial-card glass-card">
              <div className="testimonial-header">
                <div className="testimonial-meta">
                  <h3 className="testimonial-name">{item.name}</h3>
                  <p className="testimonial-role">{item.role[language] || item.role.es}</p>
                </div>
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="quote-icon">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" fill="currentColor" />
                </svg>
              </div>
              <blockquote className="testimonial-text">
                "{item.text[language] || item.text.es}"
              </blockquote>
              <div className="testimonial-footer">
                <a
                  href={item.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="testimonial-project-link"
                >
                  <span>{item.project[language] || item.project.es}</span>
                  <span className="arrow">↗</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
