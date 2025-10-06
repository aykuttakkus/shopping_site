# How to Add the Ring Image

To use your custom ring image for the splash screen:

## Step 1: Prepare Your Image

- Use a high-resolution image (recommended: 2000x2000px or higher)
- Image should show a luxury ring on a black background
- File format: JPG or PNG
- Recommended file size: < 500KB (optimize for web)

## Step 2: Add to Project

1. Save your ring image as `ring-splash.jpg` (or `ring-splash.png`)
2. Place it in the `/frontend/public/` folder
3. The file path should be: `/frontend/public/ring-splash.jpg`

## Step 3: Update Component (if needed)

If you use a PNG instead of JPG, update the `SplashScreen.tsx` file:

```typescript
const ringImageUrl = '/ring-splash.png'; // Change extension if needed
```

## Current Setup

The splash screen is currently configured to look for:
- File: `/frontend/public/ring-splash.jpg`
- This file will be served as: `http://localhost:3000/ring-splash.jpg`

## Image Optimization Tips

For best performance:
- Compress the image using tools like TinyPNG or ImageOptim
- Use modern formats like WebP if browser support is not a concern
- Ensure the ring is centered and clearly visible
- Black background should be pure black (#000000)

## Testing

After adding the image:
1. Restart the development server
2. Clear browser cache
3. Reload the page to see the splash screen with your ring image
