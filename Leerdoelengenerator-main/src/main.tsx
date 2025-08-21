import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import HomePage from './pages/index.tsx';
import About from './pages/About.tsx';
import Glossary from './pages/Glossary.tsx';
import Layout from './components/Layout.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

function Router() {
  const path = window.location.pathname;
  const Page = path === '/over' ? About : path === '/begrippen' ? Glossary : HomePage;
  return (
    <Layout>
      <Page />
    </Layout>
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <Router />
  </StrictMode>
);
