"use client";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export default function Herosection() {
  return (
    <section className="relative min-h-[90vh] w-full overflow-hidden flex items-center pt-32 pb-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src="/hero-students.png"
          alt="Indian college students collaborating on laptop on campus"
          className="w-full h-full object-cover scale-105 opacity-[0.8] transition-transform duration-10000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black z-0" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-transparent z-0" />
        <div className="absolute inset-0 bg-black/10 z-0" />
      </div>

      {/* Dynamic Background Elements (Matched to About Page) */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--pv-accent)]/10 blur-[150px] rounded-full pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/5 blur-[180px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)] pointer-events-none z-0" />


      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-16">

          {/* LEFT: Content */}
          <div className="w-full text-left space-y-7">


            {/* Headline (Maximal Impact - Marble-inspired) */}
            <div className="space-y-4">
              <h1 className="text-[clamp(3.5rem,10vw,8rem)] font-black leading-[0.8] tracking-tighter text-white">
                Showcase Your <br />
                <span className="text-transparent bg-clip-text bg-[linear-gradient(135deg,var(--pv-accent),var(--pv-accent-2))]">
                  Academic Projects
                </span>
              </h1>

              <p className="section-text">
                Connect with mentors, impress global recruiters, and showcase your institutional projects on a platform built for the next generation of academic pioneers.
              </p>
            </div>

            {/* Action Buttons (Matched to Homepage Glass Pattern) */}
            <div className="flex flex-col sm:flex-row gap-5 pt-2">
              <Link href="/explore">
                <button className="group relative flex items-center gap-4 px-8 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[var(--pv-accent)]/50 transition-all duration-300 backdrop-blur-md">
                  <span className="text-xs font-black text-white uppercase tracking-widest relative z-10 transition-colors">Explore Repository</span>
                  <div className="w-6 h-6 rounded-full bg-[var(--pv-accent)] flex items-center justify-center group-hover:scale-110 group-hover:translate-x-1 transition-all">
                    <ArrowRight size={12} className="text-black font-black" />
                  </div>
                </button>
              </Link>
            </div>

          </div>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }

        @keyframes float {
          0% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
          100% {
            transform: translateY(0px);
          }
        }
      `}</style>
    </section>
  );
}
