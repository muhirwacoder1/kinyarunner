# 🚀 Deployment Guide - KinyaRunner

## Quick Deployment Steps

### **Step 1: Push to GitHub**

1. **Initialize Git** (if not already done):
   ```bash
   cd SUBWAY-SURFERS-master
   git init
   git add .
   git commit -m "Initial commit - KinyaRunner Subway Surfers Game"
   ```

2. **Connect to your GitHub repo**:
   ```bash
   git remote add origin https://github.com/muhirwacoder1/kinyarunner.git
   git branch -M main
   git push -u origin main
   ```

### **Step 2: Deploy to Vercel**

#### **Option A: Vercel CLI (Recommended)**
1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd SUBWAY-SURFERS-master
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project? **No**
   - Project name: **kinyarunner**
   - Directory: **./SUBWAY-SURFERS-master** (or just press Enter)
   - Want to override settings? **No**

#### **Option B: Vercel Dashboard**
1. Go to [vercel.com](https://vercel.com)
2. Click **"New Project"**
3. Import from **GitHub**
4. Select **muhirwacoder1/kinyarunner**
5. Configure:
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`
6. Click **"Deploy"**

### **Step 3: Add Game Assets (Optional)**

To get the full Subway Surfers look, add these images to `/public/assets/png/`:
- `pause.png` - Pause button icon
- `high-score.png` - Score trophy icon
- `coin.png` - Coin icon
- `ishuri image.jpg` - Loading background

### **Step 4: Custom Domain (Optional)**

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow DNS configuration instructions

## 🎮 **Game Features**

Your deployed game includes:
- ✅ **Mobile & Desktop Controls** (swipe/arrow keys)
- ✅ **Subway Surfers-Style Dashboard**
- ✅ **Pause/Resume Functionality**
- ✅ **Bilingual Support** (English/Kinyarwanda)
- ✅ **Professional Loading Screen**
- ✅ **Responsive Design**
- ✅ **Score & Coins System**

## 🔧 **Troubleshooting**

### **Build Issues**
If build fails, try:
```bash
pnpm install
pnpm build
```

### **Asset Loading Issues**
- Ensure all image paths start with `/assets/`
- Check file names match exactly (case-sensitive)
- Verify images are in `/public/assets/png/`

### **Performance Issues**
- Game automatically pauses when tab is inactive
- Mobile optimized with touch controls
- Efficient 3D rendering with Three.js

## 🌐 **Expected URLs**

After deployment, your game will be available at:
- **Vercel URL**: `https://kinyarunner.vercel.app`
- **Custom Domain**: (if configured)

## 📱 **Mobile Testing**

Test on mobile devices:
- Swipe controls work properly
- UI scales correctly
- Performance is smooth
- Touch targets are accessible

## 🎯 **Next Steps**

1. **Share your game** with friends and family
2. **Add custom assets** for full branding
3. **Monitor performance** in Vercel analytics
4. **Collect feedback** and iterate

Your KinyaRunner game is ready to play! 🎮