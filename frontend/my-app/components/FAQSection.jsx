"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "Who is this platform built for?",
      answer: "Our platform is designed for three main groups: Students looking to showcase their academic projects seamlessly, Mentors (Teachers) who validate and verify the work, and Recruiters searching for top-tier emerging talent with specific tech stacks."
    },
    {
      question: "How do students get their projects validated?",
      answer: "Once a student uploads their project details, tech stack, and repository links, assigned mentors can review the submission. Mentors evaluate the architecture, provide a star rating, and leave constructive feedback which instantly reflects as a 'Verified' badge on the student's public profile."
    },
    {
      question: "Can recruiters search for specific technology skills?",
      answer: "Yes! The Explore Portal allows recruiters to search and filter projects precisely by department, technology stack (e.g., React, AI, Blockchain), and specific category. This makes technical talent sourcing highly targeted and brutally efficient."
    },
    {
      question: "Can a project be created by a team?",
      answer: "Absolutely. Students can collaborate seamlessly. When submitting a project, the creator can tag multiple team members from their class or department. The project will automatically link to and showcase all associated contributor profiles."
    },
    {
      question: "Is this platform completely free to use?",
      answer: "Yes. The platform is completely free for students to build their professional pipeline, for teachers to manage academic group validations, and for recruiters to source verified early-career tech talent."
    }
  ];

  return (
    <section className="py-20 bg-[#000000] relative overflow-hidden selection:bg-[var(--pv-accent)] selection:text-black" style={{ fontFamily: "Poppins, sans-serif" }}>

      {/* Decorative Glows */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] blur-[150px] opacity-[0.08] pointer-events-none" style={{ background: "radial-gradient(circle, var(--pv-accent) 0%, transparent 70%)" }} />
      <div className="absolute bottom-[0%] right-[-5%] w-[400px] h-[400px] blur-[150px] opacity-[0.05] pointer-events-none" style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />

      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 relative z-10">

        {/* Section Header (Left-aligned to match Hero/Explore) */}
        <div className="flex flex-col items-start justify-start text-left mb-16 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-4 hover:border-[var(--pv-accent)]/50 transition-all duration-300">
            <span className="w-2 h-2 rounded-full bg-[var(--pv-accent)] shadow-[0_0_10px_var(--pv-accent)]"></span>
            <span className="text-[10px] uppercase font-black tracking-widest text-[var(--pv-accent)] drop-shadow-md">Frequently Asked Questions</span>
          </div>
          <h2 className="section-title mb-8">
            Got questions?  We've got answers
          </h2>
          <p className="section-text">
            Everything you need to know about the product and platform. Can't find the answer you're looking for? Feel free to contact us.
          </p>
        </div>

        {/* FAQ Accordion - Improved with no boxes and sharper text */}
        <div className="space-y-6">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="group border-b border-white/[0.08] transition-all duration-500 overflow-hidden"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left py-7 flex items-center justify-between gap-4 outline-none group-hover:bg-white/[0.01] px-2 rounded-t-xl transition-all"
                >
                  <h3 className={`text-lg sm:text-xl font-black tracking-tight transition-colors duration-300 ${isOpen ? "text-[var(--pv-accent)]" : "text-white/90 group-hover:text-white"}`}>
                    {faq.question}
                  </h3>
                  <div className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-500 origin-center ${isOpen ? "bg-[var(--pv-accent)]/10 text-[var(--pv-accent)] rotate-180" : "bg-white/5 text-white/50 group-hover:text-white group-hover:scale-110"}`}>
                    <ChevronDown size={20} strokeWidth={2.5} />
                  </div>
                </button>

                <div
                  className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                >
                  <div className="overflow-hidden">
                    <div className="px-2 pb-8 section-text text-sm md:text-base leading-relaxed font-light">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>


      </div>
    </section>
  );
}
