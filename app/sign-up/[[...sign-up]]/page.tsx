import Navbar from "@/app/components/NavBar";
import SignUpForm from "@/app/components/SignUpForm";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      {/* Unified Navbar component */}
      <Navbar />

      <main className="flex-1 flex flex-col justify-center items-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-8">
             <SignUpForm />
        </div>
      </main>

      {/* Minimal footer using semantic colors */}
      <footer className="py-6 border-t bg-background/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fylr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}