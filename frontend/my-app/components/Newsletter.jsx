"use client";

export default function Newsletter() {
  return (
    <section className="w-full min-h-screen flex items-center justify-center px-4 sm:px-6 py-16 sm:py-24 bg-[#050A16] relative overflow-hidden">

      {/* Background Glow */}
      <div
        className="absolute inset-0 opacity-40 blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, var(--pv-accent-2), transparent 70%)",
        }}
      />

      {/* Main Card */}
      <div className="w-full max-w-[600px] sm:max-w-2xl mx-auto relative z-10 bg-white/[0.05] backdrop-blur-2xl 
        border border-white/10 rounded-3xl p-6 sm:p-10 md:p-12 shadow-[0_0_40px_rgba(0,0,0,0.4)]">

        {/* Floating Icon */}
        <div className="absolute -top-10 left-1/2 -translate-x-1/2">
          <div
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shadow-2xl animate-pulse"
            style={{
              background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="white"
              className="w-10 h-10 sm:w-12 sm:h-12"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-1.08 1.916l-7.5 4.687a2.25 2.25 0 01-2.34 0l-7.5-4.687a2.25 2.25 0 01-1.08-1.916V6.75"
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white text-center mt-14 sm:mt-16">
          Stay Updated with <span className="text-[var(--pv-accent)]">ProjectVista</span>
        </h2>

        {/* Paragraph */}
        <p className="text-center text-white/70 mt-2 sm:mt-3 max-w-xl mx-auto text-[20px] sm:text-base md:text-lg">
          Get platform updates, project opportunities, college events, and tech insights — straight to your inbox.
        </p>

        {/* Input + Button */}
        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
          <input
            type="email"
            placeholder="Enter your email"
            className="bg-white/10 border border-white/20 text-white px-4 py-2 sm:px-5 sm:py-3 rounded-xl w-full sm:flex-1
            outline-none placeholder-white/50 focus:ring-2 focus:ring-[var(--pv-accent)] transition text-sm sm:text-base"
          />

          <button
            className="px-6 sm:px-8 py-2 sm:py-3 rounded-xl font-semibold text-white shadow-xl 
            transition hover:scale-105 w-full sm:w-auto text-sm sm:text-base"
            style={{
              background: "linear-gradient(135deg, var(--pv-accent), var(--pv-accent-2))",
            }}
          >
            Subscribe
          </button>
        </div>

        <p className="text-center text-white/50 text-xs sm:text-sm mt-3 sm:mt-4">
          No spam. Only valuable updates 🔥
        </p>
      </div>
    </section>
  );
}
