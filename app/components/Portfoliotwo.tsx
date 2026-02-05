"use client"
import React from 'react';
import Image from 'next/image';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight, 
  Terminal,
  ChevronDown
} from 'lucide-react';

// --- COMPONENTS ---

const Nav = () => (
  <nav className="flex justify-between items-center py-6 px-6 md:px-12 max-w-7xl mx-auto absolute top-0 left-0 right-0 z-50">
    <div className="text-xl md:text-2xl font-cursive text-neutral-200">
      Atulya Srivastava
    </div>
    <div className="hidden md:flex items-center gap-8 text-sm font-mono text-neutral-400">
      <a href="#portfolio" className="hover:text-white transition-colors">Portfolio</a>
      <a href="#experience" className="hover:text-white transition-colors">Experience</a>
      <a href="#about" className="hover:text-white transition-colors">About me</a>
      <button className="px-5 py-2 bg-neutral-800 text-white rounded hover:bg-neutral-700 transition-colors border border-neutral-700">
        Contact me
      </button>
    </div>
    {/* Mobile Menu Icon Placeholder */}
    <div className="md:hidden text-white">
      <div className="space-y-1.5 cursor-pointer">
        <span className="block w-6 h-0.5 bg-white"></span>
        <span className="block w-6 h-0.5 bg-white"></span>
      </div>
    </div>
  </nav>
);

const Hero = () => (
  <section className="relative min-h-screen flex flex-col md:flex-row items-center justify-center max-w-7xl mx-auto px-6 md:px-12 pt-24 md:pt-0">
    
    {/* Left Content */}
    <div className="flex-1 z-10 space-y-8 md:pr-12">
      <div className="space-y-2">
        <span className="font-cursive text-2xl text-neutral-400 block mb-4">
          Atulya Srivastava
        </span>
        <h1 className="text-4xl md:text-6xl font-mono font-bold text-white leading-tight">
          Your go-to engineer <br />
          for <span className="text-neutral-400">Next.js</span> projects
        </h1>
      </div>
      
      <p className="text-neutral-400 max-w-lg leading-relaxed text-sm md:text-base">
        Bringing your ideas to life with clean, efficient, and scalable code. 
        Whether it&apos;s building complex web apps like <strong>Fylr</strong>, optimizing performance, 
        or solving algorithmic challenges.
      </p>

      <div className="flex items-center gap-6 pt-4">
        <button className="px-8 py-3 bg-neutral-200 text-black font-mono font-bold text-sm rounded hover:bg-white transition-colors">
          Contact me
        </button>
        <a href="#portfolio" className="text-white text-sm font-mono flex items-center gap-2 hover:underline underline-offset-4">
          View projects <ArrowRight size={16} />
        </a>
      </div>
    </div>

    {/* Right Image / Graphic Area */}
    <div className="flex-1 relative w-full h-[500px] flex items-center justify-center mt-12 md:mt-0">
      {/* The Grid Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: `linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          maskImage: 'radial-gradient(circle, black 40%, transparent 70%)'
        }}>
      </div>
      
      {/* Decorative Floating Squares */}
      <div className="absolute top-10 right-20 w-16 h-16 border border-neutral-700 bg-neutral-900/50 backdrop-blur-sm z-0 animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-24 h-24 border border-neutral-800 bg-black z-0"></div>

      {/* Main Profile Image Placeholder - Replace src with your cutout photo */}
      <div className="relative z-10 grayscale hover:grayscale-0 transition-all duration-700">
        {/* If you don't have a photo yet, this is a stylish placeholder */}
        <div className="w-80 h-96 bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-center relative overflow-hidden rounded-sm">
           <Terminal size={64} className="text-neutral-700 mb-4" />
           <p className="font-mono text-neutral-600 text-xs uppercase tracking-widest">System Online</p>
           <p className="font-cursive text-neutral-500 text-xl mt-2">Atulya.tsx</p>
           
           {/* Scanline effect */}
           <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neutral-800/10 to-transparent w-full h-full pointer-events-none animate-scan"></div>
        </div>
      </div>
    </div>

    {/* Scroll Hint */}
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-neutral-600 animate-bounce">
       <ChevronDown size={24} />
    </div>
  </section>
);

const SectionHeader = ({ title, subtitle }: { title: string, subtitle: string }) => (
  <div className="mb-16">
    <span className="font-mono text-xs tracking-[0.2em] text-neutral-500 uppercase block mb-3">
      {subtitle}
    </span>
    <h2 className="text-3xl md:text-4xl font-mono font-bold text-white">
      {title}
    </h2>
  </div>
);

