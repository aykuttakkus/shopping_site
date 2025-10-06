import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [animationStage, setAnimationStage] = useState<'initial' | 'zoom' | 'flash' | 'complete'>('initial');

  useEffect(() => {
    // Stage 1: Ring appears (0-1.2s)
    const initialTimer = setTimeout(() => {
      setAnimationStage('zoom');
    }, 1200);

    return () => clearTimeout(initialTimer);
  }, []);

  useEffect(() => {
    // Stage 2: Zoom into diamond (1.2s-3.5s)
    if (animationStage === 'zoom') {
      const zoomTimer = setTimeout(() => {
        setAnimationStage('flash');
      }, 2300);

      return () => clearTimeout(zoomTimer);
    }
  }, [animationStage]);

  useEffect(() => {
    // Stage 3: White flash transition (3.5s-4.2s)
    if (animationStage === 'flash') {
      const flashTimer = setTimeout(() => {
        setAnimationStage('complete');
      }, 700);

      return () => clearTimeout(flashTimer);
    }
  }, [animationStage]);

  useEffect(() => {
    // Stage 4: Complete and call onComplete
    if (animationStage === 'complete') {
      const completeTimer = setTimeout(() => {
        onComplete();
      }, 200);

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
          className="fixed inset-0 z-50 overflow-hidden"
          style={{ backgroundColor: '#000000' }}
        >
          {/* Ring Image Container with Zoom Animation */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={
              animationStage === 'initial'
                ? { scale: 1, opacity: 1 }
                : animationStage === 'zoom'
                ? { scale: 3.2, opacity: 1 }
                : { scale: 4.5, opacity: 0 }
            }
            transition={
              animationStage === 'initial'
                ? { duration: 1.2, ease: [0.22, 1, 0.36, 1] }
                : animationStage === 'zoom'
                ? { duration: 2.3, ease: [0.65, 0, 0.35, 1] }
                : { duration: 0.7, ease: 'easeIn' }
            }
          >
            {/* Ring Image */}
            <motion.img
              src={ringImageUrl}
              alt="Luxury Ring"
              className="w-auto h-screen object-contain select-none"
              draggable={false}
              style={{ 
                willChange: 'transform, filter',
                backfaceVisibility: 'hidden',
                transform: 'translateZ(0)'
              }}
              animate={
                animationStage === 'zoom'
                  ? {
                      filter: [
                        'brightness(1) contrast(1)',
                        'brightness(1.15) contrast(1.05)',
                        'brightness(1.3) contrast(1.1)',
                      ],
                    }
                  : {}
              }
              transition={{ duration: 2.3, ease: 'linear' }}
            />

            {/* Elegant glow around ring */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.08) 25%, transparent 50%)',
                willChange: 'opacity, transform'
              }}
              animate={
                animationStage === 'initial'
                  ? {
                      opacity: [0, 0.7, 0.5],
                      scale: [0.9, 1.1, 1],
                    }
                  : {}
              }
              transition={{ duration: 1.2, ease: 'easeOut' }}
            />
          </motion.div>

          {/* Diamond Sparkle Effect */}
          {animationStage === 'zoom' && (
            <>
              {/* Strong radial glow from center */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ 
                  opacity: [0, 1, 1],
                  scale: [0.3, 2, 3.5]
                }}
                transition={{ duration: 2.3, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  background:
                    'radial-gradient(circle at center, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.8) 5%, rgba(255, 255, 255, 0.5) 15%, rgba(255, 255, 255, 0.2) 30%, transparent 50%)',
                  willChange: 'opacity, transform'
                }}
              />

              {/* Elegant light rays - evenly distributed in all directions */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
                <motion.div
                  key={`elegant-ray-${i}`}
                  className="absolute pointer-events-none"
                  style={{
                    top: '50%',
                    left: '50%',
                    width: '150vh',
                    height: '1.5px',
                    background: `linear-gradient(to right, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 25%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.05) 75%, transparent 100%)`,
                    transform: `translate(0, -50%) rotate(${angle}deg)`,
                    transformOrigin: '0 50%',
                    boxShadow: '0 0 10px rgba(255, 255, 255, 0.3), 0 0 20px rgba(255, 255, 255, 0.15)',
                    willChange: 'opacity, transform'
                  }}
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ 
                    opacity: [0, 0.6, 0.8, 0.7],
                    scaleX: [0, 0.4, 0.8, 1]
                  }}
                  transition={{
                    duration: 2.5,
                    delay: 0.5 + i * 0.08,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                />
              ))}

              {/* Center explosion - bright white burst */}
              <motion.div
                className="absolute top-1/2 left-1/2 pointer-events-none"
                style={{
                  width: '400px',
                  height: '400px',
                  marginLeft: '-200px',
                  marginTop: '-200px',
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 0.9) 10%, rgba(255, 255, 255, 0.6) 30%, transparent 70%)',
                  filter: 'blur(20px)',
                  willChange: 'opacity, transform'
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ 
                  opacity: [0, 1, 1, 0.8],
                  scale: [0, 1, 2, 4]
                }}
                transition={{
                  duration: 2.3,
                  ease: [0.22, 1, 0.36, 1],
                }}
              />
            </>
          )}

          {/* White Flash Transition */}
          {animationStage === 'flash' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{ 
                backgroundColor: '#ffffff',
                willChange: 'opacity'
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.95] }}
              transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            />
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;