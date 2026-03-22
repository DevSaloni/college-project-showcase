"use client";
import Link from "next/link";

export default function AboutPage() {
  return (
    <section className="relative w-full py-14 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* PAGE TITLE */}
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white">
            About Our Platform
          </h1>
          <p className="mt-4 text-white/70 text-base sm:text-lg">
            Empowering students to showcase real projects, gain visibility, and
            unlock career opportunities.
          </p>
        </div>

        {/* WHO WE ARE */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Who We Are
            </h2>
            <p className="mt-4 text-white/70 leading-relaxed">
              We are a student-focused platform designed to help college students
              present their projects professionally to the world.  
              Instead of projects staying hidden on laptops, we help students
              turn them into real digital portfolios.
            </p>
          </div>

          <div
            className="rounded-2xl p-6 border border-white/10"
            style={{
              background:
                "linear-gradient(180deg, rgba(4,10,20,0.9), rgba(6,18,34,0.95))",
            }}
          >
            <p className="text-white/80 text-sm">
              🚀 Built for students <br />
              🎓 Trusted by mentors <br />
              💼 Valued by recruiters
            </p>
          </div>
        </div>

        {/* WHY THIS PLATFORM */}
        <div className="mt-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">
            Why This Platform?
          </h2>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Real Project Exposure",
                desc: "Showcase academic and personal projects in one professional space.",
              },
              {
                title: "Mentor Feedback",
                desc: "Get guidance, reviews, and suggestions from experienced mentors.",
              },
              {
                title: "Career Opportunities",
                desc: "Help recruiters discover your skills through real work, not just resumes.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="rounded-xl p-6 border border-white/10 bg-white/5"
              >
                <h3 className="text-white font-semibold text-lg">
                  {item.title}
                </h3>
                <p className="mt-2 text-white/70 text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* VISION & MISSION */}
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div>
            <h3 className="text-xl font-bold text-white">Our Vision</h3>
            <p className="mt-3 text-white/70">
              To become the go-to platform where every student can confidently
              showcase their skills and creativity to the world.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white">Our Mission</h3>
            <p className="mt-3 text-white/70">
              To bridge the gap between education and industry by turning student
              projects into real opportunities.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link
            href="/upload-project"
            className="inline-flex items-center px-8 py-4 rounded-full text-white font-medium shadow-lg"
            style={{
              background:
                "linear-gradient(90deg, var(--pv-accent), var(--pv-accent-2))",
            }}
          >
            Start Showcasing Your Project
          </Link>
        </div>

      </div>
    </section>
  );
}