const ProjectCard = ({ title, category, desc, stack }: { title: string, category: string, desc: string, stack: string[] }) => (
  <div className="group relative border-t border-neutral-800 py-10 transition-colors hover:bg-neutral-900/30">
    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-4">
      <div className="md:w-1/3">
        <span className="font-mono text-xs text-neutral-500 mb-2 block">{category}</span>
        <h3 className="text-2xl font-bold text-white group-hover:translate-x-2 transition-transform duration-300 flex items-center gap-2">
          {title} <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
        </h3>
      </div>
      
      <div className="md:w-1/3">
        <p className="text-neutral-400 text-sm leading-relaxed">{desc}</p>
      </div>

      <div className="md:w-1/4 flex flex-wrap gap-2 justify-start md:justify-end">
        {stack.map((tech) => (
          <span key={tech} className="text-[10px] font-mono border border-neutral-800 text-neutral-400 px-2 py-1 rounded uppercase">
            {tech}
          </span>
        ))}
      </div>
    </div>
  </div>
);

const StatCard = ({ label, value, sub }: { label: string, value: string, sub?: string }) => (
  <div className="bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-between h-full">
    <div className="text-neutral-500 mb-4 font-mono text-xs uppercase tracking-widest">{label}</div>
    <div>
      <div className="text-3xl md:text-4xl font-bold text-white mb-1 font-mono">{value}</div>
      {sub && <div className="text-xs text-neutral-400">{sub}</div>}
    </div>
  </div>
);

// --- MAIN PAGE ---

export default function Portfolio() {
  return (
    <div className="bg-black min-h-screen text-white selection:bg-neutral-700 selection:text-white">
      <Nav />
      <Hero />

      <main className="max-w-7xl mx-auto px-6 md:px-12 pb-24 space-y-32">
        
        {/* --- PORTFOLIO SECTION --- */}
        <section id="portfolio">
          <SectionHeader subtitle="Portfolio" title="Discover what I've created" />
          
          <div className="flex flex-col">
            <ProjectCard 
              title="Fylr"
              category="CLOUD ARCHITECTURE"
              desc="A secure cloud storage solution featuring drag-and-drop uploads, folder hierarchy management, and robust file security."
              stack={["Next.js", "Drizzle", "Neon DB"]}
            />
            <ProjectCard 
              title="Policy Pilot"
              category="AI GOVERNANCE"
              desc="Bridging the gap between citizens and government schemes using LLMs for context-aware recommendations."
              stack={["React", "OpenAI", "Node.js"]}
            />
            <ProjectCard 
              title="MyHonestMessage"
              category="SOCIAL PLATFORM"
              desc="Anonymous messaging platform handling real-time data streams with a focus on user privacy and clean UI."
              stack={["Next.js", "MongoDB", "Prisma"]}
            />
            <ProjectCard 
              title="HackQuest '25 Winner"
              category="HACKATHON"
              desc="Built a context-aware search tool using n8n and VectorDB with Team SEAM."
              stack={["n8n", "VectorDB", "Next.js"]}
            />
          </div>
        </section>

        {/* --- STATS / GITHUB / LEETCODE --- */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
             <SectionHeader subtitle="Metrics" title="Code Activity" />
          </div>
          
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StatCard label="LeetCode" value="300+" sub="Problems Solved" />
            <StatCard label="Experience" value="Intern" sub="Neelam Packers (May-Jul '25)" />
            
            {/* Github Graph Visualization Wrapper */}
            <div className="sm:col-span-2 bg-neutral-900/50 border border-neutral-800 p-6 flex flex-col justify-center items-center">
              <div className="w-full flex justify-between items-center mb-4">
                 <span className="text-neutral-500 font-mono text-xs uppercase tracking-widest">Github Contributions</span>
                 <Github size={16} className="text-neutral-400" />
              </div>
              {/* Invert filter to make graph white on black */}
              <Image 
                src="https://ghchart.rshah.org/ffffff/atulya76" 
                alt="Github Chart" 
                width={800}
                height={128}
                className="w-full opacity-60 hover:opacity-100 transition-opacity"
                unoptimized
              />
            </div>
          </div>
        </section>

        {/* --- FOOTER --- */}
        <footer className="border-t border-neutral-900 pt-12 pb-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-cursive text-xl text-neutral-500">Atulya.</div>
          <div className="flex gap-6">
            <a href="https://github.com/atulya76" className="text-neutral-500 hover:text-white transition-colors"><Github size={20} /></a>
            <a href="https://linkedin.com/in/atulya-srivastava" className="text-neutral-500 hover:text-white transition-colors"><Linkedin size={20} /></a>
            <a href="mailto:your-email@example.com" className="text-neutral-500 hover:text-white transition-colors"><Mail size={20} /></a>
          </div>
          <div className="text-neutral-600 text-xs font-mono">
            © {new Date().getFullYear()} All rights reserved.
          </div>
        </footer>

      </main>
    </div>
  );
}