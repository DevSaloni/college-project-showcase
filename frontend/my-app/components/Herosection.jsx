"use client";
import Link from "next/link";
import { ArrowRight, Compass, Sparkles, Code, Users, Star, Activity } from "lucide-react";

const Herosection = () => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden flex items-center pt-24 pb-20 font-['Poppins',_sans-serif]">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[#020712] pointer-events-none z-0" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#050A16] via-[#020712] to-[#020712] z-0 pointer-events-none" />

      {/* Dynamic Orbs */}
      <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-[var(--pv-accent)]/10 rounded-full blur-[120px] animate-pulse pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] animate-pulse delay-1000 duration-[4000ms] pointer-events-none z-0" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* LEFT: Content */}
          <div className="w-full lg:w-[55%] xl:w-[60%] text-left space-y-8 order-1 lg:order-none pr-0 xl:pr-10">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-2xl shadow-2xl">
              <Compass size={14} className="text-[var(--pv-accent)]" />
              <span className="text-white/80 text-[10px] uppercase tracking-[0.3em] font-black">Next-Gen Showcase Platform</span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] xl:text-[6rem] font-black text-white leading-[1.05] tracking-tight">
                Elevate Your <br className="hidden sm:block" />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] whitespace-nowrap">
                  Academic Legacy
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-white/50 max-w-lg font-medium leading-relaxed">
                Connect with mentors, impress recruiters, and showcase your institutional projects on a global stage designed for modern innovators.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <Link
                href="/explore"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))] text-black font-black text-xs sm:text-sm uppercase tracking-[0.15em] shadow-lg shadow-[var(--pv-accent)]/20 hover:shadow-[var(--pv-accent)]/40 hover:-translate-y-1 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                <span className="relative flex items-center gap-2">Explore Repository<ArrowRight size={16} /></span>
              </Link>


            </div>
          </div>



        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default Herosection;
