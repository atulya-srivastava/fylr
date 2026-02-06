"use client";
import React from 'react';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  CloudUpload, 
  FolderPlus, 
  ImagePlus, 
  FileText, 
  Sun,
  ChevronDown,
  UploadCloud,
  FileImage,
  ChevronLeft
} from 'lucide-react';

export default function FylrHeroSection() {
  return (
    // 1. BACKGROUND: We add the 'dark' class to force the dark theme variables from your CSS.
    // The lamp effect requires a dark background to be visible.
    <div className="dark min-h-screen bg-background text-foreground overflow-hidden flex flex-col items-center pt-20 pb-20 relative selection:bg-primary/30">
      
      {/* --- 1. THE LOGO (Layer: Top) --- */}
      <div className="relative z-30 -top-6 flex flex-col items-center">
        <h1 className="font-sans text-[10rem] md:text-[14rem] leading-[0.8] font-bold drop-shadow-2xl opacity-90 select-none">
          fylr
        </h1>
      </div>

      {/* --- 2. THE LAMP (Layer: Bottom) --- */}
      {/* Positioned to glow from under the text */}
      <div className="relative z-10 w-full -mt-18 h-[400px] flex justify-center pointer-events-none">
         <LampContainer />
      </div>

      {/* --- 3. THE DASHBOARD (Layer: Middle) --- */}
      {/* Pulled up into the light beam */}
      <div className="relative z-20 -mt-72 w-full max-w-[1400px] px-6">
        
        {/* Top Highlight - The light hitting the top edge */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-2/3 h-20 bg-primary/20 blur-[60px] rounded-full pointer-events-none mix-blend-screen" />

        {/* Dashboard Container - Glassmorphic Effect */}
        {/* Changed bg-[#0A0A0A] to bg-card/40 for transparency */}
        <div className="relative rounded-xl border border-border/50 bg-card/40 shadow-2xl overflow-hidden backdrop-blur-xl transform transition-transform duration-700 hover:scale-[1.005]">
            
            {/* Top Navigation Bar */}
            <div className="h-14 border-b border-border/50 flex items-center justify-between px-6 bg-card/20">
                <div className="flex items-center gap-2 text-foreground font-semibold text-lg">
                    <CloudUpload className="text-primary h-5 w-5" />
                    <span>Fylr</span>
                </div>
                <div className="flex items-center gap-4">
                    <Sun className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer" />
                    <div className="flex items-center gap-2 cursor-pointer">
                        <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                            AT
                        </div>
                        <span className="text-sm text-muted-foreground hidden sm:block">atulya@email.com</span>
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </div>
                </div>
            </div>

            {/* Dashboard Content */}
            <div className="p-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold mb-1 text-foreground">
                        Hi, <span className="text-primary">atulya</span>!
                    </h2>
                    <p className="text-muted-foreground">Your images are waiting for you.</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-6 border-b border-border/50 mb-8">
                    <button className="pb-3 border-b-2 border-primary text-foreground font-medium text-sm flex items-center gap-2">
                        <FileText className="h-4 w-4" /> My Files
                    </button>
                    <button className="pb-3 border-b-2 border-transparent text-muted-foreground font-medium text-sm hover:text-foreground transition-colors flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border border-current" /> Profile
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[350px_1fr] gap-8">
                    {/* LEFT COLUMN: UPLOAD */}
                    <div className="space-y-4">
                        <div className="bg-secondary/30 border border-border/50 rounded-xl p-5">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="bg-destructive/10 p-2 rounded-lg text-destructive">
                                        <UploadCloud className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-foreground">Upload</h3>
                                        <p className="text-xs text-muted-foreground">to <span className="text-foreground font-medium">Home</span></p>
                                    </div>
                                </div>
                                <ChevronLeft className="h-4 w-4 text-muted-foreground rotate-180" />
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                <button className="flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary text-foreground py-2 rounded-lg text-sm transition-colors border border-border/50">
                                    <FolderPlus className="h-4 w-4" /> New Folder
                                </button>
                                <button className="flex items-center justify-center gap-2 bg-secondary/50 hover:bg-secondary text-foreground py-2 rounded-lg text-sm transition-colors border border-border/50">
                                    <ImagePlus className="h-4 w-4" /> Add Image
                                </button>
                            </div>

                            <div className="border-2 border-dashed border-border/50 rounded-xl h-40 flex flex-col items-center justify-center text-center p-4 bg-background/40 group hover:border-primary/50 transition-colors cursor-pointer">
                                <div className="bg-secondary/50 p-3 rounded-full mb-3 group-hover:scale-110 transition-transform">
                                    <UploadCloud className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground mb-1">
                                    Drag and drop your image here, or <span className="text-primary hover:underline">browse</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: FILE LIST */}
                    <div className="bg-secondary/30 border border-border/50 rounded-xl flex flex-col h-full min-h-[300px]">
                        <div className="p-5 border-b border-border/50">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="bg-primary/10 p-1.5 rounded text-primary">
                                    <FileText className="h-4 w-4" />
                                </div>
                                <h3 className="font-semibold text-foreground">Your Files</h3>
                            </div>
                            
                             <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-2 py-3 border-b border-border/50 text-xs font-medium text-muted-foreground">
                                <div>Name</div>
                                <div>Size</div>
                                <div>Added</div>
                            </div>
                            
                            <div className="grid grid-cols-[2fr_1fr_1fr] gap-4 px-2 py-4 items-center text-sm border-b border-border/50 hover:bg-secondary/50 transition-colors">
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <div className="h-8 w-8 rounded bg-primary/20 flex-shrink-0 flex items-center justify-center">
                                         <FileImage className="h-4 w-4 text-primary" />
                                    </div>
                                    <span className="text-foreground truncate">demo-image.jpg</span>
                                </div>
                                <div className="text-muted-foreground text-xs">2.4 MB</div>
                                <div className="text-muted-foreground text-xs">Just now</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Subtle Gradient Overlay for glossiness */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-foreground/5 to-transparent opacity-20" />
        </div>
      </div>
    </div>
  );
}

