# Stripe Integration Setup Guide 💳

## Quick Start (10 minutes)

### 1. Create Stripe Account
1. Go to https://stripe.com
2. Click "Sign up" (use test mode by default)
3. Fill in your details
4. Verify email
5. Complete business info

### 2. Get API Keys
1. Go to Dashboard → Developers → API Keys
2. You'll see two keys:
   - **Publishable Key** (starts with `pk_test_`)
   - **Secret Key** (starts with `sk_test_`)
3. Copy both to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_SECRET_KEY=sk_test_...
   ```

### 3. Create Products
Stripe uses "Products" (what you're selling) and "Prices" (how much it costs).

#### Product 1: Pro Plan
1. Go to Products → Create product
2. Name: `Pro Plan`
3. Billing: `Recurring`
4. Price: `$9.00`
5. Recurring: `Monthly`
6. Click "Create product"
7. Copy the `Price ID` (starts with `price_`)
8. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
   ```

#### Product 2: Premium Plan
1. Create another product
2. Name: `Premium Plan`
3. Billing: `Recurring`
4. Price: `$19.00`
5. Recurring: `Monthly`
6. Click "Create product"
7. Copy the `Price ID`
8. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_...
   ```

### 4. Add API Keys to App
Update `/app/api/stripe/create-checkout-session/route.ts` with your price IDs:

```typescript
// Update the PRICING_PLANS in /app/pricing/page.tsx:

const PRICING_PLANS = [
  // ... free plan ...
  {
    name: 'Pro',
    priceId: 'price_YOUR_PRO_PRICE_ID', // ← Add here
  },
  {
    name: 'Premium',
    priceId: 'price_YOUR_PREMIUM_PRICE_ID', // ← Add here
  },
];
```

---

## Testing Stripe Checkout

### Test Cards
Stripe provides fake credit cards for testing:

| Card Number | CVC | Date | Description |
|------------|-----|------|-------------|
| `4242 4242 4242 4242` | Any | Any future | ✅ Success |
| `4000 0000 0000 0002` | Any | Any future | ❌ Declined |
| `4000 0025 0000 3155` | Any | Any future | ⚠️ Requires auth |
| `5555 5555 5555 4444` | Any | Any future | ✅ Mastercard |

### Test Checkout Flow
1. Go to your app
2. Click "Upgrade to Pro"
3. Should redirect to Stripe checkout
4. Use test card `4242 4242 4242 4242`
5. Email: `test@test.com`
6. Name: `Test User`
7. Click "Subscribe"
8. Should succeed and redirect back

---

## Understanding the Checkout API

### How It Works

```
User clicks "Upgrade" 
  ↓
Frontend sends POST to /api/stripe/create-checkout-session
  {
    priceId: "price_...",
    userId: "uuid-..."
  }
  ↓
Backend:
  1. Gets user from database
  2. Creates Stripe Customer (if needed)
  3. Creates Checkout Session
  ↓
Frontend gets sessionId
  ↓
Redirects to Stripe Checkout
  https://checkout.stripe.com/pay/{sessionId}
  ↓
User enters card details & subscribes
  ↓
Stripe redirects back to success_url
```

### Checkout Session Response

```json
{
  "sessionId": "cs_test_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z"
}
```

---

## Database Integration

### When User Subscribes

1. **Create Stripe Customer**
   ```sql
   UPDATE users 
   SET stripe_customer_id = 'cus_...'
   WHERE id = user_id;
   ```

2. **Create Subscription Record**
   ```sql
   INSERT INTO subscriptions (
     user_id, plan_type, status, stripe_customer_id, stripe_subscription_id
   ) VALUES (
     'uuid', 'pro', 'active', 'cus_...', 'sub_...'
   );
   ```

3. **Update User Plan**
   ```sql
   UPDATE users 
   SET plan = 'pro'
   WHERE id = user_id;
   ```

### Webhook Handler (TODO)
When Stripe sends events, we need to handle them:

```typescript
// app/api/webhooks/stripe/route.ts (To be implemented)

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }

  switch (event.type) {
    case 'customer.subscription.updated':
      // Update subscription in database
      break;
    case 'customer.subscription.deleted':
      // Cancel subscription in database
      break;
  }

  return new Response('OK');
}
```

---

## Price ID Reference

After creating products, you'll get these IDs:

```env
# Test Environment (Always use test keys for dev/staging)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51OxxxxxxxxxxxxKc
STRIPE_SECRET_KEY=sk_test_51OxxxxxxxxxxxxKc
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1OxxxxxxxxxxxxFg
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_1OxxxxxxxxxxxxHi

