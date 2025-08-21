import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/index.tsx';
import About from './pages/About.tsx';
import Layout from './components/Layout.tsx';
import RouteTracker from './components/RouteTracker.tsx';
import './index.css';

const rootElement = document.getElementById('root')!;

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      <RouteTracker />
      <Routes>
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/over" element={<Layout><About /></Layout>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
