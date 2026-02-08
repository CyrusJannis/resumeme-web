// app/auth/signup/page.tsx
import SignUpForm from '@/components/auth/SignUpForm';

export const metadata = {
  title: 'Sign Up - ResumeME',
  description: 'Create your ResumeME account',
};

export default function SignUpPage() {
  return <SignUpForm />;
}
