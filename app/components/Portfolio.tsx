import React from 'react';
import Image from 'next/image';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowUpRight, 
  Terminal, 
  Cpu, 
  Code2, 
  GitCommit
} from 'lucide-react';

// --- Components ---

const Badge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/50">
    {children}
  </span>
);

const Card = ({ className, children }: { className?: string, children: React.ReactNode }) => (
  <div className={`bg-zinc-900/50 border border-zinc-800/60 p-6 rounded-3xl hover:bg-zinc-900 transition-colors duration-300 ${className}`}>
    {children}
  </div>
);

// --- Main Portfolio ---

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-white selection:text-black p-4 md:p-12">
      
      <div className="max-w-5xl mx-auto space-y-4">
        
        {/* --- HEADER / HERO ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* INTRO CARD - Spans 2 columns */}
          <Card className="md:col-span-2 flex flex-col justify-between min-h-[300px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Online • IIIT Bhagalpur</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-zinc-100 tracking-tight">
                I&apos;m Atulya.
              </h1>
              <p className="text-lg text-zinc-400 max-w-md">
                I build systems that scale. Full Stack Engineer focused on Next.js, Cloud Architecture, and solving algorithmic problems.
              </p>
            </div>
            
            <div className="flex gap-4 mt-8">
              <SocialLink href="https://github.com/atulya76" icon={<Github size={18} />} label="GitHub" />
              <SocialLink href="https://linkedin.com/in/atulya-srivastava" icon={<Linkedin size={18} />} label="LinkedIn" />
              <SocialLink href="mailto:your-email@example.com" icon={<Mail size={18} />} label="Email" />
            </div>
          </Card>

          {/* STATUS / CURRENT FOCUS CARD */}
          <Card className="md:col-span-1 flex flex-col justify-center space-y-6">
             <div>
                <h3 className="text-zinc-100 font-semibold mb-2 flex items-center gap-2">
                  <Terminal size={16} /> Current Focus
                </h3>
                <p className="text-sm leading-relaxed">
                   Deep diving into <strong>System Design</strong> and <strong>Embedded Systems</strong>. Currently optimizing backend performance for <em>Fylr</em>.
                </p>
             </div>
             <div className="pt-4 border-t border-zinc-800">
                <h3 className="text-zinc-100 font-semibold mb-2 flex items-center gap-2">
                  <Cpu size={16} /> Stack
                </h3>
                <div className="flex flex-wrap gap-2">
                  <Badge>Next.js</Badge>
                  <Badge>Rust</Badge>
                  <Badge>PostgreSQL</Badge>
                  <Badge>Docker</Badge>
                </div>
             </div>
          </Card>
        </div>

        {/* --- EXPERIENCE & STATS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* GITHUB GRAPH - Spans 2 cols */}
          <Card className="md:col-span-2 overflow-hidden relative group">
             <div className="flex justify-between items-center mb-4">
                <h3 className="text-zinc-100 font-semibold flex items-center gap-2">
                  <GitCommit size={18} /> Contributions
                </h3>
                <span className="text-xs text-zinc-500">2024 - 2025</span>
             </div>
             {/* Invert filter makes the graph white-ish to match dark theme */}
             <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
               <Image 
                  src="https://ghchart.rshah.org/404040/atulya76" 
                  alt="GitHub Chart" 
                  width={800}
                  height={128}
                  className="w-full grayscale brightness-200 contrast-125"
                  unoptimized
                />
             </div>
          </Card>

          {/* LEETCODE STATS - Spans 1 col */}
          <Card className="md:col-span-1 flex flex-col justify-center items-center text-center">
             <div className="p-3 bg-zinc-800/50 rounded-full mb-3 text-yellow-500">
               <Code2 size={24} />
             </div>
             <span className="text-3xl font-bold text-zinc-100">300+</span>
             <span className="text-xs text-zinc-500 uppercase tracking-wide mt-1">Problems Solved</span>
             <div className="w-full h-1 bg-zinc-800 mt-4 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600 w-[60%]"></div>
             </div>
          </Card>

          {/* EXPERIENCE HIGHLIGHT - Spans 1 col */}
          <Card className="md:col-span-1 flex flex-col justify-between">
            <div>
              <div className="text-xs font-mono text-zinc-500 mb-2">MAY &apos;25 — JUL &apos;25</div>
              <h3 className="text-zinc-100 font-bold text-lg">Neelam Packers</h3>
              <p className="text-sm mt-1">Frontend Developer Intern</p>
            </div>
            <div className="mt-4 text-sm text-zinc-500">
              React • Performance • UI/UX
            </div>
          </Card>

        </div>

        {/* --- PROJECTS ROW --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <ProjectCard 
            title="Fylr"
            subtitle="Secure Cloud Storage"
            desc="A robust file management system featuring drag-and-drop uploads, folder structures, and secure authentication."
            tags={["Next.js", "Drizzle", "Neon DB"]}
          />

          <ProjectCard 
            title="POLICY PILOT"
            subtitle="AI Governance Tool"
            desc="Bridging the gap between citizens and government schemes using LLMs for context-aware recommendations."
            tags={["OpenAI", "Vector DB", "React"]}
          />
           
           <ProjectCard 
            title="MyHonestMessage"
            subtitle="Anonymous Social"
            desc="A privacy-focused messaging platform handling real-time data streams and anonymous identity management."
            tags={["MongoDB", "Prisma", "Next.js"]}
          />

           <ProjectCard 
            title="HackQuest '25 Winner"
            subtitle="Context Search Engine"
            desc="Built with Team SEAM. An intelligent search tool integrating n8n workflows with a vector database."
            tags={["n8n", "VectorDB", "Hackathon"]}
          />

        </div>

        {/* --- FOOTER --- */}
        <div className="pt-12 pb-6 text-center">
            <p className="text-zinc-600 text-sm">
                Designed by Atulya. Built with React & Tailwind.
            </p>
        </div>

      </div>
    </div>
  );
}

// --- Subcomponents ---

const SocialLink = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => (
  <a 
    href={href}
    target="_blank"
    rel="noreferrer"
    className="p-3 bg-zinc-800 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-700 transition-all duration-200"
    aria-label={label}
  >
    {icon}
  </a>
);

const ProjectCard = ({ title, subtitle, desc, tags }: { title: string, subtitle: string, desc: string, tags: string[] }) => (
  <Card className="group flex flex-col h-full relative overflow-hidden">
    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 duration-300">
      <ArrowUpRight size={20} className="text-white" />
    </div>
    
    <div className="mb-4">
      <div className="text-xs font-medium text-zinc-500 mb-1">{subtitle}</div>
      <h3 className="text-xl font-bold text-zinc-100">{title}</h3>
    </div>
    
    <p className="text-zinc-400 text-sm leading-relaxed mb-6 flex-grow">
      {desc}
    </p>
    
    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-zinc-800/50">
      {tags.map(tag => (
        <span key={tag} className="text-xs text-zinc-500 font-mono">#{tag}</span>
      ))}
    </div>
  </Card>
);