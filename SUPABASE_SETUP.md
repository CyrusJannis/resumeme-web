# Supabase Database Setup Instructions 🗄️

## Quick Start (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click "New Project"
3. Fill in details:
   - Name: `resumeme`
   - Password: Generate strong password
   - Region: Choose closest to your users
4. Click "Create new project"
5. Wait for project initialization (~2 minutes)

### 2. Get API Keys
1. Go to Settings → API
2. Copy these values to `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=<Project URL>
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon/public key>
   SUPABASE_SERVICE_KEY=<service_role key>
   ```

### 3. Create Tables
1. Go to SQL Editor
2. Click "New Query"
3. Copy & paste the SQL below
4. Click "Run"

```sql
-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT auth.uid(),
  email TEXT NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'premium')),
  stripe_customer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  CONSTRAINT users_email_key UNIQUE (email)
);

-- ============================================
-- RESUMES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL DEFAULT '{
    "sections": {
      "summary": "",
      "experience": [],
      "education": [],
      "skills": [],
      "projects": []
    }
  }'::jsonb,
  file_url TEXT,
  is_draft BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- SUBSCRIPTIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('free', 'pro', 'premium')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due')),
  stripe_customer_id TEXT NOT NULL,
  stripe_subscription_id TEXT,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ============================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON subscriptions(stripe_customer_id);

-- ============================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Users: Can read own data
CREATE POLICY "users_select_own"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Resumes: Can read own resumes
CREATE POLICY "resumes_select_own"
  ON resumes FOR SELECT
  USING (auth.uid() = user_id);

-- Resumes: Can insert own resumes
CREATE POLICY "resumes_insert_own"
  ON resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Resumes: Can update own resumes
CREATE POLICY "resumes_update_own"
  ON resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Resumes: Can delete own resumes
CREATE POLICY "resumes_delete_own"
  ON resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Subscriptions: Can read own subscriptions
CREATE POLICY "subscriptions_select_own"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### 4. Setup Authentication
1. Go to Authentication → Providers
2. Make sure "Email" is enabled
3. Go to Authentication → Email Templates
4. (Optional) Customize verification email

### 5. Setup Storage (for resume files)
1. Go to Storage
2. Click "Create bucket"
3. Name: `resumes`
4. Make public: NO (keep private)
5. Click "Create bucket"

### 6. Storage RLS Policies
1. Go to Storage → resumes
2. Click "Policies"
3. Add "Read" policy:
   ```sql
   SELECT auth.uid() = owner_id
   ```
4. Add "Insert" policy:
   ```sql
   INSERT (SELECT auth.uid() = auth.uid())
   ```

---

## Database Schema Explained

### `users` Table
- **id**: Auto UUID from Supabase Auth
- **email**: User email (unique)
- **plan**: Current subscription tier
- **stripe_customer_id**: Link to Stripe customer
- **created_at**: Account creation timestamp
- **updated_at**: Last update timestamp

### `resumes` Table
- **id**: Unique resume ID
- **user_id**: Foreign key to users
- **title**: Resume title (e.g., "Software Engineer")
- **content**: JSONB with resume sections
  ```json
  {
    "sections": {
      "summary": "...",
      "experience": [...],
      "education": [...],
      "skills": [...],
      "projects": [...]
    }
  }
  ```
- **file_url**: S3/Storage URL if uploaded
- **is_draft**: Whether it's still being edited
- **created_at**: When resume was created
- **updated_at**: When resume was last edited

### `subscriptions` Table
- **id**: Unique subscription ID
- **user_id**: Foreign key to users
- **plan_type**: free/pro/premium
- **status**: active/canceled/past_due
- **stripe_customer_id**: Stripe customer ID
- **stripe_subscription_id**: Stripe subscription ID
- **current_period_start**: Billing cycle start
- **current_period_end**: Billing cycle end
- **created_at**: When subscription started
- **updated_at**: When subscription was updated

---

## Testing the Setup

### Test Connection
```bash
# In your app, this should work:
import { supabase } from '@/lib/supabase/client';

const { data, error } = await supabase
  .from('users')
  .select('*')
  .limit(1);

console.log(data, error);
```

### Test Auth
1. Open app at http://localhost:3000
2. Click "Sign Up"
3. Enter email & password
4. Should see success message
5. Go to Supabase → Authentication → Users
6. You should see your new user

### Test Database Insert
1. After signing up, go to Supabase → SQL Editor
2. Run:
   ```sql
   SELECT * FROM users ORDER BY created_at DESC LIMIT 5;
   ```
3. You should see your user

---

## Important Configuration

### Email Verification
By default, Supabase requires email verification. To disable for testing:

1. Go to Authentication → Settings
2. Find "Email Confirmation"
3. Toggle "Confirm email" OFF
4. (Re-enable for production!)

### Custom Email Sender
1. Go to Authentication → Email Templates
2. Go to "Confirm signup" template
3. Customize sender name & email
4. Update template HTML as needed

### Database Backups
1. Go to Settings → Backups
2. Enable "Automated backups"
3. Choose retention period (14 days recommended)

---

## Troubleshooting

### "Column 'auth.uid()' does not exist"
- Make sure Supabase Auth is enabled
- Run the RLS policies AFTER tables are created

### "Permission denied" errors
- Check RLS policies are correctly set
- Verify user is logged in (check JWT token)
- Check `auth.uid()` matches expected user

### "Table does not exist"
- Refresh SQL Editor
- Check table name spelling
- Re-run create table SQL

### Connection timeout
- Check internet connection
- Verify API URL is correct in `.env.local`
- Check Supabase project is running (go to Dashboard)

---

## Production Checklist

- [ ] Enable email verification in Auth settings
- [ ] Setup custom email templates
- [ ] Enable backups in Settings → Backups
- [ ] Configure Auth → Rate limiting
- [ ] Test RLS policies with real data
- [ ] Setup monitoring & alerts
- [ ] Document backup restoration process
- [ ] Plan disaster recovery

---

## Useful SQL Queries

### View all users
```sql
SELECT id, email, plan, created_at FROM users ORDER BY created_at DESC;
```

### View all resumes
```sql
SELECT r.id, r.title, u.email, r.created_at 
FROM resumes r 
JOIN users u ON r.user_id = u.id 
ORDER BY r.created_at DESC;
```

### Count resumes per user
```sql
SELECT u.email, COUNT(r.id) as resume_count
FROM users u
LEFT JOIN resumes r ON u.id = r.user_id
GROUP BY u.id
ORDER BY resume_count DESC;
```

### View active subscriptions
```sql
SELECT s.id, u.email, s.plan_type, s.status, s.current_period_end
FROM subscriptions s
JOIN users u ON s.user_id = u.id
WHERE s.status = 'active'
ORDER BY s.created_at DESC;
```

---

**Last Updated**: February 8, 2026
**Status**: ✅ Ready to Use
