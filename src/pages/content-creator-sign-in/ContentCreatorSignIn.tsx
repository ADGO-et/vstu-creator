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
import { useContentCreatorSignin } from "@/services/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import signin from "@/assets/logos/vstu.png";
import backgroundImage from "@/assets/back.jpg";
import { isEmailOrPhone } from "@/lib/validation-utils";

const formSchema = z.object({
  emailOrPhone: z
    .string()
    .trim()
    .refine(isEmailOrPhone, { message: "Invalid email or phone number" }),
  password: z.string(),
});

export default function ContentCreatorSignIn() {
  const navigate = useNavigate();
  const q = useContentCreatorSignin({
    onSuccess: () => {
      navigate("/cc");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emailOrPhone: "",
      password: "",
    },
  });

  return (
    <main
      className="flex items-center justify-center min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
      <div className="bg-white bg-opacity-90 p-10 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center relative">
        <img src={signin} className="object-contain max-w-[150px] mb-6" alt="Content Creator Sign In" />
        <h1 className="text-3xl font-bold text-primary mb-6">Sign in as a Content Creator</h1>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((vals) => {
              const trimmedVals = {
                emailOrPhone: vals.emailOrPhone.trim(),
                password: vals.password,
              };
              const isEmail = trimmedVals.emailOrPhone.includes("@");
              if (isEmail) {
                q.mutate({ email: trimmedVals.emailOrPhone, password: trimmedVals.password });
              } else {
                q.mutate({ phoneNumber: trimmedVals.emailOrPhone, password: trimmedVals.password });
              }
            })}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="emailOrPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email or Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="abebe@gmail.com" {...field} />
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <PasswordInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ErrorMessage error={q.error} />
            <Button isLoading={q.isPending} type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </main>
  );
}