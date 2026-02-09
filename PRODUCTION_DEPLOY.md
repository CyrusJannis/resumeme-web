# ResizeMe - Production Deployment

## Environment Configuration for Production

```env
# Supabase (PostgreSQL Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth (Session Management)
NEXTAUTH_SECRET=your-secret-key-here-min-32-chars
NEXTAUTH_URL=https://yourdomain.com
NEXT_PUBLIC_NEXTAUTH_URL=https://yourdomain.com

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key
STRIPE_SECRET_KEY=sk_live_your_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_your_pro_id
NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM=price_your_premium_id

# SendGrid (Transactional Email)
SENDGRID_API_KEY=SG.your_sendgrid_api_key

# OpenAI (AI Features)
OPENAI_API_KEY=sk-your_openai_api_key

# Admin (Comma-separated emails)
ADMIN_EMAILS=admin@example.com,owner@example.com

# Application
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NODE_ENV=production
```

## Quick Deploy Checklist

- [ ] Database schema imported in Supabase (lib/database-schema.sql)
- [ ] Supabase RLS policies enabled
- [ ] Stripe account created and API keys obtained
- [ ] SendGrid account created and API keys obtained
- [ ] OpenAI account created and API keys obtained
- [ ] Environment variables configured
- [ ] npm run build successful
- [ ] npm run start working

## Testing Before Going Live

```bash
# 1. Test signup
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# 2. Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# 3. Check health
curl http://localhost:3000/
```

## Production Deployment

### Option 1: Render.com (Recommended)
1. Push to GitHub
2. Create Web Service on render.com
3. Select repository
4. Build: `npm run build`
5. Start: `npm start`
6. Add all env vars
7. Deploy

### Option 2: Railway.app
1. Connect GitHub account
2. Create new project
3. Railway auto-deploys on push

### Option 3: Vercel
```bash
npm install -g vercel
vercel deploy --prod
```

## Monitoring & Maintenance

- Monitor Supabase database usage
- Track Stripe webhook events
- Review SendGrid delivery reports
- Monitor OpenAI API usage
- Check application logs
- Backup database regularly

## Support

For issues, check:
1. Environment variables (.env.local)
2. Supabase connection (test SQL)
3. API keys validity
4. CORS settings
5. Database schema (run SQL)
