import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/index';
import About from '@/pages/About';
import GlossaryPage from '@/pages/begrippen';
import Layout from '@/components/Layout';
import RouteTracker from '@/components/RouteTracker';
import CookieBanner from '@/components/CookieBanner';
import './index.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/begrippen" element={<Layout><GlossaryPage /></Layout>} />
        <Route path="/over" element={<Layout><About /></Layout>} />
      </Routes>
      <CookieBanner />
    </BrowserRouter>
  </StrictMode>
);
