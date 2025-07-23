# Loading Screen Image Setup

## How to Add Your Custom Loading Image

1. **Prepare your image**:
   - Name it exactly: `ishuri image.jpg`
   - Recommended resolution: 1920x1080 or higher
   - Supported formats: JPG, PNG, WebP

2. **Place the image**:
   - Copy your image to: `public/assets/png/ishuri image.jpg`
   - Make sure the filename matches exactly (including the space)

3. **Image Guidelines**:
   - Use high-quality images for best results
   - The image will be displayed full-screen with an overlay
   - Consider images that work well with text overlay
   - School/education themed images work well with "Ishuri" (School) theme

## Fallback Behavior

If the image is not found or fails to load:
- A beautiful animated gradient background will be shown instead
- The loading screen will still function perfectly
- No error messages will be shown to users

## Current Features

- ✅ Smooth loading progress bar
- ✅ Bilingual text (English/Kinyarwanda)
- ✅ Responsive design for mobile and desktop
- ✅ Elegant animations and transitions
- ✅ Graceful fallback when image is missing

## Testing

1. Start the development server: `pnpm dev`
2. The loading screen will appear while game assets load
3. If your image is present, it will be displayed as background
4. If not, you'll see the gradient background instead