# Production Environment (Different keys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51OxxxxxxxxxxxxKc
STRIPE_SECRET_KEY=sk_live_51OxxxxxxxxxxxxKc
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_1OxxxxxxxxxxxxZz
NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID=price_1OxxxxxxxxxxxxYy
```

**Never mix test and production keys!**

---

## Webhook Setup (For Production)

### Create Webhook Endpoint
1. Go to Developers → Webhooks
2. Click "Create new endpoint"
3. Endpoint URL: `https://yourdomain.com/api/webhooks/stripe`
4. Events: Select:
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click "Create endpoint"
6. Get the "Signing secret" (starts with `whsec_`)
7. Add to production `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

### Test Webhook Locally
```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login
stripe login

# Forward Stripe events to localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# In another terminal, trigger a test event
stripe trigger payment_intent.succeeded
```

---

## Handling Subscription States

### Subscription Lifecycle

```
Customer subscribes
  ↓ (subscription.created webhook)
Active ←────────────┐
  ↓                 │
Payment fails       │
  ↓                 │
Past Due ───Retry──┘
  ↓
Customer cancels
  ↓ (subscription.deleted webhook)
Canceled
```

### Database Status Values
- `active` - Payment successful, user has access
- `past_due` - Payment failed, retry in progress
- `canceled` - Subscription ended, user access revoked

### Check Subscription Status
```typescript
// In app to check if user has access
const { data: subscription } = await supabase
  .from('subscriptions')
  .select('*')
  .eq('user_id', userId)
  .eq('status', 'active')
  .single();

if (subscription) {
  // User has active subscription
}
```

---

## Test Scenarios

### Scenario 1: Successful Subscription
1. Card: `4242 4242 4242 4242`
2. Expected: ✅ Succeeds
3. Check: User gets pro plan

### Scenario 2: Failed Payment
1. Card: `4000 0000 0000 0002`
2. Expected: ❌ Fails at payment
3. Check: No subscription created

### Scenario 3: Requires Authentication
1. Card: `4000 0025 0000 3155`
2. Expected: ⚠️ 3D Secure prompt
3. Check: Complete 3D Secure flow

---

## Production Checklist

- [ ] Switch from test to live keys
- [ ] Update environment variables
- [ ] Test with real credit card
- [ ] Setup webhook endpoint
- [ ] Test webhook delivery (Stripe Dashboard)
- [ ] Create monitoring alerts
- [ ] Document refund policy
- [ ] Test subscription cancellation
- [ ] Verify email receipts working
- [ ] Check PCI compliance

---

## Common Issues

### "Invalid price ID"
- Make sure price ID starts with `price_`
- Check you're using test keys for test environment
- Verify price ID exists in your Stripe account

### "No such customer"
- Customer may not have been created yet
- Check Stripe Dashboard → Customers
- Review server logs for creation errors

### Webhook not triggering
- Check webhook endpoint URL is public
- Verify signing secret is correct
- Check Stripe → Developers → Webhooks for delivery status
- Review response from endpoint (should be 200 OK)

### Checkout redirect not working
- Make sure `NEXT_PUBLIC_APP_URL` is set
- Check `success_url` and `cancel_url` in API
- Verify URL is publicly accessible

---

## Useful Resources

- Stripe Docs: https://stripe.com/docs
- Test Cards: https://stripe.com/docs/testing
- API Reference: https://stripe.com/docs/api
- Dashboard: https://dashboard.stripe.com

---

**Status**: ✅ Ready for Testing
**Environment**: Test Mode (Safe to use fake cards)
**Next Step**: Setup webhook handler for subscription updates
