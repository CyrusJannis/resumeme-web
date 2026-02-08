// app/auth/login/page.tsx
import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Sign In - ResumeME',
  description: 'Sign in to your ResumeME account',
};

export default function LoginPage() {
  return <LoginForm />;
}
