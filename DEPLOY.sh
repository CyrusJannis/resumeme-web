#!/bin/bash
# ResumeME Production Deployment Script
# This script sets up all credentials for production deployment

echo "🚀 ResumeME - FINAL PRODUCTION DEPLOYMENT"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the web directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Are you in the web directory?${NC}"
    exit 1
fi

echo -e "${YELLOW}STEP 1: Create .env.production with real credentials${NC}"
echo "Please provide the following credentials:"
echo ""

# Read credentials
read -p "NEXT_PUBLIC_SUPABASE_URL (https://...supabase.co): " SUPABASE_URL
read -p "NEXT_PUBLIC_SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "STRIPE_SECRET_KEY (sk_live_...): " STRIPE_SECRET
read -p "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_live_...): " STRIPE_PUBLIC
read -p "SENDGRID_API_KEY (SG....): " SENDGRID_KEY
read -p "OPENAI_API_KEY (sk_...): " OPENAI_KEY
read -p "NEXTAUTH_SECRET (or press Enter for auto-generated): " NEXTAUTH_SECRET

# Generate NEXTAUTH_SECRET if not provided
if [ -z "$NEXTAUTH_SECRET" ]; then
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    echo -e "${GREEN}✅ Generated NEXTAUTH_SECRET${NC}"
fi

read -p "NEXT_PUBLIC_APP_URL (https://your-domain.com): " APP_URL
read -p "ADMIN_EMAILS (comma-separated): " ADMIN_EMAILS

# Create .env.production
cat > .env.production << EOF
# Production Environment Variables
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
STRIPE_SECRET_KEY=$STRIPE_SECRET
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$STRIPE_PUBLIC
SENDGRID_API_KEY=$SENDGRID_KEY
OPENAI_API_KEY=$OPENAI_KEY
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$APP_URL
NEXT_PUBLIC_APP_URL=$APP_URL
ADMIN_EMAILS=$ADMIN_EMAILS
NODE_ENV=production
EOF

echo -e "${GREEN}✅ Created .env.production${NC}"
echo ""

echo -e "${YELLOW}STEP 2: Build Production${NC}"
npm run build
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Build failed!${NC}"
    exit 1
fi
echo -e "${GREEN}✅ Build successful${NC}"
echo ""

echo -e "${YELLOW}STEP 3: Git commit${NC}"
git add .env.production
git commit -m "Add production environment variables"
echo -e "${GREEN}✅ Committed${NC}"
echo ""

echo -e "${YELLOW}STEP 4: Instructions for deployment${NC}"
echo ""
echo "Option A: Deploy to Railway"
echo "  1. Login: railway login --browserless"
echo "  2. Link project: railway link"
echo "  3. Deploy: railway up"
echo ""
echo "Option B: Deploy to Render"
echo "  1. Go to: https://dashboard.render.com"
echo "  2. Connect your GitHub repo"
echo "  3. Add environment variables from .env.production"
echo "  4. Deploy!"
echo ""
echo "Option C: Deploy to Vercel"
echo "  1. Go to: https://vercel.com/import"
echo "  2. Import GitHub repo"
echo "  3. Add environment variables"
echo "  4. Deploy!"
echo ""

echo -e "${GREEN}🎉 Deployment prep complete!${NC}"
