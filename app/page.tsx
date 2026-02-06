import React from 'react';
import Link from 'next/link';
import { 
  CloudUpload, 
  FolderOpen, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  FileImage, 
  FileText, 
  LayoutGrid, 
  Github
} from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import Navbar from './components/NavBar';
import FylrHeroSection from './components/HeroSection';

export default async function FylrLanding() {
  const user = await currentUser();
  
  // Serialize user data for the Navbar component
  const serializedUser = user
    ? {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        username: user.username,
        emailAddress: user.emailAddresses?.[0]?.emailAddress,
      }
    : null;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20 selection:text-primary">
      {/* --- Navbar --- */}
      {/* <header className="sticky top-0 z-50 w-full border-b border-border/10 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CloudUpload className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">Fylr</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#about" className="hover:text-primary transition-colors">About</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/sign-in" className="text-sm font-medium hover:text-primary transition-colors hidden sm:block">
              Log in
            </Link>
            <Link 
              href="/sign-up" 
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header> */}
      <Navbar user={serializedUser} />

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          {/* Background Gradient Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[800px] opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 text-center">
            {/* <div className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1 text-sm text-muted-foreground mb-6">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2"></span>
              v1.0 is now live
            </div> */}
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Your files, <span className="text-primary">organized</span>. <br className="hidden md:block"/>
              Available everywhere.
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground mb-8">
              Securely upload, organize, and share your documents and media. 
              The folder structure you love, with the speed you need.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/dashboard" 
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105"
              >
                Go to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
              <Link 
                href="https://github.com/atulya-srivastava/fylr" 
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="mr-2 h-5 w-5 " />
                View on GitHub
              </Link>
            </div>

            {/* Dashboard Preview Mockup */}
            <div className="mt-16 mx-auto max-w-5xl rounded-xl border border-border bg-card/50 p-2 shadow-2xl backdrop-blur-sm">
              <div className="rounded-lg bg-background overflow-hidden border border-border/50 aspect-video relative group">
                {/* Placeholder for your actual dashboard screenshot */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10"></div>
                
                {/* Mock UI Structure representing your screenshot */}
                <div className="w-full h-full flex">
                    <div className="w-64 border-r border-border p-4 hidden md:block bg-card/30">
                        <div className="h-8 w-24 bg-primary/20 rounded mb-8"></div>
                        <div className="space-y-3">
                            <div className="h-4 w-full bg-muted/20 rounded"></div>
                            <div className="h-4 w-3/4 bg-muted/20 rounded"></div>
                            <div className="h-4 w-5/6 bg-muted/20 rounded"></div>
                        </div>
                    </div>
                    <div className="flex-1 p-6">
                        <div className="flex justify-between mb-8">
                            <div className="h-8 w-48 bg-muted/20 rounded"></div>
                            <div className="h-8 w-8 rounded-full bg-primary/20"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="h-32 rounded-lg border border-border bg-card flex items-center justify-center">
                                <FileImage className="h-10 w-10 text-muted-foreground/50" />
                           </div>
                           <div className="h-32 rounded-lg border border-border bg-card flex items-center justify-center">
                                <FolderOpen className="h-10 w-10 text-primary/50" />
                           </div>
                           <div className="h-32 rounded-lg border border-border bg-card flex items-center justify-center">
                                <FileText className="h-10 w-10 text-muted-foreground/50" />
                           </div>
                        </div>
                    </div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border text-sm font-medium">
                        Preview of your dashboard
                    </span>
                </div>
              </div>
            </div>
          </div>
        </section>
        <FylrHeroSection/>

        {/* --- Features Section --- */}
        <section id="features" className="py-16 md:py-24 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight mb-4">Everything you need to manage files</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fylr isn&apos;t just a bucket. It&apos;s a complete file management system designed for ease of use and organization.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard 
                icon={<FolderOpen className="h-6 w-6 text-primary" />}
                title="Smart Folders"
                description="Create nested folder structures to keep your project files, images, and documents organized exactly how you like."
              />
              <FeatureCard 
                icon={<LayoutGrid className="h-6 w-6 text-primary" />}
                title="Media Gallery"
                description="Built-in support for JPG, PNG, and WebP previews. View your images directly in the dashboard without downloading."
              />
              <FeatureCard 
                icon={<Zap className="h-6 w-6 text-primary" />}
                title="Lightning Fast"
                description="Optimized uploads and downloads. Drag and drop your files and watch them sync instantly."
              />
              <FeatureCard 
                icon={<ShieldCheck className="h-6 w-6 text-primary" />}
                title="Secure Storage"
                description="Your data is encrypted and private. Only you have access to your personal file vault."
              />
            </div>
          </div>
        </section>

        {/* --- CTA Section --- */}
        <section className="py-24">
          <div className="container mx-auto px-4 md:px-6">
            <div className="relative rounded-3xl overflow-hidden bg-card border border-border px-6 py-16 md:px-12 md:py-20 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Ready to organize your digital life?
                </h2>
                <p className="text-muted-foreground max-w-xl mx-auto mb-8 text-lg">
                  Join Fylr today and experience the simplest way to manage your cloud storage.
                </p>
                <Link 
                  href="/sign-up" 
                  className="inline-flex h-12 items-center justify-center rounded-md bg-primary px-8 text-base font-medium text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:scale-105"
                >
                  Start Uploading for Free
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* --- Footer --- */}
      <footer className="border-t border-border bg-background py-8">
        <div className="container mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <CloudUpload className="h-5 w-5 text-primary" />
            <span className="font-semibold">Fylr</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Fylr. Built with Next.js and Tailwind.
          </p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="h-5 w-5 bg-muted rounded-full" />
            <div className="h-5 w-5 bg-muted rounded-full" />
            <div className="h-5 w-5 bg-muted rounded-full" />
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="rounded-xl border border-border bg-background p-6 transition-all hover:shadow-lg hover:border-primary/50 group">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-card border border-border group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </div>
  );
}