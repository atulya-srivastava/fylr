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
import { Label } from "@radix-ui/react-label"
import { Separator } from "@radix-ui/react-separator"
import { AlertCircle, Mail, EyeOff, Eye, Loader2, Link, Lock } from "lucide-react"

export default function SignInForm(){
    const router = useRouter()
    const {signIn, isLoaded, setActive}= useSignIn()
    const [isSubmitting, setIsSubmitting]=useState<boolean>(false)
    const [authError, setAuthError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false);

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
            }else{
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
   
    return (
    <Card className="w-full max-w-md shadow-xl border-slate-200 bg-slate-50/50">
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