// --- LAMP COMPONENT ---
function LampContainer({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex flex-col items-center justify-center overflow-hidden bg-transparent w-full rounded-md z-0", className)}>
      <div className="relative flex w-full flex-1 scale-y-125 items-center justify-center isolate z-0 ">
        
        {/* LEFT CONE */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          // Using 'from-primary' to match your theme color
          className="absolute inset-auto right-1/2 h-56 overflow-visible w-[30rem] bg-gradient-conic from-primary via-transparent to-transparent text-white [--conic-position:from_70deg_at_center_top]"
        >
          {/* MASKING: Must match bg-background (which is dark due to parent class) */}
          <div className="absolute w-[100%] left-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          <div className="absolute w-40 h-[100%] left-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
        </motion.div>

        {/* RIGHT CONE */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{ backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))` }}
          // Using 'to-primary'
          className="absolute inset-auto left-1/2 h-56 w-[30rem] bg-gradient-conic from-transparent via-transparent to-primary text-white [--conic-position:from_290deg_at_center_top]"
        >
          {/* MASKING: Must match bg-background */}
          <div className="absolute w-40 h-[100%] right-0 bg-background bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
          <div className="absolute w-[100%] right-0 bg-background h-40 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
        </motion.div>

        {/* GLOWS */}
        {/* Using bg-background for seamless blending */}
        <div className="absolute top-1/2 h-48 w-full translate-y-12 scale-x-150 bg-background blur-2xl"></div>
        <div className="absolute top-1/2 z-50 h-48 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
        <div className="absolute inset-auto z-50 h-36 w-[28rem] -translate-y-1/2 rounded-full bg-primary opacity-50 blur-3xl"></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-30 h-36 w-64 -translate-y-[6rem] rounded-full bg-primary blur-2xl"
        ></motion.div>
        
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-auto z-50 h-0.5 w-[30rem] -translate-y-[7rem] bg-primary "
        ></motion.div>

        {/* Top Cap Mask */}
        <div className="absolute inset-auto z-40 h-44 w-full -translate-y-[12.5rem] bg-background "></div>
      </div>
    </div>
  );
}