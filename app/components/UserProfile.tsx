"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Mail, User, LogOut, Shield, ArrowRight, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils"; // Assuming you have the standard utils helper

export default function UserProfile() {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();

  if (!isLoaded) {
    return (
      <div className="flex flex-col justify-center items-center p-12 h-full min-h-[300px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <Card className="max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center gap-3 pb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <User className="h-5 w-5 text-primary" />
          </div>
          <CardTitle className="text-xl">User Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="text-center py-10">
          <div className="mb-6 flex flex-col items-center">
            <Avatar className="h-20 w-20 mb-4">
              <AvatarFallback className="bg-muted text-2xl">?</AvatarFallback>
            </Avatar>
            <p className="text-lg font-medium">Not Signed In</p>
            <p className="text-muted-foreground mt-2">
              Please sign in to access your profile
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/sign-in")}
            className="px-8"
          >
            Sign In
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const email = user.primaryEmailAddress?.emailAddress || "";
  const initials = fullName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase();

  const userRole = user.publicMetadata.role as string | undefined;

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  const isEmailVerified = user.emailAddresses?.[0]?.verification?.status === "verified";

  return (
    <Card className="max-w-md mx-auto shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center gap-3 pb-4">
        <div className="bg-primary/10 p-2 rounded-full">
          <User className="h-5 w-5 text-primary" />
        </div>
        <CardTitle className="text-xl">User Profile</CardTitle>
      </CardHeader>
      
      <Separator />
      
      <CardContent className="py-6">
        <div className="flex flex-col items-center text-center mb-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.imageUrl} alt={fullName} />
            <AvatarFallback className="text-lg">{initials}</AvatarFallback>
          </Avatar>
          
          <h3 className="text-xl font-semibold">{fullName}</h3>
          
          {email && (
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <span>{email}</span>
            </div>
          )}
          
          {userRole && (
            <Badge variant="secondary" className="mt-3">
              {userRole}
            </Badge>
          )}
        </div>

        <Separator className="my-4" />

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Shield className="h-4 w-4 text-primary" />
              <span>Account Status</span>
            </div>
            {/* Custom green badge style using Tailwind utility classes on standard Badge */}
            <Badge className="bg-green-500/15 text-green-700 hover:bg-green-500/25 shadow-none border-0">
              Active
            </Badge>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Mail className="h-4 w-4 text-primary" />
              <span>Email Verification</span>
            </div>
            <Badge 
              variant="outline"
              className={cn(
                "border-0 shadow-none",
                isEmailVerified 
                  ? "bg-green-500/15 text-green-700 hover:bg-green-500/25" 
                  : "bg-yellow-500/15 text-yellow-700 hover:bg-yellow-500/25"
              )}
            >
              {isEmailVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </div>
      </CardContent>
      
      <Separator />
      
      <CardFooter className="flex justify-between pt-6">
        <Button
          variant="destructive"
          className="w-full"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </CardFooter>
    </Card>
  );
}