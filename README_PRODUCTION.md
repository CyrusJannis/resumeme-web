# ResizeMe - AI Resume Builder

**Production-ready** AI-powered resume builder with complete features and integrations.

## Features ✨

- 🤖 **AI Optimization** - OpenAI-powered resume suggestions
- 📄 **PDF Export** - Professional PDF downloads
- 💳 **Stripe Payments** - Subscription management
- ✉️ **Email System** - SendGrid integration
- 🔐 **Authentication** - Secure auth with NextAuth.js
- 📊 **Dashboard** - Resume management & analytics
- 🎨 **Modern UI** - Tailwind CSS design
- 🔄 **Version Control** - Resume history tracking

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Database**: Supabase (PostgreSQL)
- **Auth**: NextAuth.js with credential provider
- **Payments**: Stripe
- **Email**: SendGrid
- **AI**: OpenAI API (GPT-3.5-turbo)
- **Styling**: Tailwind CSS
- **UI Components**: Lucide Icons

## Quick Start

### 1. Prerequisites

- Node.js 18+
- PostgreSQL (via Supabase)
- Stripe account
- SendGrid account
- OpenAI API key

### 2. Environment Setup

```bash
cp .env.example .env.local
```

Fill in the environment variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM=price_xxx

# SendGrid
SENDGRID_API_KEY=SG.xxx

# OpenAI
OPENAI_API_KEY=sk-xxx
```

### 3. Database Setup

1. Create a new Supabase project
2. Copy the SQL from `lib/database-schema.sql`
3. Run in Supabase SQL Editor
4. Enable Row Level Security for all tables

### 4. Install & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
npm run start
```

Visit `http://localhost:3000`

## API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `POST /api/auth/[...nextauth]` - NextAuth handler
- `POST /api/auth/verify` - Email verification
- `POST /api/auth/password-reset` - Password reset request
- `PUT /api/auth/password-reset` - Reset password

### Resumes
- `GET /api/resumes` - Get user's resumes
- `POST /api/resumes` - Create new resume
- `PUT /api/resumes?id=xxx` - Update resume
- `DELETE /api/resumes?id=xxx` - Delete resume
- `POST /api/resumes/export-pdf` - Export as PDF

### User
- `GET /api/user` - Get user profile
- `PUT /api/user` - Update profile

### Subscriptions
- `GET /api/subscription` - Get subscription
- `POST /api/subscription` - Manage subscription

### AI Features
- `POST /api/ai` - AI optimization & suggestions

### Admin
- `GET /api/admin/analytics` - Dashboard analytics

### Webhooks
- `POST /api/webhooks/stripe` - Stripe events

## Database Schema

### Tables
- **users** - User accounts & profiles
- **resumes** - Resume content & metadata
- **resume_versions** - Version history
- **subscriptions** - User subscription info
- **invoices** - Payment records
- **audit_logs** - Activity logs
- **sessions** - Session management

## Pricing Plans

### Free
- 1 Resume
- Basic editor
- No AI features

### Pro ($9.99/month)
- 5 Resumes
- AI optimization
- PDF export
- Priority support

### Premium ($19.99/month)
- 20 Resumes
- AI everything
- Cover letter generator
- Advanced analytics
- 24/7 support

## Deployment

### Render.com (Recommended)
1. Push to GitHub
2. Create new Web Service on Render
3. Select repository
4. Set root directory: `web/`
5. Build: `npm run build`
6. Start: `npm start`
7. Add environment variables
8. Deploy

### Railway
1. Connect GitHub
2. Create new project
3. Select repository
4. Auto-deploys on push

### Vercel
```bash
npm install -g vercel
vercel deploy
```

## Project Structure

```
web/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Auth pages
│   ├── dashboard/     # Dashboard
│   ├── editor/        # Resume editor
│   ├── pricing/       # Pricing page
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Homepage
├── components/        # React components
├── lib/              # Utilities & config
│   ├── database-schema.sql
│   ├── supabase.ts
│   ├── email.ts
│   ├── stripe.ts
│   └── ...
├── public/           # Static files
└── middleware.ts     # NextAuth middleware
```

## Key Files

- `middleware.ts` - Authentication middleware
- `app/api/auth/[...nextauth]/route.ts` - NextAuth config
- `app/api/webhooks/stripe/route.ts` - Stripe webhooks
- `components/ResumeEditor.tsx` - Main editor component
- `lib/email.ts` - Email templates & sender

## Features Detail

### Resume Editor
- Live preview
- WYSIWYG editing
- Auto-save
- Version history
- PDF export (Pro+)
- AI suggestions (Pro+)

### Authentication
- Email/password signup
- Email verification
- Password reset
- Session management
- Secure tokens

### Payments
- Stripe Checkout
- Subscription management
- Invoice tracking
- Webhook handling
- Email receipts

### Email
- Verification emails
- Password reset
- Payment receipts
- Welcome emails

## Error Handling

All API routes include:
- Input validation (Zod schemas)
- Error logging
- Proper HTTP status codes
- User-friendly error messages
- Database transaction rollback

## Security

- NextAuth.js for authentication
- Supabase RLS policies
- Secure password hashing (bcryptjs)
- CORS enabled
- HTTPS enforced in production
- SQL injection prevention

## Testing

Test accounts:
- Email: `test@example.com`
- Password: `password123`

## Support

For issues, please check:
1. Environment variables (.env.local)
2. Supabase database connection
3. API keys (Stripe, SendGrid, OpenAI)
4. Database schema (run SQL in Supabase)

## License

MIT

## Author

Coding Agent - Production Quality Build
