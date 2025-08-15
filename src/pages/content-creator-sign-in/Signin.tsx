/* eslint-disable @typescript-eslint/no-unused-vars */
import ErrorMessage from "@/components/status/ErrorMessage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
// import { useAdminSignin, useSuperAdminSignin } from "@/services/user";
import { useContentCreatorSignin, useSalesSignin, useTeacherSignin } from "@/services/user";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import ethiotelecom from "@/assets/logos/Ethiotelecom.png";
import { Link } from "react-router-dom";
// import vstulogo from "@/assets/logos/image.png"

import signin from "@/assets/logos/vstu.png";
// import backgroundImage from "@/assets/back.jpg";
import { useState } from "react";
import { UserCog, GraduationCap, BadgeDollarSign, Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().trim().email(),
  password: z.string(),
});

const formSchemaPhone = z.object({
  phoneNumber: z.string().min(9, { message: "Phone number must be at least 9 digits." }),
  password: z.string(),
});

export default function SignIn() {
  const navigate = useNavigate();
  const [_, setRole] = useState<'creator' | 'teacher' | 'sales'>('creator');

  const contentCreatorSignin = useContentCreatorSignin({
    onSuccess: () => {
      navigate("/cc");
    },
  });

  const teacherSignin = useTeacherSignin({
    onSuccess: () => {
      navigate("/teacher");
    },
  });

  const salesSignin = useSalesSignin({
    onSuccess: () => {
      navigate("/sales");
    },
  });

  // const superAdminSignin = useContentCreatorSignin({
  //   onSuccess: () => {
  //     navigate("/cc");
  //   },
  // });

  // const q = role === 'admin' ? adminSignin : superAdminSignin;

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#77ff51]  to-[#1a5fbe] relative overflow-hidden"
    //   style={{ backgroundImage: `url(${backgroundImage})`, backgroundBlendMode: 'overlay' }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-[2px] z-0"></div>
      <div className="relative z-10 w-full max-w-lg flex flex-col items-center">
        <div className="bg-white/50 p-10 rounded-3xl shadow-2xl w-full flex flex-col items-center border border-slate-200 backdrop-blur-md animate-fade-in">
          {/* <img src={signin} className="object-contain max-w-[120px] mb-6 drop-shadow-lg rounded-xl border border-slate-100 bg-white/70 p-2" alt="Admin Sign In" /> */}
          <div className="w-full flex justify-between items-center mb-6 gap-4">
            <img src={ethiotelecom} alt="Ethiotelecom Logo" className="w-auto max-w-[12rem] object-contain" />
            <img src={signin} alt="VSTU Logo" className="w-auto max-w-[4rem] object-contain" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-slate-800 mb-6 text-center text-sm">Select your role to continue</p>
          <Tabs defaultValue="creator" className="w-full" onValueChange={val => {
            if (val === 'creator' || val === 'teacher' || val === 'sales') setRole(val);
          }}>
            <TabsList className="mb-6 w-full bg-slate-100 rounded-lg shadow-inner flex">
              <TabsTrigger
                value="creator"
                className="w-1/2 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-emerald-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold text-base"
              >
                <UserCog className="w-5 h-5 mr-1" /> Creator
              </TabsTrigger>
              <TabsTrigger
                value="teacher"
                className="w-1/2 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold text-base"
              >
                <GraduationCap className="w-5 h-5 mr-1" /> Teacher
              </TabsTrigger>
              <TabsTrigger
                value="sales"
                className="w-1/2 flex items-center justify-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-sky-400 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all font-semibold text-base"
              >
                <BadgeDollarSign className="w-5 h-5 mr-1" /> Sales
              </TabsTrigger>
            </TabsList>
            <TabsContent value="creator">
              <SignInForm q={contentCreatorSignin} role="creator" />
            </TabsContent>
            <TabsContent value="teacher">
              <SignInForm q={teacherSignin} role="teacher" />
            </TabsContent>
            <TabsContent value="sales">
              <SignInForm q={salesSignin} role="sales" />
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-8 text-xs text-slate-400 text-center w-full animate-fade-in delay-200">
          &copy; {new Date().getFullYear()} VSTU Administrator Portal. All rights reserved.
        </div>
      </div>
    </main>
  );
}

function SignInForm({ q, role }: { q: any; role: 'creator' | 'teacher' | 'sales' }) {
  const form = useForm<z.infer<typeof formSchema> | z.infer<typeof formSchemaPhone>>({
    resolver: zodResolver(role === 'creator' ? formSchema : formSchemaPhone),
    defaultValues: role === 'creator' ? {
      email: "",
      password: "",
    } : {
      phoneNumber: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit((values) => {
          if (role === 'creator') {
            const { email, password } = values as z.infer<typeof formSchema>;
            q.mutate({ email: email.trim(), password });
          } else {
            const { phoneNumber, password } = values as z.infer<typeof formSchemaPhone>;
            q.mutate({ phoneNumber: "251" + phoneNumber, password });
          }
        })}
        className="space-y-6 w-full animate-fade-in"
        autoComplete="off"
      >
        {role === 'creator' ? (
          <>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={'admin@example.com'}
                      {...field}
                      className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 shadow-sm"
                      autoComplete="username"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      {...field}
                      className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 shadow-sm"
                      autoComplete={'current-password'}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        ) : (
          <>
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Phone Number</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="bg-[#b9d7ff] text-gray-700 rounded-l-md px-3 py-2 flex items-center">
                        +251
                      </div>
                      <Input
                        placeholder="911121314"
                        {...field}
                        className="rounded-none rounded-r-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 shadow-sm"
                        type="tel"
                        autoComplete="tel"
                        pattern="[9][0-9]{8}"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-700 font-semibold">Password</FormLabel>
                  <FormControl>
                    <PasswordInput
                      className="rounded-lg border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white/80 shadow-sm"
                      autoComplete={'current-password'}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <ErrorMessage error={q.error} />
        <Button
          disabled={q.isPending}
          type="submit"
          className={`w-full py-3 rounded-lg font-semibold text-base hover:from-blue-600 hover:to-sky-500 text-white shadow-lg transition-all duration-200 flex items-center justify-center gap-2 ${role === 'creator' ? 'bg-gradient-to-r from-sky-500 to-primary' : 'bg-gradient-to-r from-primary to-sky-500'}`}
        >
          {q.isPending && (
            <Loader2 className="animate-spin h-5 w-5 text-white mr-2" />
          )}
          {role === 'creator' ? 'Sign In as Content Creator' : role === 'teacher' ? 'Sign In as Teacher' : 'Sign In as Sales'}
        </Button>

        <div className="w-full flex justify-center items-center">
            <Link to="/signup">
            <span className="text-md hover:underline text-center text-blue-950">Signup</span>
            </Link>
        </div>
      </form>
    </Form>
  );
}
