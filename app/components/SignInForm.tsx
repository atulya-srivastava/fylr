"use client"

import { useSignIn } from "@clerk/nextjs"
import { ClerkAPIError } from "@clerk/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { signInSchema } from "@/schemas/signInSchema"
import z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Mail, EyeOff, Eye, Loader2, Lock, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function SignInForm(){
    const router = useRouter()
    const {signIn, isLoaded, setActive}= useSignIn()
    const [isSubmitting, setIsSubmitting]=useState<boolean>(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false);
    
    // Second factor verification state
    const [needsSecondFactor, setNeedsSecondFactor] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            identifier: "",
            password: ""
        }
    })

    const onSubmit = async(data: z.infer<typeof signInSchema>) =>{

        if(!isLoaded) return;
        setIsSubmitting(true)
        setAuthError(null)

        try {
            const result = await signIn.create({
                identifier: data.identifier,
                password: data.password
            })

            if(result.status == "complete"){
                await setActive({session: result.createdSessionId})
                router.push("/dashboard");
            } else if (result.status === "needs_second_factor") {
                // Client Trust requires verification - check if email_code is supported
                // Cast to handle email_code which isn't in the official types but is returned by Client Trust
                const supportsEmailCode = (result.supportedSecondFactors as Array<{ strategy: string }> | undefined)?.some(
                    (factor) => factor.strategy === "email_code"
                );
                
                if (supportsEmailCode) {
                    // For Client Trust, use first factor methods with email_code
                    await signIn.prepareFirstFactor({
                        strategy: "email_code",
                        emailAddressId: result.supportedFirstFactors?.find(
                            (factor) => factor.strategy === "email_code"
                        )?.emailAddressId || ""
                    });
                    setNeedsSecondFactor(true);
                } else {
                    // Check for other second factor options (TOTP, phone)
                    const hasTotp = result.supportedSecondFactors?.some(
                        (factor) => factor.strategy === "totp"
                    );
                    const hasPhone = result.supportedSecondFactors?.some(
                        (factor) => factor.strategy === "phone_code"
                    );
                    
                    if (hasTotp) {
                        setAuthError("Please use your authenticator app for 2FA verification.");
                    } else if (hasPhone) {
                        await signIn.prepareSecondFactor({ strategy: "phone_code" });
                        setNeedsSecondFactor(true);
                    } else {
                        setAuthError("Second factor verification is required but no supported method is available.");
                    }
                }
            } else if (result.status === "needs_first_factor") {
                // Email verification needed - prepare first factor
                const emailFactor = result.supportedFirstFactors?.find(
                    (factor) => factor.strategy === "email_code"
                );
                if (emailFactor && 'emailAddressId' in emailFactor) {
                    await signIn.prepareFirstFactor({
                        strategy: "email_code",
                        emailAddressId: emailFactor.emailAddressId
                    });
                    setNeedsSecondFactor(true);
                } else {
                    setAuthError("Email verification is required but email address is not available.");
                }
            } else {
                setAuthError("Sign-in could not be completed. Please try again")
                console.error("Sign in incomplete, error=",result);
            }

        } catch (error: unknown) {
            const clerkError = error as { errors?: ClerkAPIError[] };
            setAuthError(
                clerkError.errors?.[0]?.message || "An error occured during sign in process"
            )
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleVerifyCode = async () => {
        if (!isLoaded || !signIn) return;
        
        setIsVerifying(true);
        setAuthError(null);

        try {
            // Try first factor attempt (for Client Trust email verification)
            const result = await signIn.attemptFirstFactor({
                strategy: "email_code",
                code: verificationCode
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/dashboard");
            } else if (result.status === "needs_second_factor") {
                // If there's still a second factor needed after email verification
                setAuthError("Additional verification required. Please contact support.");
            } else {
                setAuthError("Verification could not be completed. Please try again.");
                console.error("Verification incomplete, error=", result);
            }
        } catch (error: unknown) {
            const clerkError = error as { errors?: ClerkAPIError[] };
            setAuthError(
                clerkError.errors?.[0]?.message || "Invalid verification code. Please try again."
            );
        } finally {
            setIsVerifying(false);
        }
    }

    const handleResendCode = async () => {
        if (!isLoaded || !signIn) return;
        
        setAuthError(null);
        
        try {
            // Get email address ID from current sign-in state
            const emailFactor = signIn.supportedFirstFactors?.find(
                (factor) => factor.strategy === "email_code"
            );
            if (emailFactor && 'emailAddressId' in emailFactor) {
                await signIn.prepareFirstFactor({
                    strategy: "email_code",
                    emailAddressId: emailFactor.emailAddressId
                });
            }
        } catch (error: unknown) {
            const clerkError = error as { errors?: ClerkAPIError[] };
            setAuthError(
                clerkError.errors?.[0]?.message || "Failed to resend code. Please try again."
            );
        }
    }
   
    return (
    <Card className="w-full max-w-md shadow-xl text-center">
      <CardHeader className="space-y-1 items-center pb-2">
        <CardTitle className="text-2xl font-bold text-foreground">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center">
          Sign in to access your secure cloud storage
        </CardDescription>
      </CardHeader>

      <Separator className="my-2" />

      <CardContent className="py-6">
        {authError && (
          <div className="bg-destructive/15 text-destructive p-4 rounded-md mb-6 flex items-center gap-2 text-sm font-medium">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <p>{authError}</p>
          </div>
        )}

        {needsSecondFactor ? (
          /* Verification Code UI */
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <ShieldCheck className="h-12 w-12 mx-auto text-primary" />
              <h3 className="text-lg font-semibold">Verify Your Identity</h3>
              <p className="text-sm text-muted-foreground">
                We&apos;ve sent a verification code to your email address. Please enter it below.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verificationCode">Verification Code</Label>
              <Input
                id="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={6}
              />
            </div>

            <Button
              type="button"
              className="w-full"
              onClick={handleVerifyCode}
              disabled={isVerifying || verificationCode.length < 6}
            >
              {isVerifying && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isVerifying ? "Verifying..." : "Verify Code"}
            </Button>

            <div className="flex justify-between items-center text-sm">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResendCode}
                className="text-muted-foreground hover:text-foreground"
              >
                Resend Code
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setNeedsSecondFactor(false);
                  setVerificationCode("");
                  setAuthError(null);
                }}
                className="text-muted-foreground hover:text-foreground"
              >
                Back to Sign In
              </Button>
            </div>
          </div>
        ) : (
          /* Sign In Form */
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="identifier">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="identifier"
                  type="email"
                  placeholder="your.email@example.com"
                  className={`pl-9 ${errors.identifier ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("identifier")}
                />
              </div>
              {errors.identifier && (
                <p className="text-sm text-destructive font-medium">
                  {errors.identifier.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`pl-9 pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  {...register("password")}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                  <span className="sr-only">Toggle password visibility</span>
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div id="clerk-captcha"></div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        )}
      </CardContent>

      <Separator className="mb-4" />

      <CardFooter className="flex justify-center pb-6">
        <p className="text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
