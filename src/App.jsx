
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/toaster';
import { Helmet } from 'react-helmet';

const INTRO_MESSAGES = [
  "Hey my love...",
  "On this special day...",
  "I wanted to remind you of a few things.",
  "You are the most beautiful person I know, inside and out.",
  "Your smile lights up my entire world.",
  "You're not just a year older, but a year more incredible.",
  "Get ready for your surprise...",
];

const OUTRO_MESSAGES = [
  "I hope that made you smile.",
  "You deserve all the happiness in the universe.",
  "Every moment with you is a treasure.",
  "Happy 18th Birthday, my amazing girlfriend!",
];

const FINAL_QUOTE = "Thank you for being in my life and making it a beautiful adventure.";

const TOTAL_TAPS = 18;

const ConfettiPiece = ({ x, delay, color }) => (
  <motion.div
    className="absolute w-3 h-3 rounded-full"
    style={{ left: `${x}%`, backgroundColor: color }}
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: '100vh', opacity: [1, 1, 0] }}
    transition={{ duration: Math.random() * 3 + 2, delay, ease: 'linear' }}
  />
);

const Balloon = ({ x, delay, color }) => (
  <motion.div
    className="absolute bottom-[-100px] flex flex-col items-center"
    style={{ left: `${x}%` }}
    initial={{ y: 0 }}
    animate={{ y: '-120vh' }}
    transition={{ duration: Math.random() * 5 + 8, delay, ease: 'linear' }}
  >
    <div
      className="w-16 h-20 rounded-full"
      style={{
        background: `radial-gradient(circle at 50% 120%, ${color}b3, ${color}ff 80%)`,
      }}
    />
    <div className="w-1 h-8 bg-white/70" />
  </motion.div>
);

function App() {
  const [phase, setPhase] = useState('intro');
  const [messageIndex, setMessageIndex] = useState(0);
  const [cakeTaps, setCakeTaps] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [balloons, setBalloons] = useState([]);

  const resetState = useCallback(() => {
    setPhase('intro');
    setMessageIndex(0);
    setCakeTaps(0);
    setConfetti([]);
    setBalloons([]);
  }, []);

  useEffect(() => {
    let timer;

    if (phase === 'intro' && messageIndex < INTRO_MESSAGES.length) {
      timer = setTimeout(() => {
        setMessageIndex(prev => prev + 1);
      }, 3000);
    } else if (phase === 'intro' && messageIndex >= INTRO_MESSAGES.length) {
      setPhase('balloons');
    } else if (phase === 'balloons') {
      if (balloons.length === 0) {
        const newBalloons = Array.from({ length: 15 }, (_, i) => ({
          id: i,
          x: Math.random() * 90,
          delay: Math.random() * 2,
          color: ['#fecdd3', '#e9d5ff', '#c7d2fe', '#fef08a'][i % 4],
        }));
        setBalloons(newBalloons);
      }
      timer = setTimeout(() => {
        setPhase('cake');
      }, 5000);
    } else if (phase === 'celebration') {
      if (confetti.length === 0) {
        const newConfetti = Array.from({ length: 100 }, (_, i) => ({
          id: i,
          x: Math.random() * 100,
          delay: Math.random() * 2,
          color: ['#fecdd3', '#e9d5ff', '#c7d2fe', '#fde047', '#6ee7b7'][i % 5],
        }));
        setConfetti(newConfetti);
      }
      timer = setTimeout(() => {
        setPhase('outro');
        setMessageIndex(0);
      }, 5000);
    } else if (phase === 'outro' && messageIndex < OUTRO_MESSAGES.length) {
      timer = setTimeout(() => {
        setMessageIndex(prev => prev + 1);
      }, 3000);
    } else if (phase === 'outro' && messageIndex >= OUTRO_MESSAGES.length) {
      setPhase('final');
    }

    return () => clearTimeout(timer);
  }, [phase, messageIndex, balloons, confetti]);

  const handleCakeTap = () => {
    if (cakeTaps < TOTAL_TAPS - 1) {
      setCakeTaps(prev => prev + 1);
    } else {
      setCakeTaps(TOTAL_TAPS);
      setPhase('celebration');
    }
  };

  return (
    <>
      <Helmet>
        <title>Happy 18th Birthday!</title>
        <meta name="description" content="A very special birthday celebration for a very special person." />
      </Helmet>
      <main className="font-sans min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-rose-100 via-fuchsia-100 to-indigo-200 overflow-hidden relative p-4">
        
        {(phase === 'balloons' || phase === 'cake') && (
           <div className="absolute inset-0 overflow-hidden">
            {balloons.map((b) => (
              <Balloon
                key={b.id}
                {...b}
              />
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {phase === 'intro' && messageIndex < INTRO_MESSAGES.length && (
            <motion.h1
              key={`intro-${messageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-4xl md:text-5xl font-bold text-slate-800 text-center"
            >
              {INTRO_MESSAGES[messageIndex]}
            </motion.h1>
          )}

          {phase === 'balloons' && (
            <motion.div
              key="balloons_text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="z-10"
            >
              <h2 className="text-3xl font-bold text-slate-800 text-center">Here comes a surprise...</h2>
            </motion.div>
          )}

          {phase === 'cake' && (
            <motion.div
              key="cake"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.5 }}
              className="text-center flex flex-col items-center z-10"
            >
              <h2 className="text-3xl font-bold text-slate-800 mb-4">A special cake for you!</h2>
              <p className="text-xl text-slate-600 mb-8">Tap the cake {TOTAL_TAPS} times to make a wish!</p>
              <motion.div
                className="relative cursor-pointer"
                onClick={handleCakeTap}
                whileTap={{ scale: 0.95 }}
              >
                <img  alt="A beautiful and aesthetic birthday cake with candles" className="w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-2xl" src="https://images.unsplash.com/photo-1606983340126-81ab4d91651c" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-5xl font-extrabold text-white" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
                    {TOTAL_TAPS - cakeTaps > 0 ? TOTAL_TAPS - cakeTaps : ''}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          )}

          {phase === 'celebration' && (
            <motion.div
              key="celebration"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-orange-400">
                Happy 18th Birthday!
              </h1>
              <div className="absolute inset-0 overflow-hidden">
                {confetti.map(c => <ConfettiPiece key={c.id} {...c} />)}
              </div>
            </motion.div>
          )}

          {phase === 'outro' && messageIndex < OUTRO_MESSAGES.length && (
            <motion.h1
              key={`outro-${messageIndex}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
              className="text-4xl md:text-5xl font-bold text-slate-800 text-center"
            >
              {OUTRO_MESSAGES[messageIndex]}
            </motion.h1>
          )}

          {phase === 'final' && (
            <motion.div
              key="final"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center flex flex-col items-center gap-8"
            >
              <h2 className="text-3xl font-semibold text-slate-700">{FINAL_QUOTE}</h2>
              <Button
                onClick={resetState}
                className="bg-gradient-to-r from-pink-400 to-purple-500 hover:from-pink-500 hover:to-purple-600 text-white font-bold py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Replay
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </main>
    </>
  );
}

export default App;
