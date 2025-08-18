import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import About from './pages/About.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

function Router() {
  const path = window.location.pathname;
  return path === '/over' ? <About /> : <App />;
}

createRoot(rootElement).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
