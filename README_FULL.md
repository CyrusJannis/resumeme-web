# ResumeME - AI Resume Builder 📄✨

A modern, full-stack resume builder with AI optimization, built with Next.js, Supabase, and Stripe.

## 🚀 Quick Start (5 Minutes)

### Prerequisites
- Node.js 18+ (check with `node -v`)
- npm or yarn
- Supabase account (free: https://supabase.com)
- Stripe account (free test: https://stripe.com)

### 1. Setup Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Then fill in your credentials:

```env
# From Supabase Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# From Stripe Dashboard → Developers → API Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... # Leave empty for now

# Your app URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Get your keys**:
- Supabase: https://app.supabase.com → Select project → Settings → API
- Stripe: https://dashboard.stripe.com → Developers → API Keys

### 2. Setup Supabase Database

1. Go to your Supabase project
2. SQL Editor → New Query
3. Copy & paste from [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
4. Run SQL query

### 3. Create Stripe Products

1. Go to Stripe Dashboard → Products
2. Create "Pro" product: $9/month
3. Create "Premium" product: $19/month
4. Copy price IDs to `.env.local`

### 4. Install & Run

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

Done! 🎉

---

## 📚 Documentation

- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Complete setup guide with database schema
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Detailed Supabase configuration
- **[STRIPE_SETUP.md](./STRIPE_SETUP.md)** - Stripe integration guide
- **[STATUS_REPORT.md](./STATUS_REPORT.md)** - Development status & testing checklist
- **[DEVELOPMENT_ROADMAP.md](./DEVELOPMENT_ROADMAP.md)** - Feature roadmap

---

## ✨ Features

### ✅ Currently Available
- **Authentication**: Email/password signup & login
- **Dashboard**: User profile & quick actions
- **Resume Editor**: Create resumes with live preview
- **Pricing**: 3 subscription tiers (Free, Pro, Premium)
- **Stripe**: Checkout integration for payments
- **Responsive**: Mobile, tablet, desktop optimized
- **Dark Mode**: Eye-friendly dark UI

### 🔄 In Development
- Resume upload (PDF/DOCX import)
- AI optimization (OpenAI integration)
- Cover letter generation
- Interview prep guide
- ATS score checker

### 🎯 Coming Soon
- Resume templates
- LinkedIn integration
- Team collaboration
- Mobile app
- Analytics dashboard

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    ResumeME Frontend                     │
│                    (Next.js 14)                          │
├─────────────────────────────────────────────────────────┤
│  Dashboard  │  Editor  │  Pricing  │  Auth  │  Landing  │
├─────────────────────────────────────────────────────────┤
│              React Context + Tailwind CSS                │
├─────────────────────────────────────────────────────────┤
│  Supabase Auth  │  Stripe SDK  │  API Routes            │
└─────────────────────────────────────────────────────────┘
                          │
                ┌─────────┴─────────┐
                │                   │
           ┌────▼─────┐      ┌──────▼──────┐
           │ Supabase  │      │   Stripe    │
           ├───────────┤      ├─────────────┤
           │ • Auth    │      │ • Payments  │
           │ • Database│      │ • Customers │
           │ • Storage │      │ • Webhooks  │
           └───────────┘      └─────────────┘
```

---

## 📦 Project Structure

```
resumeme/web/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── auth/
│   │   ├── signup/page.tsx       # Sign up page
│   │   └── login/page.tsx        # Login page
│   ├── dashboard/page.tsx        # User dashboard
│   ├── editor/new/page.tsx       # New resume editor
│   ├── pricing/page.tsx          # Pricing page
│   └── api/
│       └── stripe/
│           └── create-checkout-session/route.ts  # Stripe API
│
├── components/
│   ├── auth/
│   │   ├── SignUpForm.tsx
│   │   └── LoginForm.tsx
│   └── editor/
│       └── ResumeEditor.tsx
│
├── lib/
│   ├── auth/context.tsx          # Auth provider & hooks
│   ├── supabase/
│   │   ├── client.ts             # Supabase client
│   │   ├── server.ts             # Supabase server
│   │   └── types.ts              # TypeScript types
│   └── stripe.ts                 # Stripe configuration
│
├── public/                        # Static assets
├── package.json                  # Dependencies
├── tailwind.config.js            # Tailwind config
├── tsconfig.json                 # TypeScript config
└── .env.example                  # Environment template
```

---

## 🧪 Testing

### Manual Testing Checklist

**Auth Flow**
- [ ] Sign up with valid email
- [ ] Try weak password (should fail)
- [ ] Email verification works
- [ ] Login with credentials
- [ ] Session persists on reload
- [ ] Logout clears session

**Dashboard**
- [ ] See welcome message
- [ ] See current plan
- [ ] Click "Create Resume"
- [ ] Click "Upgrade Plan"

**Editor**
- [ ] Fill in all sections
- [ ] Live preview updates
- [ ] Save resume
- [ ] Data persists

**Pricing**
- [ ] 3 tiers visible
- [ ] "Pro" marked popular
- [ ] Click upgrade → Stripe checkout
- [ ] Test card: `4242 4242 4242 4242`

**Responsive**
- [ ] Works on 320px (mobile)
- [ ] Works on 768px (tablet)
- [ ] Works on 1024px+ (desktop)
- [ ] No horizontal scroll
- [ ] Touch-friendly buttons

### Automated Testing (TODO)
```bash
# Jest for unit tests
npm run test

# Playwright for E2E tests
npm run test:e2e

# Cypress for integration tests
npm run test:integration
```

---

## 🔒 Security

- ✅ TypeScript for type safety
- ✅ Supabase RLS (Row Level Security)
- ✅ Environment variables isolated
- ✅ HTTPS recommended for production
- ✅ Password hashed with Supabase Auth
- ✅ Stripe test mode for development

**Before production**:
- [ ] Enable email verification
- [ ] Setup CORS properly
- [ ] Enable RLS policies
- [ ] Use environment variables
- [ ] Setup rate limiting
- [ ] Enable backups

---

## 📊 Performance

Expected metrics:
- **Lighthouse Score**: 90+
- **Bundle Size**: ~120KB gzipped
- **First Load**: <1s
- **Core Web Vitals**: All green

Check your score:
```bash
npm run build
# Then use Lighthouse in DevTools
```

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# 1. Push to GitHub
git add .
git commit -m "Initial ResumeME"
git push

# 2. Go to vercel.com
# 3. Import your GitHub repository
# 4. Add environment variables from .env.local
# 5. Click Deploy

# Done! Your app is live at yourdomain.vercel.app
```

### Deploy to Other Platforms

**Netlify**:
1. Connect GitHub repo
2. Build: `npm run build`
3. Publish: `.next`

**Self-hosted** (Docker):
```bash
docker build -t resumeme .
docker run -p 3000:3000 resumeme
```

---

## 🛠️ Development Scripts

```bash
npm run dev      # Start dev server on localhost:3000
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run type     # Check TypeScript errors
```

---

## 🐛 Troubleshooting

### "Module not found" Error
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### "NEXT_PUBLIC_* not found"
```bash
# Make sure .env.local exists with all variables
cp .env.example .env.local
# Then fill in your credentials
```

### "Cannot connect to Supabase"
```
1. Check .env.local has NEXT_PUBLIC_SUPABASE_URL
2. Verify Supabase project is running
3. Check API keys are correct
4. Review browser console for details
```

### "Stripe checkout not opening"
```
1. Check NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY exists
2. Create test products in Stripe
3. Add price IDs to /app/pricing/page.tsx
4. Check browser console for errors
```

---

## 📞 Support

Need help?

1. **Check Docs**: Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
2. **Check Logs**: 
   - Browser console: Press F12 → Console
   - Terminal: Check `npm run dev` output
   - Supabase: Dashboard → Logs
   - Stripe: Dashboard → Logs
3. **Common Issues**: See SUPABASE_SETUP.md & STRIPE_SETUP.md
4. **GitHub Issues**: Create an issue with error details

---

## 📄 License

MIT - Feel free to use for personal or commercial projects

---

## 🙌 Credits

- **Framework**: Next.js 14
- **Database**: Supabase (PostgreSQL)
- **Payments**: Stripe
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **UI**: Custom components

---

## 🎯 Roadmap

### Phase 1: MVP ✅ DONE
- Core auth & dashboard
- Resume editor
- Stripe integration
- Responsive design

### Phase 2: AI Features (In Progress)
- Resume parsing
- AI optimization
- ATS score checker

### Phase 3: Social & Sharing
- LinkedIn integration
- Share resumes
- Public profiles

### Phase 4: Team & Enterprise
- Team collaboration
- Admin panel
- Advanced analytics

---

**Happy resume building! 🚀**

For questions or contributions, visit the docs or create an issue on GitHub.

---

Last Updated: February 8, 2026  
Status: 🟢 Development Phase - Core Features Ready  
Built with ❤️ using Next.js, Supabase, and Stripe
