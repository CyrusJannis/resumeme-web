# ResizeMe - AI Resume Builder Landing Page

Modern, fast, and beautiful landing page for ResizeMe built with Next.js 14, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Dark Mode Design** - Purple & Cyan color scheme with high contrast
- **Fully Responsive** - Mobile-first approach
- **Smooth Animations** - Powered by Framer Motion
- **ATS-Optimized** - Fast loading, semantic HTML
- **All Sections**:
  - Hero Section with CTA
  - Value Propositions (3 pillars)
  - How It Works (3 steps)
  - Pricing Table (Free/Pro/Premium)
  - Testimonials with ratings
  - FAQ with accordions
  - Final CTA
  - Footer

## 📦 Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animation library
- **TypeScript** - Type safety

## 🛠️ Installation

```bash
cd /root/.openclaw/workspace/projects/resumeme/web
npm install
```

## 👨‍💻 Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Build

```bash
npm run build
npm start
```

## 🎨 Customization

### Colors
Edit `tailwind.config.js` to change the primary (purple) and secondary (cyan) colors.

### Content
All text content is in `app/page.tsx`. Easy to find and modify.

### Animations
Framer Motion animations can be customized in each component's `initial`, `animate`, and `transition` props.

## 📱 Responsive Design

The layout uses Tailwind's responsive classes:
- Mobile-first (base styles for mobile)
- `md:` breakpoint for tablets and up
- Fully responsive components

## ✨ Features Showcase

- **Gradient backgrounds** with CSS animations
- **Hover effects** on buttons and cards
- **Scroll animations** with `whileInView`
- **Expandable FAQ** with smooth height transitions
- **Pricing cards** with "Most Popular" badge
- **Testimonials** with star ratings
- **Mobile-optimized navigation**

## 🚀 Ready to Deploy

Push to Vercel, Netlify, or any Next.js hosting:

```bash
git push
```

---

Built with ❤️ for job seekers everywhere. Start free today!
