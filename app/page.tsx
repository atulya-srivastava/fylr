import React from 'react';
import Link from 'next/link';
import { 
  CloudUpload, 
  FolderOpen, 
  ShieldCheck, 
  Zap, 
  ChevronRight, 
  LayoutGrid, 
  Github
} from 'lucide-react';
import { currentUser } from '@clerk/nextjs/server';
import Navbar from './components/NavBar';
import FylrHeroSection from './components/HeroSection';

export default async function FylrLanding() {
  const user = await currentUser();
  const isSignedIn = !!user;
  
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
    
      <Navbar user={serializedUser} />

      <main className="flex-1">
        {/* --- Hero Section --- */}
        <section className="relative overflow-hidden pt-16 md:pt-24 lg:pt-32 pb-16">
          {/* Background Gradient Blob */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-[500px] w-[800px] opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--primary)_0%,_transparent_70%)] blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6">
              Your files, <span className="text-primary">organized</span>. <br className="hidden md:block"/>
              Available everywhere.
            </h1>
            
            <p className="mx-auto max-w-[700px] text-lg text-muted-foreground mb-8">
              Securely upload, organize, and share your documents and media. 
              The folder structure you love, with the speed you need.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
             {isSignedIn ? (
              <Link 
                href="/dashboard" 
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105"
              >
                Go to Dashboard
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
             ) : (
              <Link 
                href="/sign-in"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-all hover:bg-primary/90 hover:scale-105"
              >
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
             )}
              <Link 
                href="https://github.com/atulya-srivastava/fylr" 
                className="inline-flex h-11 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <Github className="mr-2 h-5 w-5 " />
                View on GitHub
              </Link>
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