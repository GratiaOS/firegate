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
import { Toaster } from 'sonner';
import { OnlineStatusProvider } from './context/OnlineStatusContext';

// Layout for pages with header and main spacing
function Layout() {
  return (
    <>
      <Header />
      <main className="flex-1 pt-16">
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
          <div className="bg-gradient-to-b from-amber-100 via-orange-50 to-white absolute inset-0 -z-10" />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="manifesto" element={<Manifesto />} />
            <Route element={<Layout />}>
              <Route path="/firegate" element={<Firegate />} />
              <Route path="/aeolus" element={<Aeolus />} />
              <Route path="/translate-ui" element={<TranslateUI />} />
              <Route path="/codex" element={<Codex />} />
            </Route>
          </Routes>
          <Toaster position="top-right" />
        </div>
      </LangProvider>
    </OnlineStatusProvider>
  );
}

export default App;
