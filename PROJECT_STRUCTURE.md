# ResizeMe Landing Page - Project Structure

## 📁 Directory Layout

```
resumeme/web/
├── app/
│   ├── layout.tsx           # Root layout with metadata
│   ├── page.tsx             # Main landing page (all sections)
│   └── globals.css          # Global styles & animations
│
├── public/                  # Static assets (images, icons, etc.)
├── node_modules/            # Dependencies (created after npm install)
│
├── package.json             # Dependencies & scripts
├── next.config.js           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
├── tailwind.config.js       # Tailwind CSS configuration
├── postcss.config.js        # PostCSS configuration
├── .gitignore               # Git ignore rules
│
├── README.md                # Quick start guide
└── PROJECT_STRUCTURE.md     # This file

```

## 📄 File Descriptions

### Core Files

**app/layout.tsx**
- Root React component wrapping the entire app
- Sets up metadata for SEO (title, description, OG tags)
- Applies dark mode background styles
- Configures HTML lang and viewport

**app/page.tsx**
- Main landing page (21,660 bytes)
- Contains 8 major sections:
  1. **HeroSection** - Headline, subheadline, dual CTAs
  2. **ValuePropsSection** - 3 value propositions with icons
  3. **HowItWorksSection** - 3-step process with visual flow
  4. **PricingSection** - Free/Pro/Premium pricing table
  5. **TestimonialsSection** - 3 testimonials with ratings
  6. **FAQSection** - 6 FAQs with expandable accordion
  7. **FinalCTASection** - Final call-to-action
  8. **Footer** - Links, company info, social
- Uses Framer Motion for animations
- All components are self-contained (`'use client'` directive)

**app/globals.css**
- Tailwind directives (@tailwind)
- Custom CSS classes (.gradient-bg, .glow-effect, etc.)
- Animation definitions (@keyframes)
- Scrollbar styling
- Selection and scrolling behavior

### Configuration Files

**tailwind.config.js**
- Color customization (purple primary, cyan secondary)
- Custom animations (gradient, fadeIn, slideUp)
- Responsive breakpoints (md, lg, xl)
- Dark mode setup

**next.config.js**
- React strict mode enabled
- SWC minification for faster builds
- Standard Next.js optimizations

**tsconfig.json**
- TypeScript compiler options
- Next.js plugin integration
- Strict type checking enabled

**postcss.config.js**
- Tailwind CSS loader
- Autoprefixer for vendor prefixes

**package.json**
- Dependencies:
  - `next@^14.0.0` - React framework
  - `react@^18.2.0` - UI library
  - `react-dom@^18.2.0` - DOM rendering
  - `framer-motion@^10.16.0` - Animations
- Dev dependencies:
  - `tailwindcss` - Utility CSS
  - `typescript` - Type safety
  - `autoprefixer` - CSS vendor prefixes
- Scripts: dev, build, start, lint

## 🎨 Design System

### Colors
- **Primary**: Purple (#a855f7, #9333ea, #7e22ce)
- **Secondary**: Cyan (#22d3ee, #06b6d4, #0891b2)
- **Dark Background**: Slate-900, Slate-950
- **Text**: Slate-100 (light), Slate-300 (medium)

### Typography
- System font stack for best performance
- Responsive font sizes (sm, base, lg, xl, 2xl, 5xl, 7xl)
- Font weights: normal, semibold, bold

### Animations
- **Gradient**: 3s infinite loop on backgrounds
- **FadeIn**: 0.6s smooth opacity transition
- **SlideUp**: 0.6s upward slide with fade
- **Button Hover**: Scale, glow effect, color shift
- **Scroll Triggers**: `whileInView` animations on sections

### Spacing
- Uses Tailwind's spacing scale
- Consistent padding/margins: p-4, p-6, p-8
- Responsive gaps: gap-4, gap-8

## 🚀 Getting Started

### Installation
```bash
cd /root/.openclaw/workspace/projects/resumeme/web
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Build & Deploy
```bash
npm run build
npm start
```

## 📱 Responsive Breakpoints

- **Mobile**: Base styles (320px+)
- **Tablet**: `md:` (768px+)
- **Desktop**: Larger screens

All components are mobile-first and fully responsive.

## ✨ Key Features

✅ **Dark Mode** - Eye-friendly modern design
✅ **High Contrast** - Purple & Cyan for accessibility
✅ **Smooth Animations** - Framer Motion throughout
✅ **Mobile-First** - Works on all screen sizes
✅ **Fast Performance** - Optimized Next.js 14
✅ **SEO Ready** - Metadata, semantic HTML
✅ **Accessible** - Semantic structure, high contrast
✅ **No Dependencies** - All CSS/animations are custom

## 🔧 Customization

### Change Colors
Edit `tailwind.config.js` colors section.

### Change Content
Edit text in `app/page.tsx` component functions.

### Add New Sections
Create new component function in `app/page.tsx` and add to Home component.

### Modify Animations
Adjust Framer Motion props in component definitions.

## 📦 Build Output

The `npm run build` command generates:
- Optimized production bundle
- Static HTML where possible
- Minified CSS/JavaScript
- Asset optimization

Ready to deploy to Vercel, Netlify, or any Node.js hosting.

---

**Built with:** Next.js 14 | Tailwind CSS | Framer Motion
**Start Date:** 2024-02-08
**Status:** ✅ Production Ready
