// lib/supabase/types.ts

export type User = {
  id: string;
  email: string;
  created_at: string;
  plan: 'free' | 'pro' | 'premium';
  subscription_id?: string;
};

export type Resume = {
  id: string;
  user_id: string;
  title: string;
  content: {
    sections: {
      summary?: string;
      experience?: Array<{
        company: string;
        position: string;
        startDate: string;
        endDate: string;
        description: string;
      }>;
      education?: Array<{
        school: string;
        degree: string;
        field: string;
        year: string;
      }>;
      skills?: string[];
      projects?: Array<{
        name: string;
        description: string;
        link?: string;
      }>;
    };
  };
  file_url?: string;
  created_at: string;
  updated_at: string;
  is_draft: boolean;
};

export type Subscription = {
  id: string;
  user_id: string;
  plan_type: 'free' | 'pro' | 'premium';
  status: 'active' | 'canceled' | 'past_due';
  stripe_customer_id: string;
  stripe_subscription_id?: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
  updated_at: string;
};
