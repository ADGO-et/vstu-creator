import { UserRole } from '@/types/signup';

interface SignupHeaderProps {
  role: UserRole;
}

export function SignupHeader({ role }: SignupHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div className="bg-gradient-primary bg-clip-text text-transparent mb-4">
        <h1 className="text-4xl font-bold mb-2">Join Our Platform</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Create your {role} account and start your journey with us
      </p>
    </div>
  );
}