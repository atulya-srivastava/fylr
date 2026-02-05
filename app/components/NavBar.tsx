"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useClerk, SignedIn, SignedOut } from "@clerk/nextjs";
import {
  CloudUpload,
  Menu,
  User,
  LogOut,
  LayoutDashboard,
  FileText,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "@/app/components/ThemeToggle";

// shadcn/ui imports
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface SerializedUser {
  id: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  username?: string | null;
  emailAddress?: string | null;
}

interface NavbarProps {
  user?: SerializedUser | null;
}

export default function Navbar({ user }: NavbarProps) {
  const { signOut } = useClerk();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Check if we're on the dashboard page
  const isOnDashboard =
    pathname === "/dashboard" || pathname?.startsWith("/dashboard/");

  // Handle scroll effect for shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSignOut = () => {
    signOut(() => {
      router.push("/");
    });
  };

  // Process user data
  const userDetails = {
    fullName: user
      ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
      : "",
    initials: user
      ? `${user.firstName || ""} ${user.lastName || ""}`
          .trim()
          .split(" ")
          .map((name) => name?.[0] || "")
          .join("")
          .toUpperCase() || "U"
      : "U",
    displayName: user
      ? user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : user.firstName || user.username || user.emailAddress || "User"
      : "User",
    email: user?.emailAddress || "",
  };

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow ${
        isScrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-10">
          <CloudUpload className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Fylr</h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-4 items-center">
          <SignedOut>
            <ThemeToggle />
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <div className="flex items-center gap-4">
              {!isOnDashboard && (
                <Link href="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
              )}

              <ThemeToggle />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="pl-0 pr-2 gap-2 hover:bg-transparent"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.imageUrl || undefined} />
                      <AvatarFallback>{userDetails.initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium hidden sm:inline-block">
                      {userDetails.displayName}
                    </span>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {userDetails.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {userDetails.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push("/dashboard?tab=profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push("/dashboard")}>
                    <FileText className="mr-2 h-4 w-4" />
                    My Files
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={handleSignOut}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </SignedIn>
        </div>

        {/* Mobile Navigation (Sheet) */}
        <div className="md:hidden">
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[385px] pt-10">
              <SheetHeader className="mb-6 text-left">
                <SheetTitle className="flex items-center gap-2">
                  <CloudUpload className="h-6 w-6 text-primary" />
                  Fylr
                </SheetTitle>
              </SheetHeader>

              <SignedOut>
                <div className="flex flex-col gap-3 mt-4">
                  <Link href="/sign-in" onClick={() => setIsSheetOpen(false)}>
                    <Button variant="outline" className="w-full justify-start">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsSheetOpen(false)}>
                    <Button className="w-full justify-start">Sign Up</Button>
                  </Link>
                </div>
              </SignedOut>

              <SignedIn>
                <div className="flex flex-col gap-6">
                  {/* User Profile Summary */}
                  <div className="flex items-center gap-3 pb-6 border-b">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.imageUrl || undefined} />
                      <AvatarFallback>{userDetails.initials}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-medium truncate">
                        {userDetails.displayName}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {userDetails.email}
                      </p>
                    </div>
                  </div>

                  {/* Nav Links */}
                  <div className="flex flex-col gap-2">
                    {!isOnDashboard && (
                      <Link
                        href="/dashboard"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    )}
                    <Link
                      href="/dashboard?tab=profile"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Button>
                    </Link>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-2"
                      >
                        <FileText className="h-4 w-4" />
                        My Files
                      </Button>
                    </Link>

                    <div className="flex items-center justify-between pt-4 mt-2 border-t">
                      <span className="text-sm text-muted-foreground">Theme</span>
                      <ThemeToggle />
                    </div>
                    
                    <div className="pt-4 mt-2 border-t">
                        <Button
                          variant="ghost"
                          className="w-full justify-start gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => {
                            setIsSheetOpen(false);
                            handleSignOut();
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out
                        </Button>
                    </div>
                  </div>
                </div>
              </SignedIn>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}