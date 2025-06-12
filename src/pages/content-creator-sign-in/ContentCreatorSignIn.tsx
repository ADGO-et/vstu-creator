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
import logo1 from "@/assets/logos/vstu.png";
import logo2 from "@/assets/logos/tele.png"; // ✅ Second logo
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
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-lg flex flex-col items-center relative">
        {/* ✅ Logos side by side */}
        <div className="flex items-center justify-center gap-8 mb-6 ">
          <img
            src={logo2}
            alt="VSTU Logo"
            className="max-w-[150px] object-contain mr-8"
          />
          <img
            src={logo1}
            alt="Teletemari Logo"
            className="max-w-[60px] object-contain ml-8"
          />
        </div>

        <h1 className="text-3xl font-bold text-primary mb-6">
          Sign in as a Content Creator
        </h1>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((vals) => {
              const trimmedVals = {
                emailOrPhone: vals.emailOrPhone.trim(),
                password: vals.password,
              };
              const isEmail = trimmedVals.emailOrPhone.includes("@");
              if (isEmail) {
                q.mutate({
                  email: trimmedVals.emailOrPhone,
                  password: trimmedVals.password,
                });
              } else {
                q.mutate({
                  phoneNumber: trimmedVals.emailOrPhone,
                  password: trimmedVals.password,
                });
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
