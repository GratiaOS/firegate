import React from 'react';
import { useRef, useEffect, useState } from 'react';
import { MessageBubble } from '@/components/MessageBubble';
import { SeedPortal } from '@/components/SeedPortal';
import { FieldCompanion } from '@/components/FieldCompanion';
import type { ChatMessage } from '@/features/Firegate/types';

interface MemoryPoolProps {
  messages: ChatMessage[];
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  handleSend: () => void;
  activeSuggestion: string | null;
  setActiveSuggestion: React.Dispatch<React.SetStateAction<string | null>>;
  activeLayer?: string;
}

const ParticleField = ({ layer }: { layer?: string }) => {
  const particlesRef = useRef(
    Array.from({ length: 20 }).map(() => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 10}s`,
      duration: `${8 + Math.random() * 4}s`,
      scale: `${0.5 + Math.random() * 1.5}`,
    }))
  );

  const getColor = (l: string | undefined) => {
    switch (l) {
      case '3D':
        return 'rgba(255, 255, 200, 0.6)';
      case '4D':
        return 'rgba(255, 100, 150, 0.5)';
      case '5D':
        return 'rgba(100, 200, 255, 0.5)';
      case '6D':
        return 'rgba(180, 100, 255, 0.6)';
      case '7D':
        return 'rgba(255, 255, 255, 0.9)';
      default:
        return 'rgba(255, 255, 255, 0.4)';
    }
  };

  const color = getColor(layer);

  return (
    <div className="particles">
      {particlesRef.current.map((particle, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: particle.left,
            top: particle.top,
            animationDelay: particle.delay,
            animationDuration: particle.duration,
            background: color,
            boxShadow: `0 0 6px ${color}`,
            transform: `scale(${particle.scale})`,
          }}
        />
      ))}
    </div>
  );
};

export const MemoryPool = ({
  messages,
  input,
  setInput,
  handleSend,
  activeSuggestion,
  setActiveSuggestion,
}: MemoryPoolProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const latestLayer = messages
    .slice()
    .reverse()
    .find((msg) => msg.role === 'nova' && msg.layer)?.layer;

  const [activeLayer, setActiveLayer] = useState<string>();
  const [prevLayer, setPrevLayer] = useState<string>();
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (!latestLayer || latestLayer === activeLayer) return;

    setFadingOut(false);

    const fadeOutTimer = setTimeout(() => {
      setPrevLayer(activeLayer);
      setFadingOut(true);
    }, 50); // small delay to allow DOM paint

    const switchLayerTimer = setTimeout(() => {
      setActiveLayer(latestLayer);
      setPrevLayer(undefined);
      setFadingOut(false);
    }, 2000); // match the CSS transition duration

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(switchLayerTimer);
    };
  }, [latestLayer, activeLayer]);

  return (
    <div className="memory-pool relative">
      {/* Previous Layer (fading out) */}
      {prevLayer && (
        <div>
          <div
            className={`ambient-canvas ambient-${prevLayer}`}
            style={{
              opacity: fadingOut ? 0 : 1,
              transition: 'opacity 2s ease',
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
            }}
          />
          <ParticleField layer={prevLayer} />
        </div>
      )}

      {/* Active Layer (only shows after previous fades out) */}
      {!prevLayer && activeLayer && (
        <div>
          <div
            className={`ambient-canvas ambient-${activeLayer}`}
            style={{
              opacity: 1,
              transition: 'opacity 2s ease',
              position: 'absolute',
              inset: 0,
              zIndex: 1,
              pointerEvents: 'none',
            }}
          />
          <ParticleField layer={activeLayer} />
        </div>
      )}

      {/* Message + Input Content */}
      <div className="memory-content relative z-10">
        <div className="memory-stream">
          {messages.map((msg, idx) => {
            const isThinking = msg.role === 'nova' && msg.content === '';

            return isThinking ? (
              <div key={idx} className="shimmer-wrapper px-4 py-2 flex">
                <div className="animate-pulse bg-slate-300/40 h-5 w-1/2 rounded-full shadow-sm transition-all duration-700" />
              </div>
            ) : (
              <div
                key={idx}
                className={`nova-bubble transition-opacity duration-700 ${msg.role === 'nova' ? 'opacity-0 animate-fade-in' : ''}`}
              >
                <MessageBubble
                  role={msg.role}
                  content={msg.content}
                  layer={msg.layer}
                  timestamp={msg.timestamp}
                  tags={msg.tags}
                  contactLevel={msg.contactLevel}
                  translated={msg.translated}
                  lang={msg.lang}
                  reason={msg.reason}
                />
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        <FieldCompanion />
      </div>

      <SeedPortal
        input={input}
        setInput={setInput}
        sendMessage={handleSend}
        activeSuggestion={activeSuggestion}
        setActiveSuggestion={setActiveSuggestion}
      />
    </div>
  );
};
