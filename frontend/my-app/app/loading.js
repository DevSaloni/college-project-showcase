export default function Loading() {
  return (
    <div className="fixed inset-0 bg-black z-[9999] flex flex-col items-center justify-center gap-6">
      {/* Premium Gradient Spinner */}
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 rounded-full border-4 border-white/5" />
        <div className="absolute inset-0 rounded-full border-4 border-t-[var(--pv-accent)] border-r-transparent border-b-transparent border-l-transparent animate-spin shadow-[0_0_20px_rgba(var(--pv-accent-rgb),0.3)]" />
        
        {/* Inner pulsating glow */}
        <div className="absolute inset-4 rounded-full bg-[var(--pv-accent)]/10 animate-pulse blur-sm" />
      </div>

      <div className="space-y-2 text-center">
        <h2 className="text-white font-black text-xl uppercase tracking-[0.3em] animate-pulse">
          ProjectVista
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-transparent via-[var(--pv-accent)] to-transparent mx-auto rounded-full" />
      </div>

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[var(--pv-accent)]/5 blur-[120px] rounded-full pointer-events-none" />
    </div>
  );
}
