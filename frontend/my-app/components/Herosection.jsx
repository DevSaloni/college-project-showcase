"use client";
import Link from "next/link";

const Herosection = () => {
  return (
<section className="relative w-full overflow-hidden py-10 sm:py-12 lg:py-17">
      {/* Added mt-20 to push hero down after navbar */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row items-center gap-8">
        {/* LEFT — TEXT FIRST ON ALL SMALL SCREENS */}
        <div className="w-full lg:w-1/2 text-center lg:text-left order-1 lg:order-none">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Showcase your college project to the world
          </h1>

          <p className="mt-4 text-base sm:text-lg text-white/80 max-w-xl mx-auto lg:mx-0">
            A platform that connects students, mentors, and recruiters — present your work,
            get feedback, and grab opportunities.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
            <Link
              href="/upload-project"
              className="inline-flex items-center px-6 py-3 rounded-full text-white font-medium shadow-lg"
              style={{ background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))" }}
            >
              Upload Project
            </Link>

            <Link
              href="/explore"
              className="inline-flex items-center px-6 py-3 rounded-full border border-white/10 text-white/90 hover:text-[var(--pv-accent)]"
            >
              Explore Projects
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-6 flex justify-center lg:justify-start items-center gap-6 text-sm text-white/70">
            <div>
              <strong className="text-white">1.2k+</strong>
              <div className="text-xs">Projects</div>
            </div>
            <div>
              <strong className="text-white">300+</strong>
              <div className="text-xs">Mentors</div>
            </div>
            <div>
              <strong className="text-white">500+</strong>
              <div className="text-xs">Recruiters</div>
            </div>
          </div>
        </div>

        {/* RIGHT — IMAGE SECOND ON SMALL SCREENS */}
        <div className="w-full lg:w-1/2 flex justify-center order-2 lg:order-none">
          <div className="relative w-[260px] sm:w-[300px] md:w-[340px] h-[380px] sm:h-[420px] md:h-[440px]">

            {/* Background blob */}
            <svg
              className="absolute -left-10 -top-12 w-40 sm:w-56 h-40 sm:h-56 blur-3xl opacity-80"
              viewBox="0 0 200 200"
            >
              <defs>
                <linearGradient id="blobGrad" x1="0" x2="1">
                  <stop offset="0%" stopColor="var(--pv-accent)" />
                  <stop offset="100%" stopColor="var(--pv-accent-2)" />
                </linearGradient>
              </defs>

              <path
                fill="url(#blobGrad)"
                d="M44.6,-58.7C58.2,-49.8,69.5,-36.3,73.6,-20.9C77.8,-5.5,74.8,11.7,65.6,25.3C56.4,38.9..."
                transform="translate(100 100)"
              />
            </svg>

            {/* Mockup card */}
            <div
              className="relative z-10 rounded-2xl shadow-2xl overflow-hidden mx-auto"
              style={{
                width: "100%",
                height: "100%",
                background: "linear-gradient(180deg, rgba(4,10,20,0.9), rgba(6,18,34,0.95))",
                border: "1px solid rgba(255,255,255,0.03)"
              }}
            >
              <div className="p-4">
                <div className="h-9 w-28 bg-white/6 rounded-md mb-4" />

                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-white/4">
                    <div className="h-3 w-2/3 bg-white/25 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>

                  <div className="p-3 rounded-lg bg-white/4">
                    <div className="h-3 w-1/2 bg-white/25 rounded mb-2" />
                    <div className="h-2 w-1/3 bg-white/10 rounded" />
                  </div>

                  <div className="p-3 rounded-lg bg-white/4">
                    <div className="h-3 w-3/4 bg-white/25 rounded mb-2" />
                    <div className="h-2 w-1/2 bg-white/10 rounded" />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))"
                    }}
                  />

                  <div>
                    <div className="h-3 w-28 bg-white/10 rounded mb-1" />
                    <div className="h-2 w-20 bg-white/8 rounded" />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

export default Herosection;
