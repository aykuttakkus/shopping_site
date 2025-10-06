import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'zoom' | 'flash' | 'complete'>('initial');

  useEffect(() => {
    // Stage 1: Ring appears and glows (0-1.5s)
    const initialTimer = setTimeout(() => {
      setAnimationStage('zoom');
    }, 1500);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    // Stage 2: Zoom into diamond (1.5s-4s)
    if (animationStage === 'zoom') {
      const zoomTimer = setTimeout(() => {
        setAnimationStage('flash');
      }, 2500);

      return () => clearTimeout(zoomTimer);
    }
  }, [animationStage]);

  useEffect(() => {
    // Stage 3: White flash transition (4s-5s)
    if (animationStage === 'flash') {
      const flashTimer = setTimeout(() => {
        setAnimationStage('complete');
      }, 1000);

      return () => clearTimeout(flashTimer);
    }
  }, [animationStage]);

  useEffect(() => {
    // Stage 4: Complete and call onComplete
    if (animationStage === 'complete') {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 300);

      return () => clearTimeout(completeTimer);
    }
  }, [animationStage, onComplete]);

  // Ring image - using the luxury ring from Imgur
  const ringImageUrl = 'https://i.imgur.com/h4EM7Z1.jpeg';

  return (
    <AnimatePresence>
      {animationStage !== 'complete' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-50 bg-black overflow-hidden"
        >
          {/* Ring Image Container with Zoom Animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={
              animationStage === 'initial'
                ? { scale: 1, opacity: 1 }
                : animationStage === 'zoom'
                ? { scale: 3.5, opacity: 1 }
                : { scale: 5, opacity: 0 }
            }
            transition={
              animationStage === 'initial'
                ? { duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }
                : animationStage === 'zoom'
                ? { duration: 2.5, ease: [0.76, 0, 0.24, 1] }
                : { duration: 1, ease: 'easeIn' }
            }
          >
            {/* Ring Image */}
            <motion.img
              src={ringImageUrl}
              alt="Luxury Ring"
              className="w-auto h-screen object-contain select-none"
              draggable={false}
              animate={
                animationStage === 'zoom'
                  ? {
                      filter: [
                        'brightness(1) contrast(1)',
                        'brightness(1.2) contrast(1.1)',
                        'brightness(1.5) contrast(1.2)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2.5, ease: 'easeInOut' }}
            />

            {/* Subtle glow around ring */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 30%, transparent 60%)',
              }}
              animate={
                animationStage === 'initial'
                  ? {
                      opacity: [0, 0.8, 0.6],
                      scale: [0.8, 1.2, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.5, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Diamond Sparkle Effect */}
          {animationStage === 'zoom' && (
            <>
              {/* Radial white glow from diamond */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: [0, 0.6, 1], scale: [0, 1.5, 2] }}
                transition={{ duration: 2.5, ease: 'easeOut' }}
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 20%, rgba(255, 255, 255, 0.1) 40%, transparent 60%)',
                }}
              />

              {/* Sparkle rays */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 bg-white origin-left"
                  style={{
                    height: '200vh',
                    transform: `rotate(${i * 45}deg)`,
                  }}
                  initial={{ scaleY: 0, opacity: 0 }}
                  animate={{ scaleY: 1, opacity: [0, 0.8, 0.3] }}
                  transition={{
                    duration: 1.5,
                    delay: 0.5 + i * 0.1,
                    ease: 'easeOut',
                  }}
                />
              ))}

              {/* Pulsating light rings */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={`ring-${i}`}
                  className="absolute inset-0 rounded-full border-2 border-white pointer-events-none"
                  style={{
                    width: '100px',
                    height: '100px',
                    margin: 'auto',
                  }}
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{
                    scale: [1, 4, 6],
                    opacity: [0.8, 0.3, 0],
                  }}
                  transition={{
                    duration: 2,
                    delay: i * 0.4,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}

          {/* White Flash Transition */}
          {animationStage === 'flash' && (
            <motion.div
              className="absolute inset-0 bg-white pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1] }}
              transition={{ duration: 1, ease: 'easeIn' }}
            />
          )}

          {/* Subtle film grain texture for luxury feel */}
          <div
            className="absolute inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;