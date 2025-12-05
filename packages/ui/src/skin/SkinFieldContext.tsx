import React, { createContext, useContext, useEffect, useState } from 'react';

export type KernelSkinId = 'SUN' | 'MOON' | 'GARDEN' | 'STELLAR' | 'OFF';

type SkinFieldContextValue = {
  skinId: KernelSkinId;
  setSkinId: (id: KernelSkinId) => void;
};

const SkinFieldContext = createContext<SkinFieldContextValue | null>(null);

export const useSkinField = (): SkinFieldContextValue => {
  const ctx = useContext(SkinFieldContext);
  if (!ctx) {
    throw new Error('useSkinField must be used within SkinFieldProvider');
  }
  return ctx;
};

const STORAGE_KEY = 'gratia.skinId';

export const SkinFieldProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [skinId, setSkinIdState] = useState<KernelSkinId>('MOON');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY) as KernelSkinId | null;
    if (stored) {
      setSkinIdState(stored);
      document.documentElement.dataset.skinId = stored;
    }
  }, []);

  const setSkinId = (id: KernelSkinId) => {
    setSkinIdState(id);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, id);
      document.documentElement.dataset.skinId = id;
    }
  };

  useEffect(() => {
    document.documentElement.dataset.skinId = skinId;
  }, [skinId]);

  return <SkinFieldContext.Provider value={{ skinId, setSkinId }}>{children}</SkinFieldContext.Provider>;
};
