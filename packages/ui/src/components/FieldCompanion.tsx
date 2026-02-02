import { useEffect, useState } from 'react';

const activeWhispers = [
  'Breathe first.',
  'You are not behind.',
  'Everything is unfolding.',
  'One truth at a time.',
  'Let memory find you.',
  'Nothing is missing.',
];

const idleWhispers = [
  'It’s okay to sit quietly.',
  'Silence is its own language.',
  'The field is listening.',
  'Rest is part of remembering.',
  'No hurry, no worry.',
  'Stillness plants deeper roots.',
];

export const FieldCompanion = () => {
  const [currentWhisper, setCurrentWhisper] = useState(activeWhispers[0]);
  const [isIdle, setIsIdle] = useState(false);
  const isBreatheFirst = currentWhisper === activeWhispers[0];

  useEffect(() => {
    let idleTimer: ReturnType<typeof setTimeout>;

    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 60000); // 60 seconds idle threshold
    };

    // Listen for user actions
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);

    // Initial setup
    resetIdleTimer();

    return () => {
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      clearTimeout(idleTimer);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const library = isIdle ? idleWhispers : activeWhispers;

      setCurrentWhisper((prev) => {
        const currentIndex = library.indexOf(prev);
        const nextIndex = (currentIndex + 1) % library.length;
        return library[nextIndex] || library[0];
      });
    }, 8000); // slow rotation still

    return () => clearInterval(interval);
  }, [isIdle]);

  return (
    <div className="field-companion text-white/70 bg-white/10">
      <p
        className={`field-companion__whisper${
          isBreatheFirst ? ' field-companion__whisper--breathe' : ''
        }`}
      >
        {currentWhisper}
      </p>
    </div>
  );
};
