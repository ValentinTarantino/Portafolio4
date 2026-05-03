
import './Footer.css';

const Footer = ({ t }) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-text">
            <p>{t.footer.text}</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
