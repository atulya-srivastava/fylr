"use client";

import { useForm } from "react-hook-form";
import { useSignUp } from "@clerk/nextjs";
import { z } from "zod";
import Link from "next/link";
import { signUpSchema } from "@/schemas/signUpSchema"; // i wrote this schema
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@radix-ui/react-separator";
import {
  AlertCircle,
  Eye,
  EyeOff,
  Mail,
  Lock,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Label } from "@radix-ui/react-label";

function SignUpForm() {
  const [verifying, setVerifying] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [verificationCode, setVerificationCode] = useState<string>("");
  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const { signUp, isLoaded, setActive } = useSignUp();

  const {
    register, // a method to connect the input
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  //useForm is my assistant that watches remembers valus validates them and throw errors
  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    if (!isLoaded) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      await signUp.create({
        emailAddress: data.email,
        password: data.password,
      });
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code",
      });
      setVerifying(true);
    } catch (error: any) {
      console.error("Signup error: ", error);
      setAuthError(
        error.errors?.[0]?.message ||
          "An error occured while sign up. Please try again"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerificationSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!isLoaded || !signUp) return;
    setIsSubmitting(true);
    setAuthError(null);

    try {
      const result = await signUp.attemptEmailAddressVerification({
        code: verificationCode,
      });
      console.log("this is the result i get ==", result); //todo : remove this line in prod
      if (result.status == "complete") {
        await setActive({ session: result.createdSessionId });
        router.push("/dashboard");
      } else {
        console.error("Verification incompelete for user", result);
        setVerificationError("Verification could not be completed");
      }
    } catch (error: any) {
      console.error("Verification incomplete", error);
      setVerificationError(
        error.errors?.[0]?.message ||
          "An error occured while verifying the code"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // VERIFICATION STEP
  if (verifying) {
    return (
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle>Verify Your Email</CardTitle>
          <CardDescription>
            We've sent a verification code to your email
          </CardDescription>
        </CardHeader>

        <Separator className="mb-6" />

        <CardContent>
          {verificationError && (
            <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <p>{verificationError}</p>
            </div>
          )}

          <form onSubmit={handleVerificationSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                placeholder="Enter the 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                autoFocus
              />
            </div>

            <Button className="w-full" disabled={isSubmitting}>
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Didn't receive a code?{" "}
              <button
                type="button"
                onClick={async () => {
                  if (signUp) {
                    await signUp.prepareEmailAddressVerification({
                      strategy: "email_code",
                    });
                  }
                }}
                className="text-primary hover:underline font-medium"
              >
                Resend code
              </button>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // SIGN UP STEP
  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="text-center">
        <CardTitle>Create Your Account</CardTitle>
        <CardDescription>
          Sign up to start managing your images securely
        </CardDescription>
      </CardHeader>

      <Separator className="mb-6" />

      <CardContent>
        {authError && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-lg mb-6 flex items-center gap-2 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
         
          {/* EMAIL INPUT */}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                {...register("email")}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          {/* PASSWORD INPUT */}
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-10 ${
                  errors.password ? "border-destructive" : ""
                }`}
                {...register("password")}
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD INPUT */}
          <div className="space-y-2">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="passwordConfirmation"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                className={`pl-10 pr-10 ${
                  errors.passwordConfirmation ? "border-destructive" : ""
                }`}
                {...register("passwordConfirmation")}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.passwordConfirmation && (
              <p className="text-sm text-destructive">
                {errors.passwordConfirmation.message}
              </p>
            )}
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
            <p className="text-sm text-muted-foreground">
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
          <div id="clerk-captcha"></div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Creating account..." : "Create Account"}
          </Button>
        </form>
      </CardContent>

      <Separator className="my-4" />

      <CardFooter className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-primary hover:underline font-medium"
          >
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default SignUpForm;

//z.infer is used to automatically derive TypeScript types from a
// Zod schema so that runtime validation and compile-time types stay consistent
// without duplication.
