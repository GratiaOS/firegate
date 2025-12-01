import React from 'react';
import { useEffect, useRef, useState } from 'react';

export interface SeedPortalProps {
  input: string;
  setInput: (value: string) => void;
  sendMessage: () => void;
  activeSuggestion: string | null;
  setActiveSuggestion: React.Dispatch<React.SetStateAction<string | null>>;
}

const placeholderWhispers = [
  'Type when you feel called...',
  'What truth stirs in you today?',
  'Leave a seed for tomorrow’s garden.',
  'One breath, one thought...',
  'Speak like the field is listening.',
];

const novaSuggestions = [
  'Tell me what you’re not saying.',
  'If fear didn’t exist, what would you do?',
  'What are you secretly proud of?',
  'Describe a moment when you felt truly alive.',
  'What question won’t leave you alone lately?',
];

export const SeedPortal = ({ input, setInput, sendMessage }: SeedPortalProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [placeholder, setPlaceholder] = useState(placeholderWhispers[0]);
  const [showNudge, setShowNudge] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<string | null>(null);

  // Autogrow
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [input]);

  // Placeholder whisper rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholder((prev) => {
        const currentIndex = placeholderWhispers.indexOf(prev);
        const nextIndex = (currentIndex + 1) % placeholderWhispers.length;
        return placeholderWhispers[nextIndex];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Nudge for idle state
  useEffect(() => {
    if (input.trim()) {
      setShowNudge(false);
      return;
    }

    const timer = setTimeout(() => setShowNudge(true), 8000);
    return () => clearTimeout(timer);
  }, [input]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) sendMessage();
    }
  };

  const applyRandomPrompt = () => {
    const suggestion = novaSuggestions[Math.floor(Math.random() * novaSuggestions.length)];
    setActiveSuggestion(suggestion);
    textareaRef.current?.focus();
  };

  return (
    <div className="seed-portal w-full flex items-end gap-2 p-4 border-t border-white/10 backdrop-blur-md bg-white/5 rounded-t-xl relative">
      {activeSuggestion && (
        <div
          className={`nova-suggestion transition-opacity duration-500 bg-white/75 text-slate-500 absolute -top-5 left-6 right-6 italic pointer-events-none text-sm px-2 py-2 rounded-t-xl ${
            input.trim() ? 'opacity-0' : 'opacity-100'
          }`}
        >
          Try writing about → <strong>{activeSuggestion}</strong>
        </div>
      )}
      <textarea
        ref={textareaRef}
        placeholder={placeholder}
        value={input}
        maxLength={1500}
        onChange={(e) => {
          setInput(e.target.value);
          if (activeSuggestion && e.target.value.trim()) {
            setTimeout(() => setActiveSuggestion(null), 500);
          }
        }}
        onKeyDown={handleKeyDown}
        className="flex-grow resize-none rounded-xl px-4 py-3 text-sm bg-white/10 text-slate-800 placeholder:text-slate-400 border border-white/20 shadow-inner focus:outline-none focus:ring-2 focus:ring-sky-300 backdrop-blur-md transition-all"
        rows={1}
      />
      {showNudge && !activeSuggestion && (
        <div className="absolute bottom-full left-0 mb-2 text-xs text-slate-600/70 italic animate-fade-in transition-opacity duration-500">
          What’s on your heart today?
        </div>
      )}
      <button
        onClick={applyRandomPrompt}
        title="Feeling lucky?"
        className="px-3 py-2 bg-violet-400 hover:bg-violet-500 active:bg-violet-600 text-white text-sm rounded-lg shadow transition-all"
      >
        🎲
      </button>
      <button
        onClick={() => input.trim() && sendMessage()}
        className="px-4 py-2 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white text-sm rounded-lg shadow transition-all"
      >
        Send
      </button>
    </div>
  );
};
