import React from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import { LangProvider } from '@shared/LangContext';
import Header from './components/Header';
import Home from '@features/Home';
import Firegate from '@features/Firegate';
import Aeolus from '@features/Aeolus';
import TranslateUI from '@features/TranslateUI';
import Manifesto from '@features/Manifesto';
import Codex from '@features/Codex';
import Scenes from '@features/Scenes';
import Ledger from '@features/Ledger';
import { Toaster } from 'sonner';
import { OnlineStatusProvider } from './context/OnlineStatusContext';
import CaminoViewer from '@/features/Camino';

// Layout for pages with header and main spacing
function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
    </>
  );
}

function App() {
  return (
    <OnlineStatusProvider>
      <LangProvider>
        <div className="flex flex-col h-screen relative">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="manifesto" element={<Manifesto />} />
            <Route path="/camino" element={<CaminoViewer />} />
            <Route element={<Layout />}>
            <Route path="/firegate" element={<Firegate />} />
            <Route path="/aeolus" element={<Aeolus />} />
            <Route path="/translate-ui" element={<TranslateUI />} />
            <Route path="/codex" element={<Codex />} />
            <Route path="/scenes" element={<Scenes />} />
            <Route path="/ledger" element={<Ledger />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </div>
    </LangProvider>
    </OnlineStatusProvider>
  );
}

export default App;
