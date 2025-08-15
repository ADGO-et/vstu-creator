import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TeacherSignupForm } from '@/components/signup/TeacherSignupForm';
import { SalesSignupForm } from '@/components/signup/SalesSignupForm';
import { SignupHeader } from '@/components/signup/SignupHeader';
import { StatusMessages } from '@/components/signup/StatusMessages';
import { useSignup } from '@/hooks/useSignup';
// import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { GraduationCap, TrendingUp } from 'lucide-react';

const Signup = () => {
  const { role, error, success, setRole, resetState } = useSignup();

  const handleTabChange = (value: string) => {
    setRole(value as 'teacher' | 'sales');
    resetState();
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <div className="container mx-auto px-4 py-8">
        <SignupHeader role={role} />
        
        <StatusMessages 
          error={error} 
          success={success} 
          onReset={resetState} 
        />

        <Tabs value={role} onValueChange={handleTabChange} className="w-full max-w-2xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8 bg-primary/30 p-1 h-12">
            <TabsTrigger 
              value="teacher" 
              className="flex items-center justify-center data-[state=active]:bg-primary/60 data-[state=active]:text-white font-medium"
            >
              <GraduationCap className="w-5 h-5 mr-2" aria-hidden="true" />
              Teacher Registration
            </TabsTrigger>
            <TabsTrigger 
              value="sales" 
              className="flex items-center justify-center data-[state=active]:bg-primary/60 data-[state=active]:text-white font-medium"
            >
              <TrendingUp className="w-5 h-5 mr-2" aria-hidden="true" />
              Sales Registration
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="teacher" className="mt-0">
            <TeacherSignupForm />
          </TabsContent>
          
          <TabsContent value="sales" className="mt-0">
            <SalesSignupForm />
          </TabsContent>
        </Tabs>

        <div className="border flex justify-center items-center p-4">
          <Link to='/' className='hover:underline hover:text-primary font-semibold'>Signin</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;