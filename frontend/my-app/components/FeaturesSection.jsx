"use client";
import { Laptop, Layers, Users, Star, Search, Upload } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Upload className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Upload & Showcase Projects",
      desc: "Students can upload project details, images, GitHub links and present their work professionally.",
    },
    {
      icon: <Layers className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Explore by Categories",
      desc: "AI/ML, Blockchain, IoT, Web Development and more — browse projects by modern tech domains.",
    },
    {
      icon: <Users className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Team Collaboration",
      desc: "Add team members, assign roles and highlight contributions of each student.",
    },
    {
      icon: <Star className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Mentor Reviews",
      desc: "Teachers and mentors can rate projects and give constructive feedback.",
    },
    {
      icon: <Search className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Smart Search & Filters",
      desc: "Find projects easily using filters such as domain, year, skills, tools & difficulty.",
    },
    {
      icon: <Laptop className="w-8 h-8 text-[var(--pv-accent)]" />,
      title: "Recruiter-Friendly Profiles",
      desc: "Detailed project cards that help companies evaluate student skills quickly.",
    },
  ];

  return (
    <section className="py-20 bg-[#050A16] relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40 blur-[120px]"
        style={{
          background: "radial-gradient(circle at 20% 30%, var(--pv-accent), transparent 60%)",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <h2 className="text-3xl font-bold text-white text-center">
          Platform Features
        </h2>

        <p className="text-center text-white/70 max-w-2xl mx-auto mt-2 text-[15px]">
          Everything students, mentors, and recruiters need to explore and showcase innovative projects.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          {features.map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl 
              shadow-xl hover:shadow-[0_0_25px_rgba(255,255,255,0.1)]
              hover:-translate-y-2 transition-all"
            >
              <div className="mb-3">{feature.icon}</div>

              <h3 className="text-lg font-semibold text-white mb-1">
                {feature.title}
              </h3>

              <p className="text-white/70 text-[14px]">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
