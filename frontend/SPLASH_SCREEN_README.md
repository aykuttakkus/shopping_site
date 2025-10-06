# Renart Luxury Ring Splash Screen

A stunning, cinematic splash screen featuring a real luxury ring image that zooms into the sparkling diamond with a white flash transition.

## Features

💍 **Real Ring Image Animation**
- Uses actual luxury ring photograph
- Black background (#000000) for maximum impact
- High-resolution image support
- Professional product photography showcase

🎬 **Cinematic Zoom Effect**
- Ring appears with elegant fade-in (0-1.5s)
- Smooth zoom into diamond center (1.5s-4s)
- Progressive scale from 0.5x → 1x → 3.5x → 5x
- Focus shifts to sparkling diamond

💎 **Diamond Sparkle Effects**
- Radial white glow emanating from diamond
- 8 animated sparkle rays at 45° intervals
- Pulsating light rings expanding outward
- Progressive brightness & contrast enhancement

⚡ **White Flash Transition**
- Crescendo white flash at animation peak (4s-5s)
- Smooth transition to main website
- Total duration: ~5.3 seconds
- Seamless fade-out to content

🎨 **Luxury Visual Details**
- Subtle film grain texture overlay
- Professional color grading
- GPU-accelerated transformations
- Sleek, minimalistic, high-end aesthetic

## Technologies Used

- **React** - Component framework
- **TypeScript** - Type safety
- **TailwindCSS** - Styling and utilities
- **Framer Motion** - Animation library

## Component Structure

### SplashScreen.tsx

```typescript
interface SplashScreenProps {
  onComplete: () => void;
}
```

**Props:**
- `onComplete`: Callback function called after splash screen animation completes

**Animation Timeline:**

### Stage 1: Initial Appearance (0s - 1.5s)
1. **0s - 1.5s**: Ring image fades in from scale 0.5x to 1x
2. **0s - 1.5s**: Subtle radial glow appears around ring
3. **Easing**: Cubic bezier (0.43, 0.13, 0.23, 0.96) for elegant entrance

### Stage 2: Zoom into Diamond (1.5s - 4s)
1. **1.5s - 4s**: Ring scales from 1x to 3.5x, focusing on diamond
2. **1.5s - 4s**: Brightness increases (1 → 1.2 → 1.5)
3. **1.5s - 4s**: Contrast increases (1 → 1.1 → 1.2)
4. **2s - 4s**: Radial white glow emanates from center
5. **2.5s - 4s**: 8 sparkle rays animate outward (staggered)
6. **2s - 4s**: 3 expanding light rings pulse from center
7. **Easing**: Cubic bezier (0.76, 0, 0.24, 1) for smooth acceleration

### Stage 3: White Flash (4s - 5s)
1. **4s - 5s**: Ring continues scaling to 5x while fading out
2. **4s - 5s**: White flash overlay fades in (opacity 0 → 1)
3. **Easing**: Ease-in for dramatic culmination

### Stage 4: Transition Out (5s - 5.3s)
1. **5s - 5.3s**: Complete fade-out (0.3s duration)
2. **5.3s**: `onComplete` callback triggers, revealing website

## Usage

### Basic Implementation

```tsx
import React, { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import YourMainContent from './components/YourMainContent';

function App() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashComplete = () => {
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      {!showSplash && <YourMainContent />}
    </>
  );
}
```

### With Conditional Rendering

```tsx
function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <>
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      <div className={showSplash ? 'hidden' : 'block'}>
        <YourMainContent />
      </div>
    </>
  );
}
```

### With LocalStorage (Show once per session)

```tsx
function App() {
  const [showSplash, setShowSplash] = useState(
    !sessionStorage.getItem('splashShown')
  );

  const handleSplashComplete = () => {
    sessionStorage.setItem('splashShown', 'true');
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      <YourMainContent />
    </>
  );
}
```

## Setup Instructions

### Adding Your Ring Image

1. **Prepare your image:**
   - High-resolution ring photo (recommended: 2000x2000px or higher)
   - Black background (#000000)
   - Ring centered in frame
   - Diamond clearly visible
   - File format: JPG or PNG

2. **Add to project:**
   ```bash
   # Save your image as ring-splash.jpg
   # Place it in: /frontend/public/ring-splash.jpg
   ```

3. **Verify the path:**
   - File should be at: `frontend/public/ring-splash.jpg`
   - Will be served as: `http://localhost:3000/ring-splash.jpg`

4. **Restart dev server:**
   ```bash
   cd frontend
   npm start
   ```

See `frontend/public/HOW_TO_ADD_RING_IMAGE.md` for detailed instructions.

## Customization

### Timing Adjustments

Modify the stage transitions in `SplashScreen.tsx`:

```typescript
// Stage 1: Initial appearance (default: 1500ms)
const initialTimer = setTimeout(() => {
  setAnimationStage('zoom');
}, 1500); // Adjust this value

// Stage 2: Zoom duration (default: 2500ms)
const zoomTimer = setTimeout(() => {
  setAnimationStage('flash');
}, 2500); // Adjust this value

// Stage 3: Flash duration (default: 1000ms)
const flashTimer = setTimeout(() => {
  setAnimationStage('complete');
}, 1000); // Adjust this value
```

### Animation Speed

Adjust scale and zoom speed:

```typescript
// Zoom effect - change target scale
animationStage === 'zoom'
  ? { scale: 3.5, opacity: 1 }  // Change 3.5 to desired zoom level
  : { scale: 5, opacity: 0 }    // Change 5 for final zoom

// Zoom duration
transition: { duration: 2.5, ... }  // Adjust duration
```

### Sparkle Effect

Customize the number of sparkle rays:

```typescript
// Change number of rays (default: 8)
{[...Array(8)].map((_, i) => (  // Change 8 to desired number
  <motion.div
    style={{ transform: `rotate(${i * 45}deg)` }} // Angle: 360/n
    // ...
  />
))}
```

### Image Filters

Adjust brightness and contrast during zoom:

```typescript
animate={{
  filter: [
    'brightness(1) contrast(1)',      // Start
    'brightness(1.2) contrast(1.1)',  // Middle
    'brightness(1.5) contrast(1.2)',  // End
  ],
}}
// Increase values for more dramatic effect
```

## Performance Considerations

- Uses CSS transforms and opacity for GPU-accelerated animations
- SVG path animations are optimized with Framer Motion
- Component unmounts after completion to free up resources
- No unnecessary re-renders during animation

## Browser Compatibility

- Modern browsers with CSS3 support
- Requires JavaScript enabled
- SVG filter support required for glow effects
- Backdrop-filter support recommended for best results

## Accessibility

The splash screen:
- Covers the full screen (z-index: 50)
- Automatically dismisses after animation
- Provides smooth transition to main content
- Can be skipped by implementing a "Skip" button if needed

## License

Part of the Renart e-commerce project.
