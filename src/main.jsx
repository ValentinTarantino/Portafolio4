
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './persona-menu.css'
import './persona-interactions.css'
import './persona-cards.css'

if ('scrollRestoration' in window.history) {
  window.history.scrollRestoration = 'manual';
}

if (window.location.hash) {
  window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
}

window.scrollTo({ top: 0, left: 0, behavior: 'instant' });

createRoot(document.getElementById("root")).render(<App />);
